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

import jsPDF from 'jspdf';
import { VocabularyWord } from '@/data/vocabulary';

// 添加中文字体支持
declare module 'jspdf' {
  interface jsPDF {
    addFont(postScriptName: string, id: string, fontStyle: string): string;
  }
}

// 衡水体英文书写格子配置
export interface HengshuiGridOptions {
  lineHeight: number; // 行高 (mm)
  letterSpacing: number; // 字母间距 (mm)
  gridWidth: number; // 格子宽度 (mm)
  showGuideLines: boolean; // 是否显示引导线
  showLetterGuides: boolean; // 是否显示字母占位提示
  practiceMode: 'trace' | 'blank' | 'mixed'; // 练习模式
  wordsPerLine: number; // 每行单词数
  linesPerWord: number; // 每个单词的练习行数
}

export const defaultHengshuiOptions: HengshuiGridOptions = {
  lineHeight: 15, // 15mm行高
  letterSpacing: 3, // 3mm字母间距
  gridWidth: 8, // 8mm格子宽度
  showGuideLines: true,
  showLetterGuides: true,
  practiceMode: 'mixed',
  wordsPerLine: 2,
  linesPerWord: 3
};

// 初始化PDF字体支持
const initializePDFFonts = (doc: jsPDF) => {
  // 设置默认字体为支持更多字符的字体
  try {
    // 使用内置字体，确保基本的拉丁字符和数字正常显示
    doc.setFont('helvetica', 'normal');
  } catch (error) {
    console.warn('Font initialization warning:', error);
  }
};

// 安全的文本渲染函数
const safeRenderText = (doc: jsPDF, text: string, x: number, y: number, options?: any) => {
  try {
    // 过滤掉可能导致问题的特殊字符，保留基本的音标符号
    const cleanText = text
      .replace(/[^\x00-\x7F\u0250-\u02AF\u1D00-\u1D7F\u1D80-\u1DBF]/g, '?') // 保留基本拉丁字符和音标扩展
      .replace(/[""'']/g, '"') // 统一引号
      .replace(/[—–]/g, '-'); // 统一破折号

    if (options) {
      doc.text(cleanText, x, y, options);
    } else {
      doc.text(cleanText, x, y);
    }
  } catch (error) {
    console.warn('Text rendering error:', error);
    // 降级处理：只显示英文字符
    const fallbackText = text.replace(/[^\x00-\x7F]/g, '?');
    doc.text(fallbackText, x, y, options);
  }
};

