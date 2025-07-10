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
 * 7-digit ID System for Vocabulary Words
 * Format: CCNNNNN
 * - CC: Category/Grade classification (01-09)
 * - NNNNN: Sequential order within category (00001-99999)
 */

export type GradeLevel = 'primary1' | 'primary2' | 'primary3' | 'primary4' | 'primary5' | 'primary6' | 'grade7' | 'grade8' | 'grade9';

export interface GradeMapping {
  grade: GradeLevel;
  code: string;
  name: string;
  description: string;
}

export const GRADE_MAPPINGS: Record<GradeLevel, GradeMapping> = {
  primary1: { grade: 'primary1', code: '01', name: '小学一年级', description: 'Primary Grade 1' },
  primary2: { grade: 'primary2', code: '02', name: '小学二年级', description: 'Primary Grade 2' },
  primary3: { grade: 'primary3', code: '03', name: '小学三年级', description: 'Primary Grade 3' },
  primary4: { grade: 'primary4', code: '04', name: '小学四年级', description: 'Primary Grade 4' },
  primary5: { grade: 'primary5', code: '05', name: '小学五年级', description: 'Primary Grade 5' },
  primary6: { grade: 'primary6', code: '06', name: '小学六年级', description: 'Primary Grade 6' },
  grade7: { grade: 'grade7', code: '07', name: '初中七年级', description: 'Junior High Grade 7' },
  grade8: { grade: 'grade8', code: '08', name: '初中八年级', description: 'Junior High Grade 8' },
  grade9: { grade: 'grade9', code: '09', name: '初中九年级', description: 'Junior High Grade 9' }
};

export class VocabularyIdGenerator {
  private static gradeCounters: Record<string, number> = {};

  /**
   * Generate a new 7-digit ID for a vocabulary word
   * @param grade The grade level for the vocabulary word
   * @returns A 7-digit ID in format CCNNNNN
   */
  static generateId(grade: GradeLevel): string {
    const gradeMapping = GRADE_MAPPINGS[grade];
    if (!gradeMapping) {
      throw new Error(`Invalid grade level: ${grade}`);
    }

    const gradeCode = gradeMapping.code;
    
    // Initialize counter for this grade if not exists
    if (!this.gradeCounters[gradeCode]) {
      this.gradeCounters[gradeCode] = 0;
    }

    // Increment counter and format as 5-digit number
    this.gradeCounters[gradeCode]++;
    const sequence = this.gradeCounters[gradeCode].toString().padStart(5, '0');

    if (this.gradeCounters[gradeCode] > 99999) {
      throw new Error(`Maximum vocabulary words exceeded for grade ${grade} (99999)`);
    }

    return `${gradeCode}${sequence}`;
  }

  /**
   * Parse a 7-digit ID to extract grade and sequence information
   * @param id The 7-digit ID to parse
   * @returns Object containing grade code, sequence number, and grade level
   */
  static parseId(id: string): { gradeCode: string; sequence: number; grade: GradeLevel | null } {
    if (!/^\d{7}$/.test(id)) {
      throw new Error(`Invalid ID format: ${id}. Expected 7-digit format CCNNNNN`);
    }

    const gradeCode = id.substring(0, 2);
    const sequence = parseInt(id.substring(2), 10);

    // Find matching grade level
    const grade = Object.values(GRADE_MAPPINGS).find(mapping => mapping.code === gradeCode)?.grade || null;

    return { gradeCode, sequence, grade };
  }

  /**
   * Validate a 7-digit ID format
   * @param id The ID to validate
   * @returns True if valid, false otherwise
   */
  static validateId(id: string): boolean {
    try {
      const parsed = this.parseId(id);
      return parsed.grade !== null && parsed.sequence > 0 && parsed.sequence <= 99999;
    } catch {
      return false;
    }
  }

  /**
   * Get the next available ID for a specific grade
   * @param grade The grade level
   * @param existingIds Array of existing IDs to check against
   * @returns The next available 7-digit ID
   */
  static getNextAvailableId(grade: GradeLevel, existingIds: string[] = []): string {
    const gradeMapping = GRADE_MAPPINGS[grade];
    const gradeCode = gradeMapping.code;

    // Find the highest sequence number for this grade
    const gradeIds = existingIds.filter(id => id.startsWith(gradeCode));
    let maxSequence = 0;

    for (const id of gradeIds) {
      try {
        const parsed = this.parseId(id);
        if (parsed.sequence > maxSequence) {
          maxSequence = parsed.sequence;
        }
      } catch {
        // Skip invalid IDs
      }
    }

    // Generate next sequence number
    const nextSequence = (maxSequence + 1).toString().padStart(5, '0');
    
    if (maxSequence >= 99999) {
      throw new Error(`Maximum vocabulary words exceeded for grade ${grade} (99999)`);
    }

    return `${gradeCode}${nextSequence}`;
  }

  /**
   * Reset counters (useful for testing)
   */
  static resetCounters(): void {
    this.gradeCounters = {};
  }

  /**
   * Set counter for a specific grade (useful for migration)
   * @param grade The grade level
   * @param count The counter value to set
   */
  static setGradeCounter(grade: GradeLevel, count: number): void {
    const gradeMapping = GRADE_MAPPINGS[grade];
    this.gradeCounters[gradeMapping.code] = count;
  }

  /**
   * Get all grade mappings
   * @returns Array of all grade mappings
   */
  static getAllGradeMappings(): GradeMapping[] {
    return Object.values(GRADE_MAPPINGS);
  }

  /**
   * Convert old simple ID to new 7-digit format
   * @param oldId The old simple numeric ID
   * @param grade The grade level for this word
   * @param existingIds Array of existing new format IDs
   * @returns New 7-digit ID
   */
  static migrateOldId(oldId: string, grade: GradeLevel, existingIds: string[] = []): string {
    return this.getNextAvailableId(grade, existingIds);
  }
}
