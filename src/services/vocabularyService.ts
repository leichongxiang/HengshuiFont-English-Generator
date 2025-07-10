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
import { VocabularyWord, VocabularyQuery, GradeLevel, DatabaseStats } from '../database/schema';
import path from 'path';

/**
 * Vocabulary Service
 * Provides high-level vocabulary operations using the database
 */
export class VocabularyService {
  private static instance: VocabularyService;
  private dbManager: DatabaseManager;
  private isInitialized: boolean = false;

  private constructor() {
    // Use relative path from project root
    const dbPath = path.join(process.cwd(), 'data', 'vocabulary.db.json');
    this.dbManager = new DatabaseManager(dbPath);
  }

  /**
   * Get singleton instance
   */
  static getInstance(): VocabularyService {
    if (!VocabularyService.instance) {
      VocabularyService.instance = new VocabularyService();
    }
    return VocabularyService.instance;
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await this.dbManager.initialize();
      this.isInitialized = true;
    }
  }

  /**
   * Get all vocabulary words
   */
  async getAllVocabulary(): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    return this.dbManager.getVocabulary();
  }

  /**
   * Get vocabulary by grade
   */
  async getVocabularyByGrade(grade: GradeLevel): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    return this.dbManager.getVocabulary({ grade });
  }

  /**
   * Get vocabulary by category
   */
  async getVocabularyByCategory(category: string): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    return this.dbManager.getVocabulary({ category });
  }

  /**
   * Search vocabulary
   */
  async searchVocabulary(searchTerm: string): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    return this.dbManager.getVocabulary({ search: searchTerm });
  }

  /**
   * Get vocabulary with advanced filtering
   */
  async getVocabulary(query: VocabularyQuery): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    return this.dbManager.getVocabulary(query);
  }

  /**
   * Get vocabulary by ID
   */
  async getVocabularyById(id: string): Promise<VocabularyWord | null> {
    await this.ensureInitialized();
    const results = await this.dbManager.getVocabulary({ id });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Add new vocabulary word
   */
  async addVocabulary(word: Omit<VocabularyWord, 'id' | 'createdAt' | 'updatedAt'>): Promise<VocabularyWord> {
    await this.ensureInitialized();
    return this.dbManager.addVocabulary(word);
  }

  /**
   * Update vocabulary word
   */
  async updateVocabulary(id: string, updates: Partial<VocabularyWord>): Promise<VocabularyWord | null> {
    await this.ensureInitialized();
    return this.dbManager.updateVocabulary(id, updates);
  }

  /**
   * Delete vocabulary word
   */
  async deleteVocabulary(id: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.dbManager.deleteVocabulary(id);
  }

  /**
   * Bulk add vocabulary words
   */
  async bulkAddVocabulary(words: Omit<VocabularyWord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    return this.dbManager.bulkAddVocabulary(words);
  }

  /**
   * Get vocabulary statistics
   */
  async getStats(): Promise<DatabaseStats> {
    await this.ensureInitialized();
    return this.dbManager.getStats();
  }

  /**
   * Get vocabulary grouped by grade
   */
  async getVocabularyByGradeGrouped(): Promise<Record<GradeLevel, VocabularyWord[]>> {
    await this.ensureInitialized();
    const allVocabulary = await this.getAllVocabulary();
    
    const grouped: Record<GradeLevel, VocabularyWord[]> = {
      primary1: [], primary2: [], primary3: [], primary4: [], primary5: [], primary6: [],
      grade7: [], grade8: [], grade9: []
    };

    for (const word of allVocabulary) {
      grouped[word.grade].push(word);
    }

    return grouped;
  }

  /**
   * Get high frequency vocabulary
   */
  async getHighFrequencyVocabulary(minFrequency: number = 8, limit?: number): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    const query: VocabularyQuery = {
      sortBy: 'frequency',
      sortOrder: 'desc'
    };
    
    if (limit) query.limit = limit;
    
    const results = await this.dbManager.getVocabulary(query);
    return results.filter(word => word.frequency >= minFrequency);
  }

  /**
   * Get vocabulary for specific textbook
   */
  async getVocabularyByTextbook(textbookVersion: string): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    return this.dbManager.getVocabulary({ textbookVersion: textbookVersion as any });
  }

  /**
   * Get random vocabulary words
   */
  async getRandomVocabulary(count: number, grade?: GradeLevel): Promise<VocabularyWord[]> {
    await this.ensureInitialized();
    
    const query: VocabularyQuery = grade ? { grade } : {};
    const allWords = await this.dbManager.getVocabulary(query);
    
    // Shuffle array and take first 'count' items
    const shuffled = allWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Get vocabulary categories
   */
  async getCategories(): Promise<string[]> {
    await this.ensureInitialized();
    const stats = await this.getStats();
    return Object.keys(stats.vocabularyByCategory);
  }

  /**
   * Create backup
   */
  async createBackup(): Promise<string> {
    await this.ensureInitialized();
    return this.dbManager.createBackup();
  }

  /**
   * Get database info
   */
  async getDatabaseInfo(): Promise<{ path: string; size: number; stats: DatabaseStats }> {
    await this.ensureInitialized();
    
    const path = this.dbManager.getDatabasePath();
    const size = await this.dbManager.getDatabaseSize();
    const stats = await this.getStats();
    
    return { path, size, stats };
  }

  /**
   * Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Close the service
   */
  async close(): Promise<void> {
    if (this.isInitialized) {
      await this.dbManager.close();
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export const vocabularyService = VocabularyService.getInstance();