// 生成衡水体英文练字模板PDF
export const generateHengshuiPDF = (
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {},
  templateInfo: {
    title: string;
    grade?: string;
    studentName?: string;
    date?: string;
  }
): void => {
  const opts = { ...defaultHengshuiOptions, ...options };
  const doc = new jsPDF('portrait', 'mm', 'a4');

  // 初始化字体
  initializePDFFonts(doc);
  
  // A4纸张尺寸
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;
  
  // 页眉设置
  const drawHeader = (pageNum: number) => {
    // 标题
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, templateInfo.title, pageWidth / 2, margin - 5, { align: 'center' });

    // 学生信息栏
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const headerY = margin - 15;

    // 姓名栏
    safeRenderText(doc, 'Name:', margin, headerY);
    doc.rect(margin + 15, headerY - 3, 40, 6);

    // 班级栏
    safeRenderText(doc, 'Class:', margin + 60, headerY);
    doc.rect(margin + 75, headerY - 3, 30, 6);

    // 日期栏
    safeRenderText(doc, 'Date:', margin + 110, headerY);
    doc.rect(margin + 125, headerY - 3, 30, 6);

    // 评分栏
    safeRenderText(doc, 'Score:', margin + 160, headerY);
    doc.rect(margin + 175, headerY - 3, 20, 6);

    // 页码
    safeRenderText(doc, `Page ${pageNum}`, pageWidth - margin, headerY, { align: 'right' });
  };
  
  // 绘制四线三格
  const drawFourLineGrid = (x: number, y: number, width: number) => {
    const lineHeight = opts.lineHeight;
    
    // 四条线：顶线、上中线、下中线、底线
    doc.setLineWidth(0.3);
    
    // 顶线 (实线)
    doc.setDrawColor(0, 0, 0);
    doc.line(x, y, x + width, y);
    
    // 上中线 (虚线)
    doc.setLineDashPattern([1, 1], 0);
    doc.setDrawColor(150, 150, 150);
    doc.line(x, y + lineHeight / 3, x + width, y + lineHeight / 3);
    
    // 下中线 (虚线)
    doc.line(x, y + 2 * lineHeight / 3, x + width, y + 2 * lineHeight / 3);
    
    // 底线 (实线)
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0, 0, 0);
    doc.line(x, y + lineHeight, x + width, y + lineHeight);
    
    // 垂直分隔线
    if (opts.showGuideLines) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      for (let i = opts.gridWidth; i < width; i += opts.gridWidth) {
        doc.line(x + i, y, x + i, y + lineHeight);
      }
    }
  };
  
  // 绘制单词练习区域 - 改进版：每行一个单词
  const drawWordPracticeArea = (word: VocabularyWord, x: number, y: number): number => {
    const wordWidth = Math.max(word.word.length * opts.gridWidth, 80);
    let currentY = y;

    // 单词信息行
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, word.word, x, currentY);

    // 音标 - 使用简化的音标表示
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const simplifiedPhonetic = word.phonetic
      .replace(/[ə]/g, 'e') // 替换schwa
      .replace(/[ɪ]/g, 'i') // 替换小写i
      .replace(/[ʊ]/g, 'u') // 替换小写u
      .replace(/[ɔ]/g, 'o') // 替换开放o
      .replace(/[æ]/g, 'a') // 替换ash
      .replace(/[ʌ]/g, 'A') // 替换caret
      .replace(/[θ]/g, 'th') // 替换theta
      .replace(/[ð]/g, 'th') // 替换eth
      .replace(/[ʃ]/g, 'sh') // 替换sh
      .replace(/[ʒ]/g, 'zh') // 替换zh
      .replace(/[ŋ]/g, 'ng') // 替换ng
      .replace(/[ˈ]/g, "'") // 替换主重音
      .replace(/[ˌ]/g, ","); // 替换次重音

    safeRenderText(doc, simplifiedPhonetic, x + wordWidth + 5, currentY);

    // 中文翻译 - 使用拼音或英文描述
    const translationText = word.translation.length > 10 ?
      word.translation.substring(0, 10) + '...' :
      word.translation;
    safeRenderText(doc, `[${translationText}]`, x + wordWidth + 50, currentY);

    currentY += 8;

    // 练习行 - 只画一行描红 + 两行空白练习
    for (let line = 0; line < 3; line++) {
      drawFourLineGrid(x, currentY, wordWidth);

      // 第一行显示描红字母
      if (line === 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(180, 180, 180); // 更浅的灰色用于描红

        let letterX = x + 2;
        for (const letter of word.word) {
          safeRenderText(doc, letter, letterX, currentY + opts.lineHeight * 0.7);
          letterX += opts.gridWidth;
        }
        doc.setTextColor(0, 0, 0);
      }

      currentY += opts.lineHeight + 1; // 减少行间距
    }

    return currentY + 3; // 减少单词间距
  };
  
  // 生成PDF内容
  let currentPage = 1;
  let currentY = margin + 10;
  let wordIndex = 0;
  
  drawHeader(currentPage);
  
  // 练习说明
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  safeRenderText(doc, 'Instructions: Practice writing English words carefully in the four-line grid.', margin, currentY);
  safeRenderText(doc, 'Pay attention to letter positioning and strokes.', margin, currentY + 5);
  currentY += 15;
  
  while (wordIndex < words.length) {
    const word = words[wordIndex];
    const wordHeight = 3 * (opts.lineHeight + 1) + 15; // 固定高度：3行练习 + 单词信息

    // 检查是否需要换页
    if (currentY + wordHeight > pageHeight - margin) {
      doc.addPage();
      currentPage++;
      drawHeader(currentPage);
      currentY = margin + 10;
    }

    // 绘制单词练习区域
    currentY = drawWordPracticeArea(word, margin, currentY);
    wordIndex++;
  }
  
  // 添加页脚
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    safeRenderText(
      doc,
      `English Word Practice Template - Hengshui Style | Total: ${words.length} words`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  // 下载PDF
  const fileName = `${templateInfo.title}_衡水体练字模板.pdf`;
  doc.save(fileName);
};

