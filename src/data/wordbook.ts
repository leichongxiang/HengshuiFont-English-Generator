import { VocabularyWord } from './vocabulary';

export interface WordBook {
  id: string;
  name: string;
  description?: string;
  words: VocabularyWord[];
  createdAt: Date;
  updatedAt: Date;
  color?: string; // 单词本颜色主题
  icon?: string; // 单词本图标
  isDefault?: boolean; // 是否为默认单词本
  studyProgress?: {
    totalWords: number;
    learnedWords: number;
    masteredWords: number;
    reviewDue: number;
  };
}

export interface StudySession {
  id: string;
  wordBookId: string;
  startTime: Date;
  endTime?: Date;
  wordsStudied: string[]; // word IDs
  correctAnswers: number;
  totalQuestions: number;
  sessionType: 'practice' | 'review' | 'test';
}

export interface LearningProgress {
  wordId: string;
  isLearned: boolean;
  masteryLevel: number; // 1-5
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  ebbinghausStage: number; // 0-4 (对应1,3,7,15,30天)
}

// 默认单词本模板
export const defaultWordBooks: Omit<WordBook, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: '小学基础词汇',
    description: '小学1-6年级核心词汇',
    words: [],
    color: '#3B82F6',
    icon: '🎒',
    isDefault: true
  },
  {
    name: '初中必备词汇',
    description: '初中7-9年级重点词汇',
    words: [],
    color: '#10B981',
    icon: '📚',
    isDefault: true
  },
  {
    name: '高频词汇',
    description: '日常使用频率最高的词汇',
    words: [],
    color: '#F59E0B',
    icon: '⭐',
    isDefault: true
  },
  {
    name: '我的收藏',
    description: '个人收藏的重点词汇',
    words: [],
    color: '#EF4444',
    icon: '❤️',
    isDefault: false
  }
];

// 单词本管理工具类
export class WordBookManager {
  private wordBooks: WordBook[] = [];
  private learningProgress: Map<string, LearningProgress> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  // 创建新单词本
  createWordBook(name: string, description?: string, color?: string, icon?: string): WordBook {
    const newWordBook: WordBook = {
      id: this.generateId(),
      name,
      description,
      words: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      color: color || '#6366F1',
      icon: icon || '📖',
      isDefault: false,
      studyProgress: {
        totalWords: 0,
        learnedWords: 0,
        masteredWords: 0,
        reviewDue: 0
      }
    };

    this.wordBooks.push(newWordBook);
    this.saveToStorage();
    return newWordBook;
  }

  // 获取所有单词本
  getAllWordBooks(): WordBook[] {
    return this.wordBooks;
  }

  // 获取单个单词本
  getWordBook(id: string): WordBook | undefined {
    return this.wordBooks.find(book => book.id === id);
  }

  // 添加单词到单词本
  addWordToBook(bookId: string, word: VocabularyWord): boolean {
    const book = this.getWordBook(bookId);
    if (!book) return false;

    // 检查单词是否已存在
    if (book.words.find(w => w.id === word.id)) return false;

    book.words.push(word);
    book.updatedAt = new Date();
    this.updateStudyProgress(bookId);
    this.saveToStorage();
    return true;
  }

  // 从单词本移除单词
  removeWordFromBook(bookId: string, wordId: string): boolean {
    const book = this.getWordBook(bookId);
    if (!book) return false;

    const index = book.words.findIndex(w => w.id === wordId);
    if (index === -1) return false;

    book.words.splice(index, 1);
    book.updatedAt = new Date();
    this.updateStudyProgress(bookId);
    this.saveToStorage();
    return true;
  }

  // 更新学习进度
  updateLearningProgress(wordId: string, progress: Partial<LearningProgress>): void {
    const existing = this.learningProgress.get(wordId) || {
      wordId,
      isLearned: false,
      masteryLevel: 1,
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      ebbinghausStage: 0
    };

    this.learningProgress.set(wordId, { ...existing, ...progress });
    this.saveToStorage();
  }

  // 获取学习进度
  getLearningProgress(wordId: string): LearningProgress | undefined {
    return this.learningProgress.get(wordId);
  }

  // 更新单词本学习统计
  private updateStudyProgress(bookId: string): void {
    const book = this.getWordBook(bookId);
    if (!book) return;

    const totalWords = book.words.length;
    let learnedWords = 0;
    let masteredWords = 0;
    let reviewDue = 0;

    book.words.forEach(word => {
      const progress = this.getLearningProgress(word.id);
      if (progress) {
        if (progress.isLearned) learnedWords++;
        if (progress.masteryLevel >= 4) masteredWords++;
        if (progress.nextReviewDate && progress.nextReviewDate <= new Date()) {
          reviewDue++;
        }
      }
    });

    book.studyProgress = {
      totalWords,
      learnedWords,
      masteredWords,
      reviewDue
    };
  }

  // 删除单词本
  deleteWordBook(id: string): boolean {
    const index = this.wordBooks.findIndex(book => book.id === id);
    if (index === -1) return false;

    this.wordBooks.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // 生成唯一ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 保存到本地存储
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordBooks', JSON.stringify(this.wordBooks));
      localStorage.setItem('learningProgress', JSON.stringify(Array.from(this.learningProgress.entries())));
    }
  }

  // 从本地存储加载
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const savedBooks = localStorage.getItem('wordBooks');
        if (savedBooks) {
          this.wordBooks = JSON.parse(savedBooks).map((book: any) => ({
            ...book,
            createdAt: new Date(book.createdAt),
            updatedAt: new Date(book.updatedAt)
          }));
        }

        const savedProgress = localStorage.getItem('learningProgress');
        if (savedProgress) {
          const progressArray = JSON.parse(savedProgress);
          this.learningProgress = new Map(progressArray);
        }
      } catch (error) {
        console.error('Error loading from storage:', error);
      }
    }
  }

  // 导出单词本数据
  exportWordBook(bookId: string): string {
    const book = this.getWordBook(bookId);
    if (!book) throw new Error('Word book not found');

    return JSON.stringify({
      ...book,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  // 导入单词本数据
  importWordBook(data: string): WordBook {
    try {
      const bookData = JSON.parse(data);
      const newBook: WordBook = {
        ...bookData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.wordBooks.push(newBook);
      this.saveToStorage();
      return newBook;
    } catch (error) {
      throw new Error('Invalid word book data');
    }
  }
}

// 全局单词本管理器实例
export const wordBookManager = new WordBookManager();
