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

import { VocabularyWord, GradeLevel, DifficultyLevel, PartOfSpeech, TextbookVersion } from '../database/schema';
import { VocabularyIdGenerator } from './idGenerator';

export interface ValidationError {
  field: string;
  value: any;
  message: string;
  row?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ImportValidationResult {
  validRecords: Partial<VocabularyWord>[];
  invalidRecords: { record: any; errors: ValidationError[]; row: number }[];
  totalRecords: number;
  validCount: number;
  invalidCount: number;
  warnings: ValidationError[];
}

/**
 * Vocabulary Import Validator
 * Validates vocabulary data for import operations
 */
export class ImportValidator {
  private static readonly REQUIRED_FIELDS = ['word', 'translation', 'grade'];
  private static readonly VALID_GRADES: GradeLevel[] = [
    'primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6',
    'grade7', 'grade8', 'grade9'
  ];
  private static readonly VALID_DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  private static readonly VALID_PARTS_OF_SPEECH: PartOfSpeech[] = [
    'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'article'
  ];
  private static readonly VALID_TEXTBOOK_VERSIONS: TextbookVersion[] = ['PEP', 'Foreign', 'Oxford', 'Cambridge'];

  /**
   * Validate a single vocabulary record
   */
  static validateRecord(record: any, row?: number): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check required fields
    for (const field of this.REQUIRED_FIELDS) {
      if (!record[field] || (typeof record[field] === 'string' && record[field].trim() === '')) {
        errors.push({
          field,
          value: record[field],
          message: `${field} is required`,
          row
        });
      }
    }

    // Validate ID format if provided
    if (record.id) {
      if (!VocabularyIdGenerator.validateId(record.id)) {
        errors.push({
          field: 'id',
          value: record.id,
          message: 'ID must be 7 digits in format CCNNNNN',
          row
        });
      }
    }