// 生成年级默写模板
export const generateGradeTemplate = (
  grade: string,
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {}
): void => {
  const gradeNames: { [key: string]: string } = {
    primary1: '小学一年级',
    primary2: '小学二年级',
    primary3: '小学三年级',
    primary4: '小学四年级',
    primary5: '小学五年级',
    primary6: '小学六年级',
    grade7: '初中七年级',
    grade8: '初中八年级',
    grade9: '初中九年级'
  };
  
  const templateInfo = {
    title: `${gradeNames[grade] || grade}英语单词默写模板`,
    grade: gradeNames[grade],
    date: new Date().toLocaleDateString('zh-CN')
  };
  
  generateHengshuiPDF(words, options, templateInfo);
};

// 生成主题分类模板
export const generateCategoryTemplate = (
  category: string,
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {}
): void => {
  const templateInfo = {
    title: `${category}类英语单词练字模板`,
    date: new Date().toLocaleDateString('zh-CN')
  };
  
  generateHengshuiPDF(words, options, templateInfo);
};

// 生成高频词汇模板
export const generateHighFrequencyTemplate = (
  title: string,
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {}
): void => {
  const templateInfo = {
    title: `${title} - Practice Template`,
    date: new Date().toLocaleDateString('en-US')
  };

  generateHengshuiPDF(words, options, templateInfo);
};

