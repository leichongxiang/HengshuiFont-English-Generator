/*
 * Copyright 2024 English Vocabulary Practice Template Generator Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DatabaseManager } from '../database/manager';
import { VocabularyWord, ImportSession, ImportError } from '../database/schema';
import { FileParser, ParseResult } from '../utils/fileParser';
import { ImportValidator, ImportValidationResult } from '../utils/importValidator';
import { VocabularyIdGenerator } from '../utils/idGenerator';
import path from 'path';

export interface ImportOptions {
  skipDuplicates?: boolean;
  updateExisting?: boolean;
  validateOnly?: boolean;
  batchSize?: number;
}

export interface ImportResult {
  sessionId: string;
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  skippedDuplicates: number;
  errors: ImportError[];
  warnings: string[];
  validationResult?: ImportValidationResult;
}

/**
 * Vocabulary Import Service
 * Handles bulk import of vocabulary data from CSV/JSON files
 */
export class ImportService {
  private static instance: ImportService;
  private dbManager: DatabaseManager;
  private isInitialized: boolean = false;

  private constructor() {
    const dbPath = path.join(process.cwd(), 'data', 'vocabulary.db.json');
    this.dbManager = new DatabaseManager(dbPath);
  }

  static getInstance(): ImportService {
    if (!ImportService.instance) {
      ImportService.instance = new ImportService();
    }
    return ImportService.instance;
  }

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await this.dbManager.initialize();
      this.isInitialized = true;
    }
  }

  /**
   * Import vocabulary from file content
   */
  async importFromContent(
    content: string,
    fileName: string,
    fileType: 'csv' | 'json',
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    await this.ensureInitialized();

    const {
      skipDuplicates = true,
      updateExisting = false,
      validateOnly = false,
      batchSize = 100
    } = options;

    // Create import session
    const session = await this.dbManager.createImportSession({
      fileName,
      fileType,
      totalRecords: 0,
      successfulImports: 0,
      failedImports: 0,
      errors: [],
      status: 'processing'
    });

    try {
      // Parse file content
      const parseResult = this.parseContent(content, fileType);
      if (parseResult.errors.length > 0) {
        await this.dbManager.updateImportSession(session.id, {
          status: 'failed',
          errors: parseResult.errors.map((error, index) => ({
            row: index + 1,
            field: 'file',
            value: '',
            error
          })),
          completedAt: new Date().toISOString()
        });

        return {
          sessionId: session.id,
          totalRecords: 0,
          successfulImports: 0,
          failedImports: 0,
          skippedDuplicates: 0,
          errors: parseResult.errors.map((error, index) => ({
            row: index + 1,
            field: 'file',
            value: '',
            error
          })),
          warnings: parseResult.warnings
        };
      }

      // Validate records
      const validationResult = ImportValidator.validateRecords(parseResult.data);
      
      if (validateOnly) {
        await this.dbManager.updateImportSession(session.id, {
          status: 'completed',
          totalRecords: validationResult.totalRecords,
          completedAt: new Date().toISOString()
        });

        return {
          sessionId: session.id,
          totalRecords: validationResult.totalRecords,
          successfulImports: 0,
          failedImports: validationResult.invalidCount,
          skippedDuplicates: 0,
          errors: validationResult.invalidRecords.map(({ errors, row }) => ({
            row,
            field: errors[0]?.field || 'unknown',
            value: errors[0]?.value || '',
            error: errors.map(e => e.message).join('; ')
          })),
          warnings: validationResult.warnings.map(w => w.message),
          validationResult
        };
      }

      // Check for duplicates
      const existingVocabulary = await this.dbManager.getVocabulary();
      const existingWords = new Set(existingVocabulary.map(w => w.word.toLowerCase()));
      
      let successfulImports = 0;
      let failedImports = 0;
      let skippedDuplicates = 0;
      const errors: ImportError[] = [];
      const warnings: string[] = [...parseResult.warnings];

      // Process valid records in batches
      const validRecords = validationResult.validRecords;
      for (let i = 0; i < validRecords.length; i += batchSize) {
        const batch = validRecords.slice(i, i + batchSize);
        const batchResults = await this.processBatch(
          batch,
          existingWords,
          skipDuplicates,
          updateExisting,
          i + 1
        );

        successfulImports += batchResults.successful;
        failedImports += batchResults.failed;
        skippedDuplicates += batchResults.skipped;
        errors.push(...batchResults.errors);
        warnings.push(...batchResults.warnings);

        // Update existing words set for next batch
        batchResults.newWords.forEach(word => {
          existingWords.add(word.toLowerCase());
        });
      }

      // Add validation errors
      validationResult.invalidRecords.forEach(({ errors: validationErrors, row }) => {
        errors.push({
          row,
          field: validationErrors[0]?.field || 'unknown',
          value: validationErrors[0]?.value || '',
          error: validationErrors.map(e => e.message).join('; ')
        });
        failedImports++;
      });

      // Update import session
      await this.dbManager.updateImportSession(session.id, {
        status: 'completed',
        totalRecords: validationResult.totalRecords,
        successfulImports,
        failedImports,
        errors,
        completedAt: new Date().toISOString()
      });

      return {
        sessionId: session.id,
        totalRecords: validationResult.totalRecords,
        successfulImports,
        failedImports,
        skippedDuplicates,
        errors,
        warnings,
        validationResult
      };

    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await this.dbManager.updateImportSession(session.id, {
        status: 'failed',
        errors: [{
          row: 0,
          field: 'system',
          value: '',
          error: errorMessage
        }],
        completedAt: new Date().toISOString()
      });

      throw error;
    }
  }

  /**
   * Parse file content based on type
   */
  private parseContent(content: string, fileType: 'csv' | 'json'): ParseResult {
    switch (fileType) {
      case 'csv':
        return FileParser.parseCSV(content);
      case 'json':
        return FileParser.parseJSON(content);
      default:
        return {
          data: [],
          errors: [`Unsupported file type: ${fileType}`],
          warnings: []
        };
    }
  }

  /**
   * Process a batch of vocabulary records
   */
  private async processBatch(
    records: Partial<VocabularyWord>[],
    existingWords: Set<string>,
    skipDuplicates: boolean,
    updateExisting: boolean,
    startRow: number
  ): Promise<{
    successful: number;
    failed: number;
    skipped: number;
    errors: ImportError[];
    warnings: string[];
    newWords: string[];
  }> {
    let successful = 0;
    let failed = 0;
    let skipped = 0;
    const errors: ImportError[] = [];
    const warnings: string[] = [];
    const newWords: string[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const row = startRow + i;

      try {
        if (!record.word) {
          errors.push({
            row,
            field: 'word',
            value: '',
            error: 'Word is required'
          });
          failed++;
          continue;
        }

        const wordLower = record.word.toLowerCase();
        
        // Check for duplicates
        if (existingWords.has(wordLower)) {
          if (skipDuplicates) {
            skipped++;
            continue;
          } else if (updateExisting) {
            // TODO: Implement update existing logic
            warnings.push(`Row ${row}: Update existing not yet implemented for word "${record.word}"`);
            skipped++;
            continue;
          }
        }

        // Add the vocabulary word
        await this.dbManager.addVocabulary(record as Omit<VocabularyWord, 'id' | 'createdAt' | 'updatedAt'>);
        
        successful++;
        newWords.push(record.word);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          row,
          field: 'system',
          value: record.word || '',
          error: errorMessage
        });
        failed++;
      }
    }

    return {
      successful,
      failed,
      skipped,
      errors,
      warnings,
      newWords
    };
  }

  /**
   * Get import session by ID
   */
  async getImportSession(sessionId: string): Promise<ImportSession | null> {
    await this.ensureInitialized();
    const sessions = await this.dbManager.getImportSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  /**
   * Get all import sessions
   */
  async getImportSessions(): Promise<ImportSession[]> {
    await this.ensureInitialized();
    return this.dbManager.getImportSessions();
  }

  /**
   * Generate sample templates
   */
  generateCSVTemplate(): string {
    return FileParser.generateCSVTemplate();
  }

  generateJSONTemplate(): string {
    return FileParser.generateJSONTemplate();
  }

  /**
   * Detect file format
   */
  detectFileFormat(content: string): 'csv' | 'json' | 'unknown' {
    return FileParser.detectFormat(content);
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }
}

// Export singleton instance
export const importService = ImportService.getInstance();