    // Validate word
    if (record.word) {
      if (typeof record.word !== 'string') {
        errors.push({
          field: 'word',
          value: record.word,
          message: 'Word must be a string',
          row
        });
      } else if (record.word.length > 50) {
        errors.push({
          field: 'word',
          value: record.word,
          message: 'Word must be 50 characters or less',
          row
        });
      } else if (!/^[a-zA-Z\s\-']+$/.test(record.word)) {
        warnings.push({
          field: 'word',
          value: record.word,
          message: 'Word contains non-English characters',
          row
        });
      }
    }

    // Validate phonetic
    if (record.phonetic) {
      if (typeof record.phonetic !== 'string') {
        errors.push({
          field: 'phonetic',
          value: record.phonetic,
          message: 'Phonetic must be a string',
          row
        });
      } else if (!/^\/.*\/$/.test(record.phonetic)) {
        warnings.push({
          field: 'phonetic',
          value: record.phonetic,
          message: 'Phonetic should be in format /.../',
          row
        });
      }
    }

    // Validate translation
    if (record.translation) {
      if (typeof record.translation !== 'string') {
        errors.push({
          field: 'translation',
          value: record.translation,
          message: 'Translation must be a string',
          row
        });
      } else if (record.translation.length > 200) {
        errors.push({
          field: 'translation',
          value: record.translation,
          message: 'Translation must be 200 characters or less',
          row
        });
      }
    }

    // Validate grade
    if (record.grade && !this.VALID_GRADES.includes(record.grade)) {
      errors.push({
        field: 'grade',
        value: record.grade,
        message: `Grade must be one of: ${this.VALID_GRADES.join(', ')}`,
        row
      });
    }

    // Validate difficulty
    if (record.difficulty && !this.VALID_DIFFICULTIES.includes(record.difficulty)) {
      errors.push({
        field: 'difficulty',
        value: record.difficulty,
        message: `Difficulty must be one of: ${this.VALID_DIFFICULTIES.join(', ')}`,
        row
      });
    }

    // Validate part of speech
    if (record.partOfSpeech && !this.VALID_PARTS_OF_SPEECH.includes(record.partOfSpeech)) {
      errors.push({
        field: 'partOfSpeech',
        value: record.partOfSpeech,
        message: `Part of speech must be one of: ${this.VALID_PARTS_OF_SPEECH.join(', ')}`,
        row
      });
    }

    // Validate textbook version
    if (record.textbookVersion && !this.VALID_TEXTBOOK_VERSIONS.includes(record.textbookVersion)) {
      errors.push({
        field: 'textbookVersion',
        value: record.textbookVersion,
        message: `Textbook version must be one of: ${this.VALID_TEXTBOOK_VERSIONS.join(', ')}`,
        row
      });
    }

    // Validate frequency
    if (record.frequency !== undefined) {
      const freq = Number(record.frequency);
      if (isNaN(freq) || freq < 1 || freq > 10) {
        errors.push({
          field: 'frequency',
          value: record.frequency,
          message: 'Frequency must be a number between 1 and 10',
          row
        });
      }
    }

    // Validate mastery level
    if (record.masteryLevel !== undefined) {
      const level = Number(record.masteryLevel);
      if (isNaN(level) || level < 1 || level > 5) {
        errors.push({
          field: 'masteryLevel',
          value: record.masteryLevel,
          message: 'Mastery level must be a number between 1 and 5',
          row
        });
      }
    }

    // Validate collocations
    if (record.collocations) {
      if (!Array.isArray(record.collocations)) {
        errors.push({
          field: 'collocations',
          value: record.collocations,
          message: 'Collocations must be an array',
          row
        });
      } else if (record.collocations.some((c: any) => typeof c !== 'string')) {
        errors.push({
          field: 'collocations',
          value: record.collocations,
          message: 'All collocations must be strings',
          row
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate multiple vocabulary records
   */
  static validateRecords(records: any[]): ImportValidationResult {
    const validRecords: Partial<VocabularyWord>[] = [];
    const invalidRecords: { record: any; errors: ValidationError[]; row: number }[] = [];
    const allWarnings: ValidationError[] = [];

    records.forEach((record, index) => {
      const row = index + 1;
      const result = this.validateRecord(record, row);

      if (result.isValid) {
        validRecords.push(this.normalizeRecord(record));
      } else {
        invalidRecords.push({
          record,
          errors: result.errors,
          row
        });
      }

      allWarnings.push(...result.warnings);
    });

    return {
      validRecords,
      invalidRecords,
      totalRecords: records.length,
      validCount: validRecords.length,
      invalidCount: invalidRecords.length,
      warnings: allWarnings
    };
  }

  /**
   * Normalize a record to match the database schema
   */
  private static normalizeRecord(record: any): Partial<VocabularyWord> {
    const normalized: Partial<VocabularyWord> = {
      word: record.word?.trim(),
      translation: record.translation?.trim(),
      grade: record.grade,
      category: record.category || '其他',
      difficulty: record.difficulty || 'medium',
      frequency: record.frequency ? Number(record.frequency) : 5,
      partOfSpeech: record.partOfSpeech || 'noun',
      phonetic: record.phonetic?.trim() || `/${record.word}/`,
      textbookVersion: record.textbookVersion,
      unit: record.unit?.trim(),
      example: record.example?.trim(),
      isLearned: record.isLearned === true || record.isLearned === 'true',
      masteryLevel: record.masteryLevel ? Number(record.masteryLevel) : 1
    };

    // Handle collocations
    if (record.collocations) {
      if (Array.isArray(record.collocations)) {
        normalized.collocations = record.collocations.map((c: any) => String(c).trim());
      } else if (typeof record.collocations === 'string') {
        // Split comma-separated string
        normalized.collocations = record.collocations.split(',').map((c: string) => c.trim());
      }
    }

    return normalized;
  }

  /**
   * Check for duplicate words in the import data
   */
  static findDuplicates(records: Partial<VocabularyWord>[]): { word: string; indices: number[] }[] {
    const wordMap = new Map<string, number[]>();
    
    records.forEach((record, index) => {
      if (record.word) {
        const word = record.word.toLowerCase();
        if (!wordMap.has(word)) {
          wordMap.set(word, []);
        }
        wordMap.get(word)!.push(index);
      }
    });

    return Array.from(wordMap.entries())
      .filter(([_, indices]) => indices.length > 1)
      .map(([word, indices]) => ({ word, indices }));
  }

  /**
   * Generate validation summary
   */
  static generateValidationSummary(result: ImportValidationResult): string {
    let summary = `Validation Summary:\n`;
    summary += `- Total records: ${result.totalRecords}\n`;
    summary += `- Valid records: ${result.validCount}\n`;
    summary += `- Invalid records: ${result.invalidCount}\n`;
    summary += `- Warnings: ${result.warnings.length}\n\n`;

    if (result.invalidCount > 0) {
      summary += `Invalid Records:\n`;
      result.invalidRecords.forEach(({ record, errors, row }) => {
        summary += `Row ${row}: ${errors.map(e => e.message).join(', ')}\n`;
      });
      summary += '\n';
    }

    if (result.warnings.length > 0) {
      summary += `Warnings:\n`;
      result.warnings.forEach(warning => {
        summary += `Row ${warning.row}: ${warning.field} - ${warning.message}\n`;
      });
    }

    return summary;
  }
}