// 生成紧凑型练字模板 - 每行一个单词，每个单词后面有描红练习
export const generateCompactPracticeTemplate = (
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {},
  templateInfo: {
    title: string;
    grade?: string;
    studentName?: string;
    date?: string;
  }
): void => {
  const opts = { ...defaultHengshuiOptions, ...options };
  const doc = new jsPDF('portrait', 'mm', 'a4');

  // 初始化字体
  initializePDFFonts(doc);

  // A4纸张尺寸
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15; // 减少边距以容纳更多内容
  const contentWidth = pageWidth - 2 * margin;

  // 紧凑型页眉
  const drawCompactHeader = (pageNum: number) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, templateInfo.title, pageWidth / 2, 15, { align: 'center' });

    // 简化的信息栏
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const headerY = 25;

    safeRenderText(doc, 'Name: _______________', margin, headerY);
    safeRenderText(doc, 'Date: ___________', margin + 80, headerY);
    safeRenderText(doc, `Page ${pageNum}`, pageWidth - margin - 20, headerY);
  };

  // 绘制紧凑型四线三格
  const drawCompactGrid = (x: number, y: number, width: number) => {
    const lineHeight = 12; // 稍微增加行高以容纳描红字母

    // 四条线 - 标准四线三格
    doc.setLineWidth(0.3);

    // 顶线 (实线，黑色)
    doc.setDrawColor(0, 0, 0);
    doc.line(x, y, x + width, y);

    // 上中线 (虚线，灰色)
    doc.setLineDashPattern([1, 1], 0);
    doc.setDrawColor(120, 120, 120);
    doc.line(x, y + lineHeight / 3, x + width, y + lineHeight / 3);

    // 下中线 (虚线，灰色)
    doc.line(x, y + 2 * lineHeight / 3, x + width, y + 2 * lineHeight / 3);

    // 底线 (实线，黑色)
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0, 0, 0);
    doc.line(x, y + lineHeight, x + width, y + lineHeight);

    // 垂直分隔线 - 更细的格子线
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    const gridSpacing = 8; // 每8mm一个格子，适合字母间距
    for (let i = gridSpacing; i < width; i += gridSpacing) {
      doc.line(x + i, y, x + i, y + lineHeight);
    }

    // 重置线条样式
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
  };

  // 绘制单词行 - 每行一个单词，带描红
  const drawWordLine = (word: VocabularyWord, x: number, y: number): number => {
    const wordDisplayWidth = 60; // 单词显示区域宽度
    const gridWidth = contentWidth - wordDisplayWidth - 10; // 练习格子宽度
    const lineHeight = 12; // 格子行高

    // 单词信息区域
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, word.word, x, y + 8);

    // 简化音标
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const simplePhonetic = word.phonetic
      .replace(/[ə]/g, 'e').replace(/[ɪ]/g, 'i').replace(/[ʊ]/g, 'u')
      .replace(/[ɔ]/g, 'o').replace(/[æ]/g, 'a').replace(/[ʌ]/g, 'A')
      .replace(/[θð]/g, 'th').replace(/[ʃ]/g, 'sh').replace(/[ʒ]/g, 'zh')
      .replace(/[ŋ]/g, 'ng').replace(/[ˈˌ]/g, "'");
    safeRenderText(doc, simplePhonetic, x, y + 16);

    // 中文翻译（简化显示）
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const translation = word.translation.length > 8 ?
      word.translation.substring(0, 8) + '...' : word.translation;
    safeRenderText(doc, `[${translation}]`, x, y + 23);
    doc.setTextColor(0, 0, 0);

    // 绘制练习格子
    const gridX = x + wordDisplayWidth;
    drawCompactGrid(gridX, y, gridWidth);

    // 描红字母 - 使用更明显的灰色
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180); // 浅灰色描红

    let letterX = gridX + 3;
    const letterSpacing = Math.min(8, (gridWidth - 6) / word.word.length); // 动态字母间距

    for (const letter of word.word) {
      if (letterX + letterSpacing <= gridX + gridWidth - 3) {
        safeRenderText(doc, letter, letterX, y + 8);
        letterX += letterSpacing;
      }
    }
    doc.setTextColor(0, 0, 0);

    return y + 28; // 增加行间距以容纳更多信息
  };

  // 生成PDF内容
  let currentPage = 1;
  let currentY = 35;
  let wordIndex = 0;

  drawCompactHeader(currentPage);

  // 说明文字
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  safeRenderText(doc, 'Practice: Trace the gray letters, then write the word 2-3 times in the grid.', margin, currentY);
  currentY += 12;

  while (wordIndex < words.length) {
    const word = words[wordIndex];

    // 检查是否需要换页 (每页约8-10个单词，因为增加了行高)
    if (currentY + 28 > pageHeight - 25) {
      doc.addPage();
      currentPage++;
      drawCompactHeader(currentPage);
      currentY = 40;
    }

    // 绘制单词行
    currentY = drawWordLine(word, margin, currentY);
    wordIndex++;
  }

  // 页脚
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    safeRenderText(
      doc,
      `English Practice Template | ${words.length} words | Page ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // 下载PDF
  const fileName = `${templateInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_Compact_Template.pdf`;
  doc.save(fileName);
};

// 生成每行一词描红练字模板 - 专门的描红模板
export const generateOneWordPerLineTemplate = (
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {},
  templateInfo: {
    title: string;
    grade?: string;
    studentName?: string;
    date?: string;
  }
): void => {
  const opts = { ...defaultHengshuiOptions, ...options };
  const doc = new jsPDF('portrait', 'mm', 'a4');

  // 初始化字体
  initializePDFFonts(doc);

  // A4纸张尺寸
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // 页眉
  const drawHeader = (pageNum: number) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, templateInfo.title, pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    safeRenderText(doc, 'Name: _______________', margin, 25);
    safeRenderText(doc, 'Date: ___________', margin + 80, 25);
    safeRenderText(doc, `Page ${pageNum}`, pageWidth - margin - 20, 25);
  };

  // 绘制单词练习行 - 每行一个单词，突出描红效果
  const drawWordPracticeLine = (word: VocabularyWord, x: number, y: number): number => {
    const infoWidth = 55;
    const gridWidth = contentWidth - infoWidth - 5;
    const lineHeight = 15; // 标准行高

    // 单词信息
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, word.word, x, y + 10);

    // 音标
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const phonetic = word.phonetic
      .replace(/[ə]/g, 'e').replace(/[ɪ]/g, 'i').replace(/[ʊ]/g, 'u')
      .replace(/[ɔ]/g, 'o').replace(/[æ]/g, 'a').replace(/[ʌ]/g, 'A')
      .replace(/[θð]/g, 'th').replace(/[ʃ]/g, 'sh').replace(/[ʒ]/g, 'zh')
      .replace(/[ŋ]/g, 'ng').replace(/[ˈˌ]/g, "'");
    safeRenderText(doc, phonetic, x, y + 18);

    // 绘制四线三格
    const gridX = x + infoWidth;

    // 四线三格线条
    doc.setLineWidth(0.4);
    doc.setDrawColor(0, 0, 0);

    // 顶线
    doc.line(gridX, y, gridX + gridWidth, y);
    // 上中线 (虚线)
    doc.setLineDashPattern([2, 1], 0);
    doc.setDrawColor(100, 100, 100);
    doc.line(gridX, y + lineHeight / 3, gridX + gridWidth, y + lineHeight / 3);
    // 下中线 (虚线)
    doc.line(gridX, y + 2 * lineHeight / 3, gridX + gridWidth, y + 2 * lineHeight / 3);
    // 底线
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0, 0, 0);
    doc.line(gridX, y + lineHeight, gridX + gridWidth, y + lineHeight);

    // 垂直格子线
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    const letterWidth = Math.min(12, gridWidth / (word.word.length + 1));
    for (let i = 1; i <= word.word.length; i++) {
      const lineX = gridX + i * letterWidth;
      if (lineX < gridX + gridWidth) {
        doc.line(lineX, y, lineX, y + lineHeight);
      }
    }

    // 描红字母 - 更明显的效果
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 160, 160); // 中等灰色，便于临摹

    let letterX = gridX + letterWidth / 2;
    for (const letter of word.word) {
      if (letterX < gridX + gridWidth - 5) {
        safeRenderText(doc, letter, letterX, y + 10, { align: 'center' });
        letterX += letterWidth;
      }
    }

    // 重置颜色
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);

    return y + 25; // 行间距
  };

  // 生成PDF内容
  let currentPage = 1;
  let currentY = 40;
  let wordIndex = 0;

  drawHeader(currentPage);

  // 说明文字
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  safeRenderText(doc, 'Instructions: Trace over the gray letters, then practice writing the word in the remaining space.', margin, currentY);
  currentY += 15;

  while (wordIndex < words.length) {
    const word = words[wordIndex];

    // 检查是否需要换页
    if (currentY + 25 > pageHeight - 20) {
      doc.addPage();
      currentPage++;
      drawHeader(currentPage);
      currentY = 40;
    }

    // 绘制单词练习行
    currentY = drawWordPracticeLine(word, margin, currentY);
    wordIndex++;
  }

  // 页脚
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    safeRenderText(
      doc,
      `One Word Per Line Practice Template | ${words.length} words | Page ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // 下载PDF
  const fileName = `${templateInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_OneWordPerLine.pdf`;
  doc.save(fileName);
};

// 预览专用函数 - 返回PDF对象而不是直接下载
export const generateHengshuiPDFForPreview = (
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {},
  templateInfo: {
    title: string;
    grade?: string;
    studentName?: string;
    date?: string;
  }
) => {
  const opts = { ...defaultHengshuiOptions, ...options };
  const doc = new jsPDF('portrait', 'mm', 'a4');

  // 初始化字体
  initializePDFFonts(doc);

  // A4纸张尺寸
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;

  // 页眉设置
  const drawHeader = (pageNum: number) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, templateInfo.title, pageWidth / 2, margin - 5, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const headerY = margin - 15;

    safeRenderText(doc, 'Name:', margin, headerY);
    doc.rect(margin + 15, headerY - 3, 40, 6);

    safeRenderText(doc, 'Class:', margin + 60, headerY);
    doc.rect(margin + 75, headerY - 3, 30, 6);

    safeRenderText(doc, 'Date:', margin + 110, headerY);
    doc.rect(margin + 125, headerY - 3, 30, 6);

    safeRenderText(doc, 'Score:', margin + 160, headerY);
    doc.rect(margin + 175, headerY - 3, 20, 6);

    safeRenderText(doc, `Page ${pageNum}`, pageWidth - margin, headerY, { align: 'right' });
  };

  // 绘制四线三格
  const drawFourLineGrid = (x: number, y: number, width: number) => {
    const lineHeight = opts.lineHeight;

    doc.setLineWidth(0.3);
    doc.setDrawColor(0, 0, 0);
    doc.line(x, y, x + width, y);

    doc.setLineDashPattern([1, 1], 0);
    doc.setDrawColor(150, 150, 150);
    doc.line(x, y + lineHeight / 3, x + width, y + lineHeight / 3);
    doc.line(x, y + 2 * lineHeight / 3, x + width, y + 2 * lineHeight / 3);

    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0, 0, 0);
    doc.line(x, y + lineHeight, x + width, y + lineHeight);

    if (opts.showGuideLines) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      for (let i = opts.gridWidth; i < width; i += opts.gridWidth) {
        doc.line(x + i, y, x + i, y + lineHeight);
      }
    }
  };

  // 绘制单词练习区域
  const drawWordPracticeArea = (word: VocabularyWord, x: number, y: number): number => {
    const wordWidth = Math.max(word.word.length * opts.gridWidth, 80);
    let currentY = y;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, word.word, x, currentY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const simplifiedPhonetic = word.phonetic
      .replace(/[ə]/g, 'e').replace(/[ɪ]/g, 'i').replace(/[ʊ]/g, 'u')
      .replace(/[ɔ]/g, 'o').replace(/[æ]/g, 'a').replace(/[ʌ]/g, 'A')
      .replace(/[θð]/g, 'th').replace(/[ʃ]/g, 'sh').replace(/[ʒ]/g, 'zh')
      .replace(/[ŋ]/g, 'ng').replace(/[ˈˌ]/g, "'");

    safeRenderText(doc, simplifiedPhonetic, x + wordWidth + 5, currentY);

    const translationText = word.translation.length > 10 ?
      word.translation.substring(0, 10) + '...' :
      word.translation;
    safeRenderText(doc, `[${translationText}]`, x + wordWidth + 50, currentY);

    currentY += 8;

    for (let line = 0; line < 3; line++) {
      drawFourLineGrid(x, currentY, wordWidth);

      if (line === 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(180, 180, 180);

        let letterX = x + 2;
        for (const letter of word.word) {
          safeRenderText(doc, letter, letterX, currentY + opts.lineHeight * 0.7);
          letterX += opts.gridWidth;
        }
        doc.setTextColor(0, 0, 0);
      }

      currentY += opts.lineHeight + 1;
    }

    return currentY + 3;
  };

  // 生成PDF内容
  let currentPage = 1;
  let currentY = margin + 10;
  let wordIndex = 0;

  drawHeader(currentPage);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  safeRenderText(doc, 'Instructions: Practice writing English words carefully in the four-line grid.', margin, currentY);
  safeRenderText(doc, 'Pay attention to letter positioning and strokes.', margin, currentY + 5);
  currentY += 15;

  while (wordIndex < words.length && wordIndex < 10) { // 预览限制为10个单词
    const word = words[wordIndex];
    const wordHeight = 3 * (opts.lineHeight + 1) + 15;

    if (currentY + wordHeight > pageHeight - margin) {
      doc.addPage();
      currentPage++;
      drawHeader(currentPage);
      currentY = margin + 10;
    }

    currentY = drawWordPracticeArea(word, margin, currentY);
    wordIndex++;
  }

  // 添加预览标识
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  safeRenderText(
    doc,
    `Preview - Standard Template | Showing ${Math.min(words.length, 10)} of ${words.length} words`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return doc;
};

