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

/**
 * Database Schema Definitions
 * This file defines the structure for our vocabulary database
 */

export interface VocabularyWord {
  id: string; // 7-digit format: CCNNNNN
  word: string;
  phonetic: string;
  translation: string;
  grade: GradeLevel;
  category: string;
  difficulty: DifficultyLevel;
  frequency: number; // 1-10, 10 being most frequent
  partOfSpeech: PartOfSpeech;
  example?: string;
  collocations?: string[];
  textbookVersion?: TextbookVersion;
  unit?: string;
  isLearned?: boolean;
  masteryLevel?: number; // 1-5
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Category {
  id: string;
  name: string;
  description: string;
  gradeLevel: GradeLevel;
  color?: string; // Hex color for UI
  icon?: string; // Icon name or emoji
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  vocabularyId: string;
  isLearned: boolean;
  masteryLevel: number; // 1-5
  reviewCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  ebbinghausSchedule: EbbinghausSchedule;
  createdAt: string;
  updatedAt: string;
}

export interface EbbinghausSchedule {
  day1: boolean;
  day3: boolean;
  day7: boolean;
  day15: boolean;
  day30: boolean;
}

export interface ImportSession {
  id: string;
  fileName: string;
  fileType: 'csv' | 'json';
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  errors: ImportError[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface ImportError {
  row: number;
  field: string;
  value: string;
  error: string;
}

export interface DatabaseStats {
  totalVocabulary: number;
  vocabularyByGrade: Record<GradeLevel, number>;
  vocabularyByCategory: Record<string, number>;
  totalCategories: number;
  totalUsers: number;
  lastUpdated: string;
}

// Type definitions
export type GradeLevel = 'primary1' | 'primary2' | 'primary3' | 'primary4' | 'primary5' | 'primary6' | 'grade7' | 'grade8' | 'grade9';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection' | 'article';

export type TextbookVersion = 'PEP' | 'Foreign' | 'Oxford' | 'Cambridge';

// Database structure
export interface Database {
  vocabulary: VocabularyWord[];
  categories: Category[];
  userProgress: UserProgress[];
  importSessions: ImportSession[];
  stats: DatabaseStats;
  version: string;
  lastBackup?: string;
}

// Query interfaces
export interface VocabularyQuery {
  id?: string;
  word?: string;
  grade?: GradeLevel;
  category?: string;
  difficulty?: DifficultyLevel;
  partOfSpeech?: PartOfSpeech;
  textbookVersion?: TextbookVersion;
  isLearned?: boolean;
  search?: string; // Search in word, translation, or example
  limit?: number;
  offset?: number;
  sortBy?: 'word' | 'grade' | 'frequency' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryQuery {
  id?: string;
  name?: string;
  gradeLevel?: GradeLevel;
  limit?: number;
  offset?: number;
}

export interface UserProgressQuery {
  userId?: string;
  vocabularyId?: string;
  isLearned?: boolean;
  masteryLevel?: number;
  needsReview?: boolean; // Based on nextReviewAt
  limit?: number;
  offset?: number;
}

// Validation schemas
export const VOCABULARY_VALIDATION = {
  id: {
    required: true,
    pattern: /^\d{7}$/,
    message: 'ID must be 7 digits in format CCNNNNN'
  },
  word: {
    required: true,
    minLength: 1,
    maxLength: 50,
    message: 'Word must be 1-50 characters'
  },
  phonetic: {
    required: true,
    pattern: /^\/.*\/$/,
    message: 'Phonetic must be in format /.../'
  },
  translation: {
    required: true,
    minLength: 1,
    maxLength: 200,
    message: 'Translation must be 1-200 characters'
  },
  grade: {
    required: true,
    enum: ['primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6', 'grade7', 'grade8', 'grade9'],
    message: 'Grade must be valid grade level'
  },
  frequency: {
    required: true,
    min: 1,
    max: 10,
    message: 'Frequency must be between 1 and 10'
  }
};

export const CATEGORY_VALIDATION = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 50,
    message: 'Category name must be 1-50 characters'
  },
  description: {
    maxLength: 500,
    message: 'Description must be less than 500 characters'
  }
};
