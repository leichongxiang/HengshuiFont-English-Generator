import jsPDF from 'jspdf';
import { VocabularyWord } from '@/data/vocabulary';

export interface PDFOptions {
  fontSize: number;
  lineHeight: number;
  wordsPerPage: number;
  includePhonetics: boolean;
  includeTranslations: boolean;
  practiceLines: number;
}

export const defaultPDFOptions: PDFOptions = {
  fontSize: 14,
  lineHeight: 8,
  wordsPerPage: 10,
  includePhonetics: true,
  includeTranslations: true,
  practiceLines: 4
};

export class VocabularyPDFGenerator {
  private pdf: jsPDF;
  private options: PDFOptions;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor(options: PDFOptions = defaultPDFOptions) {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.options = options;
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 20;
  }

  generateTemplate(words: VocabularyWord[], title: string = '英语单词练字模板'): void {
    this.addHeader(title);
    
    let currentY = 40;
    let wordCount = 0;
    
    for (const word of words) {
      if (wordCount > 0 && wordCount % this.options.wordsPerPage === 0) {
        this.pdf.addPage();
        this.addHeader(title);
        currentY = 40;
      }
      
      currentY = this.addWordSection(word, currentY);
      wordCount++;
      
      // Check if we need a new page
      if (currentY > this.pageHeight - 40) {
        this.pdf.addPage();
        this.addHeader(title);
        currentY = 40;
      }
    }
  }

  private addHeader(title: string): void {
    // Title
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    const titleWidth = this.pdf.getTextWidth(title);
    const titleX = (this.pageWidth - titleWidth) / 2;
    this.pdf.text(title, titleX, 25);
    
    // Date
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    const date = new Date().toLocaleDateString('zh-CN');
    this.pdf.text(`日期: ${date}`, this.pageWidth - this.margin - 30, 15);
    
    // Name field
    this.pdf.text('姓名: _______________', this.margin, 15);
  }

  private addWordSection(word: VocabularyWord, startY: number): number {
    let currentY = startY;

    // Word information section
    this.pdf.setFontSize(this.options.fontSize);
    this.pdf.setFont('times', 'bold');

    // English word
    this.pdf.text(word.word, this.margin, currentY);

    // Phonetic transcription
    if (this.options.includePhonetics) {
      this.pdf.setFont('times', 'italic');
      this.pdf.setFontSize(this.options.fontSize - 2);
      this.pdf.text(word.phonetic, this.margin + 60, currentY);
    }

    // Chinese translation
    if (this.options.includeTranslations) {
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(this.options.fontSize - 2);
      this.pdf.text(word.translation, this.margin + 120, currentY);
    }

    currentY += this.options.lineHeight + 2;

    // Draw English writing grid (四线三格)
    currentY = this.drawEnglishWritingGrid(currentY, this.options.practiceLines, word.word);

    currentY += this.options.lineHeight; // Extra space between words

    return currentY;
  }

  public drawEnglishWritingGrid(startY: number, lineCount: number, guideWord?: string): number {
    let currentY = startY;
    const lineHeight = 12; // Height for each writing line set
    const gridWidth = this.pageWidth - 2 * this.margin;

    for (let i = 0; i < lineCount; i++) {
      // Draw the four-line grid (四线三格)
      this.pdf.setDrawColor(180, 180, 180);
      this.pdf.setLineWidth(0.3);

      // Top line
      this.pdf.line(this.margin, currentY, this.margin + gridWidth, currentY);

      // Upper middle line (dotted)
      this.pdf.setLineDashPattern([1, 1], 0);
      this.pdf.line(this.margin, currentY + 4, this.margin + gridWidth, currentY + 4);

      // Lower middle line (dotted)
      this.pdf.line(this.margin, currentY + 8, this.margin + gridWidth, currentY + 8);

      // Bottom line
      this.pdf.setLineDashPattern([], 0); // Reset to solid line
      this.pdf.line(this.margin, currentY + 12, this.margin + gridWidth, currentY + 12);

      // Vertical guides every 15mm
      this.pdf.setDrawColor(220, 220, 220);
      for (let x = this.margin + 15; x < this.margin + gridWidth; x += 15) {
        this.pdf.line(x, currentY, x, currentY + 12);
      }

      // Add faint guide word on first line
      if (i === 0 && guideWord) {
        this.pdf.setTextColor(240, 240, 240);
        this.pdf.setFont('times', 'normal');
        this.pdf.setFontSize(10);
        this.pdf.text(guideWord, this.margin + 2, currentY + 8);
        this.pdf.setTextColor(0, 0, 0); // Reset to black
      }

      currentY += lineHeight + 3; // Space between line sets
    }

    return currentY;
  }