// 每行一词模板预览函数
export const generateOneWordPerLineForPreview = (
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {},
  templateInfo: {
    title: string;
    grade?: string;
    studentName?: string;
    date?: string;
  }
) => {
  const opts = { ...defaultHengshuiOptions, ...options };
  const doc = new jsPDF('portrait', 'mm', 'a4');

  initializePDFFonts(doc);

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  const drawHeader = (pageNum: number) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, templateInfo.title, pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    safeRenderText(doc, 'Name: _______________', margin, 25);
    safeRenderText(doc, 'Date: ___________', margin + 80, 25);
    safeRenderText(doc, `Page ${pageNum}`, pageWidth - margin - 20, 25);
  };

  const drawWordPracticeLine = (word: VocabularyWord, x: number, y: number): number => {
    const infoWidth = 55;
    const gridWidth = contentWidth - infoWidth - 5;
    const lineHeight = 15;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, word.word, x, y + 10);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const phonetic = word.phonetic
      .replace(/[ə]/g, 'e').replace(/[ɪ]/g, 'i').replace(/[ʊ]/g, 'u')
      .replace(/[ɔ]/g, 'o').replace(/[æ]/g, 'a').replace(/[ʌ]/g, 'A')
      .replace(/[θð]/g, 'th').replace(/[ʃ]/g, 'sh').replace(/[ʒ]/g, 'zh')
      .replace(/[ŋ]/g, 'ng').replace(/[ˈˌ]/g, "'");
    safeRenderText(doc, phonetic, x, y + 18);

    const gridX = x + infoWidth;

    doc.setLineWidth(0.4);
    doc.setDrawColor(0, 0, 0);
    doc.line(gridX, y, gridX + gridWidth, y);
    doc.line(gridX, y + lineHeight, gridX + gridWidth, y + lineHeight);

    doc.setLineDashPattern([2, 1], 0);
    doc.setDrawColor(100, 100, 100);
    doc.line(gridX, y + lineHeight / 3, gridX + gridWidth, y + lineHeight / 3);
    doc.line(gridX, y + 2 * lineHeight / 3, gridX + gridWidth, y + 2 * lineHeight / 3);
    doc.setLineDashPattern([], 0);

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    const letterWidth = Math.min(12, gridWidth / (word.word.length + 1));
    for (let i = 1; i <= word.word.length; i++) {
      const lineX = gridX + i * letterWidth;
      if (lineX < gridX + gridWidth) {
        doc.line(lineX, y, lineX, y + lineHeight);
      }
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 160, 160);

    let letterX = gridX + letterWidth / 2;
    for (const letter of word.word) {
      if (letterX < gridX + gridWidth - 5) {
        safeRenderText(doc, letter, letterX, y + 10, { align: 'center' });
        letterX += letterWidth;
      }
    }

    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);

    return y + 25;
  };

  let currentPage = 1;
  let currentY = 40;
  let wordIndex = 0;

  drawHeader(currentPage);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  safeRenderText(doc, 'Instructions: Trace over the gray letters, then practice writing the word in the remaining space.', margin, currentY);
  currentY += 15;

  while (wordIndex < words.length && wordIndex < 8) { // 预览限制为8个单词
    const word = words[wordIndex];

    if (currentY + 25 > pageHeight - 20) {
      doc.addPage();
      currentPage++;
      drawHeader(currentPage);
      currentY = 40;
    }

    currentY = drawWordPracticeLine(word, margin, currentY);
    wordIndex++;
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  safeRenderText(
    doc,
    `Preview - One Word Per Line Template | Showing ${Math.min(words.length, 8)} of ${words.length} words`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return doc;
};

// 紧凑型模板预览函数
export const generateCompactTemplateForPreview = (
  words: VocabularyWord[],
  options: Partial<HengshuiGridOptions> = {},
  templateInfo: {
    title: string;
    grade?: string;
    studentName?: string;
    date?: string;
  }
) => {
  const opts = { ...defaultHengshuiOptions, ...options };
  const doc = new jsPDF('portrait', 'mm', 'a4');

  initializePDFFonts(doc);

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  const drawCompactHeader = (pageNum: number) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, templateInfo.title, pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    safeRenderText(doc, 'Name: _______________', margin, 25);
    safeRenderText(doc, 'Date: ___________', margin + 80, 25);
    safeRenderText(doc, `Page ${pageNum}`, pageWidth - margin - 20, 25);
  };

  const drawCompactGrid = (x: number, y: number, width: number) => {
    const lineHeight = 12;

    doc.setLineWidth(0.3);
    doc.setDrawColor(0, 0, 0);
    doc.line(x, y, x + width, y);
    doc.line(x, y + lineHeight, x + width, y + lineHeight);

    doc.setLineDashPattern([1, 1], 0);
    doc.setDrawColor(120, 120, 120);
    doc.line(x, y + lineHeight / 3, x + width, y + lineHeight / 3);
    doc.line(x, y + 2 * lineHeight / 3, x + width, y + 2 * lineHeight / 3);
    doc.setLineDashPattern([], 0);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    const gridSpacing = 8;
    for (let i = gridSpacing; i < width; i += gridSpacing) {
      doc.line(x + i, y, x + i, y + lineHeight);
    }

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
  };

  const drawWordLine = (word: VocabularyWord, x: number, y: number): number => {
    const wordDisplayWidth = 60;
    const gridWidth = contentWidth - wordDisplayWidth - 10;
    const lineHeight = 12;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    safeRenderText(doc, word.word, x, y + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const simplePhonetic = word.phonetic
      .replace(/[ə]/g, 'e').replace(/[ɪ]/g, 'i').replace(/[ʊ]/g, 'u')
      .replace(/[ɔ]/g, 'o').replace(/[æ]/g, 'a').replace(/[ʌ]/g, 'A')
      .replace(/[θð]/g, 'th').replace(/[ʃ]/g, 'sh').replace(/[ʒ]/g, 'zh')
      .replace(/[ŋ]/g, 'ng').replace(/[ˈˌ]/g, "'");
    safeRenderText(doc, simplePhonetic, x, y + 16);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const translation = word.translation.length > 8 ?
      word.translation.substring(0, 8) + '...' : word.translation;
    safeRenderText(doc, `[${translation}]`, x, y + 23);
    doc.setTextColor(0, 0, 0);

    const gridX = x + wordDisplayWidth;
    drawCompactGrid(gridX, y, gridWidth);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);

    let letterX = gridX + 3;
    const letterSpacing = Math.min(8, (gridWidth - 6) / word.word.length);

    for (const letter of word.word) {
      if (letterX + letterSpacing <= gridX + gridWidth - 3) {
        safeRenderText(doc, letter, letterX, y + 8);
        letterX += letterSpacing;
      }
    }
    doc.setTextColor(0, 0, 0);

    return y + 28;
  };

  let currentPage = 1;
  let currentY = 35;
  let wordIndex = 0;

  drawCompactHeader(currentPage);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  safeRenderText(doc, 'Practice: Trace the gray letters, then write the word 2-3 times in the grid.', margin, currentY);
  currentY += 12;

  while (wordIndex < words.length && wordIndex < 12) { // 预览限制为12个单词
    const word = words[wordIndex];

    if (currentY + 28 > pageHeight - 25) {
      doc.addPage();
      currentPage++;
      drawCompactHeader(currentPage);
      currentY = 40;
    }

    currentY = drawWordLine(word, margin, currentY);
    wordIndex++;
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  safeRenderText(
    doc,
    `Preview - Compact Template | Showing ${Math.min(words.length, 12)} of ${words.length} words`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  return doc;
};
