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

// Note: fs and path are only available in Node.js environment
// For client-side usage, we'll use alternative approaches
// Dynamic imports will be used to avoid bundling these modules
import {
  Database,
  VocabularyWord,
  Category,
  UserProgress,
  ImportSession,
  VocabularyQuery,
  CategoryQuery,
  UserProgressQuery,
  DatabaseStats,
  GradeLevel
} from './schema';
import { VocabularyIdGenerator } from '../utils/idGenerator';

/**
 * JSON-based Database Manager
 * Provides SQLite-like functionality using JSON files
 */
export class DatabaseManager {
  private dbPath: string;
  private db: Database;
  private isInitialized: boolean = false;

  constructor(dbPath: string = 'data/vocabulary.db.json') {
    this.dbPath = dbPath;
    this.db = this.getDefaultDatabase();
  }

  /**
   * Initialize the database
   */
  async initialize(): Promise<void> {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Client-side initialization
        await this.loadDatabase();
        this.isInitialized = true;
        console.log('Database initialized (client-side)');
        return;
      }

      // Server-side initialization
      const fs = await import('fs');
      const path = await import('path');

      // Ensure directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Load existing database or create new one
      if (fs.existsSync(this.dbPath)) {
        await this.loadDatabase();
      } else {
        await this.createDatabase();
      }