  download(filename: string = 'vocabulary-template.pdf'): void {
    this.pdf.save(filename);
  }

  getBlob(): Blob {
    return this.pdf.output('blob');
  }

  getPDF(): jsPDF {
    return this.pdf;
  }

  public drawCompactWritingGrid(startY: number, lineCount: number, guideWord?: string): number {
    let currentY = startY;
    const lineHeight = 8; // Smaller height for word book
    const gridWidth = this.pageWidth - 2 * this.margin - 100; // Leave space for word info
    const startX = this.margin + 100;

    for (let i = 0; i < lineCount; i++) {
      // Draw the four-line grid (四线三格) - compact version
      this.pdf.setDrawColor(180, 180, 180);
      this.pdf.setLineWidth(0.2);

      // Top line
      this.pdf.line(startX, currentY, startX + gridWidth, currentY);

      // Upper middle line (dotted)
      this.pdf.setLineDashPattern([0.5, 0.5], 0);
      this.pdf.line(startX, currentY + 2.5, startX + gridWidth, currentY + 2.5);

      // Lower middle line (dotted)
      this.pdf.line(startX, currentY + 5.5, startX + gridWidth, currentY + 5.5);

      // Bottom line
      this.pdf.setLineDashPattern([], 0); // Reset to solid line
      this.pdf.line(startX, currentY + 8, startX + gridWidth, currentY + 8);

      // Vertical guides every 10mm
      this.pdf.setDrawColor(220, 220, 220);
      for (let x = startX + 10; x < startX + gridWidth; x += 10) {
        this.pdf.line(x, currentY, x, currentY + 8);
      }

      // Add faint guide word on first line
      if (i === 0 && guideWord) {
        this.pdf.setTextColor(240, 240, 240);
        this.pdf.setFont('times', 'normal');
        this.pdf.setFontSize(8);
        this.pdf.text(guideWord, startX + 1, currentY + 5.5);
        this.pdf.setTextColor(0, 0, 0); // Reset to black
      }

      currentY += lineHeight + 2; // Space between line sets
    }

    return currentY;
  }
}

export function generateVocabularyPDF(
  words: VocabularyWord[], 
  options?: Partial<PDFOptions>,
  title?: string
): VocabularyPDFGenerator {
  const mergedOptions = { ...defaultPDFOptions, ...options };
  const generator = new VocabularyPDFGenerator(mergedOptions);
  generator.generateTemplate(words, title);
  return generator;
}

