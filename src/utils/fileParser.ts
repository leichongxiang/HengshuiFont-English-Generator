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
 * File Parser Utilities
 * Handles parsing of CSV and JSON files for vocabulary import
 */

export interface ParseResult {
  data: any[];
  errors: string[];
  warnings: string[];
}

export class FileParser {
  /**
   * Parse CSV content to array of objects
   */
  static parseCSV(content: string): ParseResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const data: any[] = [];

    try {
      const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length === 0) {
        errors.push('CSV file is empty');
        return { data, errors, warnings };
      }

      // Parse header
      const headerLine = lines[0];
      const headers = this.parseCSVLine(headerLine);
      
      if (headers.length === 0) {
        errors.push('CSV header is empty');
        return { data, errors, warnings };
      }

      // Validate required headers
      const requiredHeaders = ['word', 'translation', 'grade'];
      const missingHeaders = requiredHeaders.filter(header => 
        !headers.some(h => h.toLowerCase() === header.toLowerCase())
      );
      
      if (missingHeaders.length > 0) {
        errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
        return { data, errors, warnings };
      }

      // Normalize headers (convert to camelCase)
      const normalizedHeaders = headers.map(header => this.normalizeHeader(header));

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = this.parseCSVLine(line);
        
        if (values.length === 0) {
          continue; // Skip empty lines
        }
        
        if (values.length !== headers.length) {
          warnings.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
        }

        const record: any = {};
        normalizedHeaders.forEach((header, index) => {
          const value = values[index] || '';
          record[header] = this.parseValue(value);
        });

