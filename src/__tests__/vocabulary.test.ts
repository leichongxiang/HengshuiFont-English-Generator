import { vocabularyData, vocabularyByGrade, presetTemplates } from '@/data/vocabulary'
import { VocabularyWord } from '@/data/vocabulary'

describe('Vocabulary Data', () => {
  describe('vocabularyData', () => {
    it('should contain vocabulary words', () => {
      expect(vocabularyData).toBeDefined()
      expect(Array.isArray(vocabularyData)).toBe(true)
      expect(vocabularyData.length).toBeGreaterThan(0)
    })

    it('should have valid vocabulary word structure', () => {
      const word = vocabularyData[0]
      expect(word).toHaveProperty('id')
      expect(word).toHaveProperty('word')
      expect(word).toHaveProperty('phonetic')
      expect(word).toHaveProperty('translation')
      expect(word).toHaveProperty('grade')
      expect(word).toHaveProperty('category')
      expect(word).toHaveProperty('difficulty')
      expect(word).toHaveProperty('frequency')
      expect(word).toHaveProperty('partOfSpeech')
    })

    it('should have unique IDs for all words', () => {
      const ids = vocabularyData.map(word => word.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid grade values', () => {
      const validGrades = ['primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6', 'grade7', 'grade8', 'grade9']
      vocabularyData.forEach(word => {
        expect(validGrades).toContain(word.grade)
      })
    })

    it('should have valid difficulty values', () => {
      const validDifficulties = ['easy', 'medium', 'hard']
      vocabularyData.forEach(word => {
        expect(validDifficulties).toContain(word.difficulty)
      })
    })

    it('should have valid frequency values', () => {
      vocabularyData.forEach(word => {
        expect(word.frequency).toBeGreaterThanOrEqual(1)
        expect(word.frequency).toBeLessThanOrEqual(10)
      })
    })

    it('should have valid part of speech values', () => {
      const validPartsOfSpeech = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'article']
      vocabularyData.forEach(word => {
        expect(validPartsOfSpeech).toContain(word.partOfSpeech)
      })
    })
  })

  describe('vocabularyByGrade', () => {
    it('should group words by grade correctly', () => {
      expect(vocabularyByGrade).toBeDefined()
      expect(vocabularyByGrade.primary1).toBeDefined()
      expect(vocabularyByGrade.primary2).toBeDefined()
      expect(vocabularyByGrade.primary3).toBeDefined()
    })

    it('should contain only words of the correct grade', () => {
      Object.entries(vocabularyByGrade).forEach(([grade, words]) => {
        words.forEach(word => {
          expect(word.grade).toBe(grade)
        })
      })
    })

    it('should have primary1 words', () => {
      expect(vocabularyByGrade.primary1.length).toBeGreaterThan(0)
    })
  })

  describe('presetTemplates', () => {
    it('should contain preset templates', () => {
      expect(presetTemplates).toBeDefined()
      expect(typeof presetTemplates).toBe('object')
      expect(Object.keys(presetTemplates).length).toBeGreaterThan(0)
    })

    it('should have valid template structure', () => {
      Object.values(presetTemplates).forEach(template => {
        expect(template).toHaveProperty('name')
        expect(template).toHaveProperty('description')
        expect(template).toHaveProperty('words')
        expect(Array.isArray(template.words)).toBe(true)
      })
    })

    it('should have grade-based templates', () => {
      const gradeTemplates = Object.values(presetTemplates).filter(template => 'grade' in template)
      expect(gradeTemplates.length).toBeGreaterThan(0)
    })

    it('should have category-based templates', () => {
      const categoryTemplates = Object.values(presetTemplates).filter(template => 'category' in template)
      expect(categoryTemplates.length).toBeGreaterThan(0)
    })

    it('should have high-frequency templates', () => {
      const highFreqTemplates = Object.values(presetTemplates).filter(template => 'type' in template && template.type === 'high_frequency')
      expect(highFreqTemplates.length).toBeGreaterThan(0)
    })
  })

  describe('Word Quality', () => {
    it('should have non-empty word strings', () => {
      vocabularyData.forEach(word => {
        expect(word.word.trim()).not.toBe('')
        expect(word.word).toMatch(/^[a-zA-Z\s'-]+$/) // Only letters, spaces, apostrophes, and hyphens
      })
    })

    it('should have non-empty translations', () => {
      vocabularyData.forEach(word => {
        expect(word.translation.trim()).not.toBe('')
      })
    })

    it('should have valid phonetic transcriptions', () => {
      vocabularyData.forEach(word => {
        expect(word.phonetic).toMatch(/^\/.*\/$/) // Should start and end with forward slashes
      })
    })

    it('should have meaningful categories', () => {
      vocabularyData.forEach(word => {
        expect(word.category.trim()).not.toBe('')
        expect(word.category.length).toBeGreaterThan(1)
      })
    })

    it('should have examples when provided', () => {
      vocabularyData.forEach(word => {
        if (word.example) {
          expect(word.example.trim()).not.toBe('')
          expect(word.example.toLowerCase()).toContain(word.word.toLowerCase())
        }
      })
    })

    it('should have valid collocations when provided', () => {
      vocabularyData.forEach(word => {
        if (word.collocations) {
          expect(Array.isArray(word.collocations)).toBe(true)
          word.collocations.forEach(collocation => {
            expect(collocation.trim()).not.toBe('')
          })
        }
      })
    })
  })

  describe('Data Consistency', () => {
    it('should have consistent textbook versions', () => {
      const validVersions = ['PEP', 'Foreign', 'Oxford', 'Cambridge']
      vocabularyData.forEach(word => {
        if (word.textbookVersion) {
          expect(validVersions).toContain(word.textbookVersion)
        }
      })
    })

    it('should have reasonable word lengths', () => {
      vocabularyData.forEach(word => {
        expect(word.word.length).toBeGreaterThan(0)
        expect(word.word.length).toBeLessThan(50) // Reasonable maximum length
      })
    })

    it('should have reasonable translation lengths', () => {
      vocabularyData.forEach(word => {
        expect(word.translation.length).toBeGreaterThan(0)
        expect(word.translation.length).toBeLessThan(100) // Reasonable maximum length
      })
    })
  })
})