// Enhanced Ebbinghaus schedule PDF generator with practice grids
export function generateEbbinghausSchedulePDF(
  words: VocabularyWord[],
  startDate: Date = new Date()
): VocabularyPDFGenerator {
  const generator = new VocabularyPDFGenerator({
    fontSize: 12,
    lineHeight: 8,
    wordsPerPage: 8,
    includePhonetics: true,
    includeTranslations: true,
    practiceLines: 2
  });

  const pdf = generator.getPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Schedule intervals
  const intervals = [1, 3, 7, 15, 30];

  intervals.forEach((interval, index) => {
    if (index > 0) pdf.addPage();

    const reviewDate = new Date(startDate);
    reviewDate.setDate(startDate.getDate() + interval);

    // Header for each review day
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    const title = `第${interval}天复习计划`;
    const titleWidth = pdf.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    pdf.text(title, titleX, 25);

    // Date and instructions
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`复习日期: ${reviewDate.toLocaleDateString('zh-CN')}`, margin, 35);
    pdf.text('姓名: _______________', pageWidth - margin - 50, 35);

    pdf.setFontSize(10);
    pdf.text('说明：请在格子中练习书写单词，注意字母的规范性和美观度', margin, 45);

    let currentY = 55;

    // Add words with practice grids for this review session
    const wordsForReview = words.slice(0, Math.min(8, words.length));

    wordsForReview.forEach((word, wordIndex) => {
      // Word information
      pdf.setFontSize(12);
      pdf.setFont('times', 'bold');
      pdf.text(`${wordIndex + 1}. ${word.word}`, margin, currentY);

      pdf.setFont('times', 'italic');
      pdf.setFontSize(10);
      pdf.text(word.phonetic, margin + 50, currentY);

      pdf.setFont('helvetica', 'normal');
      pdf.text(word.translation, margin + 100, currentY);

      currentY += 8;

      // Draw practice grid
      currentY = generator.drawEnglishWritingGrid(currentY, 2, word.word);
      currentY += 5; // Extra space between words

      // Check if we need to continue on next page
      if (currentY > pageHeight - 50 && wordIndex < wordsForReview.length - 1) {
        pdf.addPage();
        currentY = 30;
      }
    });

    // Add review checklist at the bottom
    if (currentY < pageHeight - 60) {
      currentY = pageHeight - 50;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('复习完成情况：', margin, currentY);

      const checkboxes = ['已读', '已写', '已记', '已测'];
      checkboxes.forEach((item, i) => {
        const x = margin + 60 + i * 30;
        pdf.rect(x, currentY - 4, 3, 3);
        pdf.text(item, x + 5, currentY);
      });
    }
  });

  return generator;
}

// Essay template generator for Hengshui style
export function generateEssayTemplatePDF(
  title: string = '英语作文练习',
  essayType: 'narrative' | 'argumentative' | 'descriptive' = 'narrative'
): VocabularyPDFGenerator {
  const generator = new VocabularyPDFGenerator();
  const pdf = generator.getPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  const titleWidth = pdf.getTextWidth(title);
  const titleX = (pageWidth - titleWidth) / 2;
  pdf.text(title, titleX, 25);

  // Student info
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('姓名: _______________', margin, 40);
  pdf.text('班级: _______________', margin + 80, 40);
  pdf.text('日期: _______________', pageWidth - margin - 60, 40);

  // Essay guidelines
  let currentY = 55;
  pdf.setFontSize(10);
  pdf.text('写作要求：', margin, currentY);
  currentY += 5;

  const guidelines = [
    '1. 字迹工整，书写规范，使用衡水体风格',
    '2. 语法正确，用词准确',
    '3. 结构清晰，逻辑连贯',
    '4. 字数控制在80-120词之间'
  ];

  guidelines.forEach(guideline => {
    pdf.text(guideline, margin + 5, currentY);
    currentY += 4;
  });

  currentY += 10;

  // Essay writing grid
  const lineCount = 20;
  const lineSpacing = 8;

  for (let i = 0; i < lineCount; i++) {
    // Draw writing line
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.3);
    pdf.line(margin, currentY, pageWidth - margin, currentY);

    // Add margin line
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin + 15, currentY - lineSpacing + 2, margin + 15, currentY + 2);

    currentY += lineSpacing;

    // Check if we need a new page
    if (currentY > pageHeight - 30 && i < lineCount - 1) {
      pdf.addPage();
      currentY = 30;
    }
  }

  return generator;
}