        data.push(record);
      }

    } catch (error) {
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { data, errors, warnings };
  }

  /**
   * Parse JSON content to array of objects
   */
  static parseJSON(content: string): ParseResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let data: any[] = [];

    try {
      const parsed = JSON.parse(content);
      
      if (Array.isArray(parsed)) {
        data = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // If it's an object, try to find an array property
        const arrayKeys = Object.keys(parsed).filter(key => Array.isArray(parsed[key]));
        
        if (arrayKeys.length === 1) {
          data = parsed[arrayKeys[0]];
          warnings.push(`Using array from property: ${arrayKeys[0]}`);
        } else if (arrayKeys.length > 1) {
          errors.push(`Multiple arrays found in JSON. Please specify which one to use: ${arrayKeys.join(', ')}`);
          return { data: [], errors, warnings };
        } else {
          // Treat single object as array with one item
          data = [parsed];
          warnings.push('Single object converted to array');
        }
      } else {
        errors.push('JSON must contain an array or object');
        return { data: [], errors, warnings };
      }

      // Validate that all items are objects
      const invalidItems = data.filter((item, index) => typeof item !== 'object' || item === null);
      if (invalidItems.length > 0) {
        errors.push(`${invalidItems.length} items are not valid objects`);
      }

    } catch (error) {
      errors.push(`JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { data, errors, warnings };
  }

  /**
   * Parse a single CSV line, handling quoted values and commas
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    // Add the last field
    result.push(current.trim());

    return result;
  }

  /**
   * Normalize header names to camelCase
   */
  private static normalizeHeader(header: string): string {
    const normalized = header
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .trim()
      .replace(/\s+(.)/g, (_, char) => char.toUpperCase());

    // Map common variations
    const headerMap: Record<string, string> = {
      'english': 'word',
      'englishword': 'word',
      'vocabulary': 'word',
      'chinese': 'translation',
      'chinesetranslation': 'translation',
      'meaning': 'translation',
      'gradelevel': 'grade',
      'class': 'grade',
      'pronunciation': 'phonetic',
      'ipa': 'phonetic',
      'phonetics': 'phonetic',
      'pos': 'partOfSpeech',
      'partofspeech': 'partOfSpeech',
      'wordtype': 'partOfSpeech',
      'type': 'partOfSpeech',
      'freq': 'frequency',
      'textbook': 'textbookVersion',
      'book': 'textbookVersion',
      'version': 'textbookVersion',
      'examples': 'example',
      'samplesentence': 'example',
      'sentence': 'example',
      'learned': 'isLearned',
      'mastery': 'masteryLevel',
      'masteryLevel': 'masteryLevel'
    };

    return headerMap[normalized] || normalized;
  }

  /**
   * Parse and convert string values to appropriate types
   */
  private static parseValue(value: string): any {
    const trimmed = value.trim();
    
    if (trimmed === '') {
      return undefined;
    }

    // Boolean values
    if (trimmed.toLowerCase() === 'true') return true;
    if (trimmed.toLowerCase() === 'false') return false;
    if (trimmed.toLowerCase() === 'yes') return true;
    if (trimmed.toLowerCase() === 'no') return false;

    // Number values
    if (/^\d+$/.test(trimmed)) {
      return parseInt(trimmed, 10);
    }
    if (/^\d*\.\d+$/.test(trimmed)) {
      return parseFloat(trimmed);
    }

    // Array values (comma-separated)
    if (trimmed.includes(',') && !trimmed.includes(' ')) {
      return trimmed.split(',').map(item => item.trim());
    }

    // String value
    return trimmed;
  }

  /**
   * Generate sample CSV template
   */
  static generateCSVTemplate(): string {
    const headers = [
      'word',
      'phonetic',
      'translation',
      'grade',
      'category',
      'difficulty',
      'frequency',
      'partOfSpeech',
      'example',
      'collocations',
      'textbookVersion',
      'unit'
    ];

    const sampleData = [
      [
        'hello',
        '/həˈloʊ/',
        '你好',
        'primary1',
        '问候',
        'easy',
        '10',
        'interjection',
        'Hello, how are you?',
        'hello world,say hello',
        'PEP',
        'Unit 1'
      ],
      [
        'apple',
        '/ˈæpəl/',
        '苹果',
        'primary1',
        '水果',
        'easy',
        '9',
        'noun',
        'I like to eat apples.',
        'red apple,green apple',
        'PEP',
        'Unit 2'
      ]
    ];

    let csv = headers.join(',') + '\n';
    sampleData.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    return csv;
  }

  /**
   * Generate sample JSON template
   */
  static generateJSONTemplate(): string {
    const sampleData = [
      {
        word: 'hello',
        phonetic: '/həˈloʊ/',
        translation: '你好',
        grade: 'primary1',
        category: '问候',
        difficulty: 'easy',
        frequency: 10,
        partOfSpeech: 'interjection',
        example: 'Hello, how are you?',
        collocations: ['hello world', 'say hello'],
        textbookVersion: 'PEP',
        unit: 'Unit 1'
      },
      {
        word: 'apple',
        phonetic: '/ˈæpəl/',
        translation: '苹果',
        grade: 'primary1',
        category: '水果',
        difficulty: 'easy',
        frequency: 9,
        partOfSpeech: 'noun',
        example: 'I like to eat apples.',
        collocations: ['red apple', 'green apple'],
        textbookVersion: 'PEP',
        unit: 'Unit 2'
      }
    ];

    return JSON.stringify(sampleData, null, 2);
  }

  /**
   * Detect file format from content
   */
  static detectFormat(content: string): 'csv' | 'json' | 'unknown' {
    const trimmed = content.trim();
    
    // Check for JSON
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch {
        // Not valid JSON
      }
    }

    // Check for CSV (simple heuristic)
    const lines = trimmed.split('\n');
    if (lines.length >= 2) {
      const firstLine = lines[0];
      const secondLine = lines[1];
      
      // Check if first line looks like headers and second line has similar structure
      if (firstLine.includes(',') && secondLine.includes(',')) {
        const firstCommas = (firstLine.match(/,/g) || []).length;
        const secondCommas = (secondLine.match(/,/g) || []).length;
        
        if (Math.abs(firstCommas - secondCommas) <= 1) {
          return 'csv';
        }
      }
    }

    return 'unknown';
  }
}