      this.isInitialized = true;
      console.log(`Database initialized at: ${this.dbPath}`);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Don't throw error in client-side to avoid breaking the app
      if (typeof window === 'undefined') {
        throw error;
      } else {
        // Fallback to default database in client-side
        this.db = this.getDefaultDatabase();
        this.isInitialized = true;
        console.log('Database initialized with default data (client-side fallback)');
      }
    }
  }

  /**
   * Load database from file
   * In client-side, we'll load from the static JSON file
   */
  private async loadDatabase(): Promise<void> {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Client-side: load from public directory
        const response = await fetch('/data/vocabulary.db.json');
        if (!response.ok) {
          throw new Error(`Failed to load database: ${response.statusText}`);
        }
        this.db = await response.json();
      } else {
        // Server-side: use dynamic import to avoid bundling fs
        const fs = await import('fs');
        const path = await import('path');
        const resolvedPath = path.resolve(this.dbPath);
        const data = fs.readFileSync(resolvedPath, 'utf8');
        this.db = JSON.parse(data);
      }

      // Validate database structure
      if (!this.db.vocabulary || !this.db.categories || !this.db.userProgress) {
        throw new Error('Invalid database structure');
      }

      console.log(`Loaded database with ${this.db.vocabulary.length} vocabulary words`);
    } catch (error) {
      console.error('Failed to load database:', error);
      // Fallback to default database if loading fails
      this.db = this.getDefaultDatabase();
    }
  }

  /**
   * Create new database
   */
  private async createDatabase(): Promise<void> {
    this.db = this.getDefaultDatabase();
    await this.saveDatabase();
    console.log('Created new database');
  }

  /**
   * Save database to file
   */
  private async saveDatabase(): Promise<void> {
    try {
      // Update stats before saving
      this.updateStats();

      const data = JSON.stringify(this.db, null, 2);

      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Client-side: save to localStorage as fallback
        localStorage.setItem('vocabulary_db_backup', data);
        console.log('Database saved to localStorage (client-side backup)');
      } else {
        // Server-side: save to file
        const fs = await import('fs');
        const path = await import('path');
        const resolvedPath = path.resolve(this.dbPath);
        fs.writeFileSync(resolvedPath, data, 'utf8');
        console.log('Database saved to file successfully');
      }
    } catch (error) {
      console.error('Failed to save database:', error);
      // Don't throw error in client-side to avoid breaking the app
      if (typeof window === 'undefined') {
        throw error;
      }
    }
  }

  /**
   * Get default database structure
   */
  private getDefaultDatabase(): Database {
    return {
      vocabulary: [],
      categories: [],
      userProgress: [],
      importSessions: [],
      stats: {
        totalVocabulary: 0,
        vocabularyByGrade: {
          primary1: 0, primary2: 0, primary3: 0, primary4: 0, primary5: 0, primary6: 0,
          grade7: 0, grade8: 0, grade9: 0
        },
        vocabularyByCategory: {},
        totalCategories: 0,
        totalUsers: 0,
        lastUpdated: new Date().toISOString()
      },
      version: '1.0.0',
      lastBackup: undefined
    };
  }

  /**
   * Update database statistics
   */
  private updateStats(): void {
    const stats: DatabaseStats = {
      totalVocabulary: this.db.vocabulary.length,
      vocabularyByGrade: {
        primary1: 0, primary2: 0, primary3: 0, primary4: 0, primary5: 0, primary6: 0,
        grade7: 0, grade8: 0, grade9: 0
      },
      vocabularyByCategory: {},
      totalCategories: this.db.categories.length,
      totalUsers: new Set(this.db.userProgress.map(p => p.userId)).size,
      lastUpdated: new Date().toISOString()
    };

    // Count by grade
    for (const word of this.db.vocabulary) {
      stats.vocabularyByGrade[word.grade]++;
    }

    // Count by category
    for (const word of this.db.vocabulary) {
      stats.vocabularyByCategory[word.category] = (stats.vocabularyByCategory[word.category] || 0) + 1;
    }

    this.db.stats = stats;
  }

  /**
   * Import session operations
   */

  async createImportSession(session: Omit<ImportSession, 'id' | 'createdAt'>): Promise<ImportSession> {
    this.ensureInitialized();

    const id = `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newSession: ImportSession = {
      ...session,
      id,
      createdAt: now
    };

    this.db.importSessions.push(newSession);
    await this.saveDatabase();

    return newSession;
  }

  async updateImportSession(id: string, updates: Partial<ImportSession>): Promise<ImportSession | null> {
    this.ensureInitialized();

    const index = this.db.importSessions.findIndex(s => s.id === id);
    if (index === -1) return null;

    const updatedSession = {
      ...this.db.importSessions[index],
      ...updates
    };

    this.db.importSessions[index] = updatedSession;
    await this.saveDatabase();

    return updatedSession;
  }

  async getImportSessions(): Promise<ImportSession[]> {
    this.ensureInitialized();
    return [...this.db.importSessions];
  }

  /**
   * Vocabulary CRUD operations
   */

  async addVocabulary(word: Omit<VocabularyWord, 'id' | 'createdAt' | 'updatedAt'>): Promise<VocabularyWord> {
    this.ensureInitialized();

    const existingIds = this.db.vocabulary.map(w => w.id);
    const id = VocabularyIdGenerator.getNextAvailableId(word.grade, existingIds);
    
    const now = new Date().toISOString();
    const newWord: VocabularyWord = {
      ...word,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.db.vocabulary.push(newWord);
    await this.saveDatabase();

    return newWord;
  }

  async getVocabulary(query: VocabularyQuery = {}): Promise<VocabularyWord[]> {
    this.ensureInitialized();

    let results = [...this.db.vocabulary];

    // Apply filters
    if (query.id) results = results.filter(w => w.id === query.id);
    if (query.word) results = results.filter(w => w.word.toLowerCase().includes(query.word!.toLowerCase()));
    if (query.grade) results = results.filter(w => w.grade === query.grade);
    if (query.category) results = results.filter(w => w.category === query.category);
    if (query.difficulty) results = results.filter(w => w.difficulty === query.difficulty);
    if (query.partOfSpeech) results = results.filter(w => w.partOfSpeech === query.partOfSpeech);
    if (query.textbookVersion) results = results.filter(w => w.textbookVersion === query.textbookVersion);
    if (query.isLearned !== undefined) results = results.filter(w => w.isLearned === query.isLearned);
    
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      results = results.filter(w => 
        w.word.toLowerCase().includes(searchTerm) ||
        w.translation.toLowerCase().includes(searchTerm) ||
        (w.example && w.example.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    if (query.sortBy) {
      const sortOrder = query.sortOrder || 'asc';
      results.sort((a, b) => {
        const aVal = a[query.sortBy!];
        const bVal = b[query.sortBy!];
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    if (query.offset) results = results.slice(query.offset);
    if (query.limit) results = results.slice(0, query.limit);

    return results;
  }

  async updateVocabulary(id: string, updates: Partial<VocabularyWord>): Promise<VocabularyWord | null> {
    this.ensureInitialized();

    const index = this.db.vocabulary.findIndex(w => w.id === id);
    if (index === -1) return null;

    const updatedWord = {
      ...this.db.vocabulary[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.db.vocabulary[index] = updatedWord;
    await this.saveDatabase();

    return updatedWord;
  }

  async deleteVocabulary(id: string): Promise<boolean> {
    this.ensureInitialized();

    const index = this.db.vocabulary.findIndex(w => w.id === id);
    if (index === -1) return false;

    this.db.vocabulary.splice(index, 1);
    await this.saveDatabase();

    return true;
  }

  /**
   * Bulk operations
   */

  async bulkAddVocabulary(words: Omit<VocabularyWord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<VocabularyWord[]> {
    this.ensureInitialized();

    const existingIds = this.db.vocabulary.map(w => w.id);
    const now = new Date().toISOString();
    const newWords: VocabularyWord[] = [];

    for (const word of words) {
      const id = VocabularyIdGenerator.getNextAvailableId(word.grade, [...existingIds, ...newWords.map(w => w.id)]);
      
      const newWord: VocabularyWord = {
        ...word,
        id,
        createdAt: now,
        updatedAt: now
      };

      newWords.push(newWord);
    }

    this.db.vocabulary.push(...newWords);
    await this.saveDatabase();

    return newWords;
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<DatabaseStats> {
    this.ensureInitialized();
    this.updateStats();
    return { ...this.db.stats };
  }

  /**
   * Backup and restore
   */

  async createBackup(backupPath?: string): Promise<string> {
    this.ensureInitialized();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultBackupPath = `${this.dbPath}.backup.${timestamp}`;
    const finalBackupPath = backupPath || defaultBackupPath;

    fs.copyFileSync(this.dbPath, finalBackupPath);
    
    this.db.lastBackup = new Date().toISOString();
    await this.saveDatabase();

    return finalBackupPath;
  }

  /**
   * Utility methods
   */

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }

  async close(): Promise<void> {
    if (this.isInitialized) {
      await this.saveDatabase();
      this.isInitialized = false;
    }
  }

  getDatabasePath(): string {
    return this.dbPath;
  }

  async getDatabaseSize(): Promise<number> {
    if (fs.existsSync(this.dbPath)) {
      const stats = fs.statSync(this.dbPath);
      return stats.size;
    }
    return 0;
  }
}