// Word book PDF generator
export function generateWordBookPDF(
  words: VocabularyWord[],
  bookTitle: string = '我的单词本',
  sortBy: 'alphabetical' | 'grade' | 'frequency' = 'alphabetical'
): VocabularyPDFGenerator {
  const generator = new VocabularyPDFGenerator({
    fontSize: 11,
    lineHeight: 6,
    wordsPerPage: 15,
    includePhonetics: true,
    includeTranslations: true,
    practiceLines: 3
  });

  const pdf = generator.getPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  // Sort words based on preference
  let sortedWords = [...words];
  switch (sortBy) {
    case 'alphabetical':
      sortedWords.sort((a, b) => a.word.localeCompare(b.word));
      break;
    case 'grade':
      sortedWords.sort((a, b) => a.grade.localeCompare(b.grade));
      break;
    case 'frequency':
      sortedWords.sort((a, b) => b.frequency - a.frequency);
      break;
  }

  // Title page
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  const titleWidth = pdf.getTextWidth(bookTitle);
  const titleX = (pageWidth - titleWidth) / 2;
  pdf.text(bookTitle, titleX, 40);

  // Subtitle
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  const subtitle = `共 ${words.length} 个单词 | 排序方式: ${
    sortBy === 'alphabetical' ? '字母顺序' :
    sortBy === 'grade' ? '年级顺序' : '频率顺序'
  }`;
  const subtitleWidth = pdf.getTextWidth(subtitle);
  const subtitleX = (pageWidth - subtitleWidth) / 2;
  pdf.text(subtitle, subtitleX, 55);

  // Date and info
  pdf.setFontSize(10);
  const date = new Date().toLocaleDateString('zh-CN');
  pdf.text(`生成日期: ${date}`, margin, 70);
  pdf.text('姓名: _______________', pageWidth - margin - 50, 70);

  // Instructions
  pdf.setFontSize(9);
  pdf.text('使用说明：', margin, 85);
  pdf.text('1. 每个单词包含音标、中文翻译和例句', margin + 5, 92);
  pdf.text('2. 右侧提供练字格子，请认真书写', margin + 5, 98);
  pdf.text('3. 建议每天复习10-15个单词', margin + 5, 104);

  let currentY = 120;
  let wordCount = 0;

  // Word list with detailed information
  sortedWords.forEach((word, index) => {
    if (wordCount > 0 && wordCount % 12 === 0) {
      pdf.addPage();
      currentY = 30;
    }

    // Word entry
    pdf.setFontSize(14);
    pdf.setFont('times', 'bold');
    pdf.text(`${index + 1}. ${word.word}`, margin, currentY);

    // Phonetic and translation
    pdf.setFontSize(10);
    pdf.setFont('times', 'italic');
    pdf.text(word.phonetic, margin + 50, currentY);

    pdf.setFont('helvetica', 'normal');
    pdf.text(word.translation, margin + 90, currentY);

    // Grade and category info
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const gradeText = word.grade.replace('primary', '小学').replace('grade', '初中') +
                     (word.grade.includes('primary') ? '年级' : '年级');
    pdf.text(`${gradeText} | ${word.category}`, margin + 130, currentY);
    pdf.setTextColor(0, 0, 0);

    currentY += 8;

    // Example sentence
    if (word.example) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.text(`例句: ${word.example}`, margin + 5, currentY);
      pdf.setTextColor(0, 0, 0);
      currentY += 6;
    }

    // Practice grid (smaller version)
    currentY = generator.drawCompactWritingGrid(currentY, 2, word.word);
    currentY += 8;

    wordCount++;

    // Check if we need a new page
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = 30;
    }
  });

  // Add index page at the end
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('单词索引', (pageWidth - pdf.getTextWidth('单词索引')) / 2, 30);

  currentY = 50;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  // Create alphabetical index
  const alphabeticalWords = [...sortedWords].sort((a, b) => a.word.localeCompare(b.word));
  let currentLetter = '';

  alphabeticalWords.forEach((word, index) => {
    const firstLetter = word.word[0].toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      currentY += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.text(currentLetter, margin, currentY);
      currentY += 5;
      pdf.setFont('helvetica', 'normal');
    }

    const pageNum = Math.floor(index / 12) + 2; // +2 because of title page and starting from page 2
    pdf.text(`${word.word} - ${word.translation} (第${pageNum}页)`, margin + 10, currentY);
    currentY += 4;

    if (currentY > pageHeight - 30) {
      pdf.addPage();
      currentY = 30;
    }
  });

  return generator;
}


