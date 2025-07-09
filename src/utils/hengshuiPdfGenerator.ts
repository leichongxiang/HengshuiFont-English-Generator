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
    doc.text(templateInfo.title, pageWidth / 2, margin - 5, { align: 'center' });
    
    // 学生信息栏
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const headerY = margin - 15;
    
    // 姓名栏
    doc.text('姓名:', margin, headerY);
    doc.rect(margin + 15, headerY - 3, 40, 6);
    
    // 班级栏
    doc.text('班级:', margin + 60, headerY);
    doc.rect(margin + 75, headerY - 3, 30, 6);
    
    // 日期栏
    doc.text('日期:', margin + 110, headerY);
    doc.rect(margin + 125, headerY - 3, 30, 6);
    
    // 评分栏
    doc.text('评分:', margin + 160, headerY);
    doc.rect(margin + 175, headerY - 3, 20, 6);
    
    // 页码
    doc.text(`第 ${pageNum} 页`, pageWidth - margin, headerY, { align: 'right' });
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
  
  // 绘制单词练习区域
  const drawWordPracticeArea = (word: VocabularyWord, x: number, y: number): number => {
    const wordWidth = Math.max(word.word.length * opts.gridWidth, 60);
    let currentY = y;
    
    // 单词信息
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(word.word, x, currentY);
    
    // 音标
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(word.phonetic, x + wordWidth + 5, currentY);
    
    // 中文翻译
    doc.text(word.translation, x + wordWidth + 40, currentY);
    
    currentY += 8;
    
    // 练习行
    for (let line = 0; line < opts.linesPerWord; line++) {
      drawFourLineGrid(x, currentY, wordWidth);
      
      // 第一行显示描红字母
      if (line === 0 && opts.practiceMode !== 'blank') {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        
        let letterX = x + 2;
        for (const letter of word.word) {
          doc.text(letter, letterX, currentY + opts.lineHeight * 0.7);
          letterX += opts.gridWidth;
        }
        doc.setTextColor(0, 0, 0);
      }
      
      currentY += opts.lineHeight + 2;
    }
    
    return currentY + 5;
  };
  
  // 生成PDF内容
  let currentPage = 1;
  let currentY = margin + 10;
  let wordIndex = 0;
  
  drawHeader(currentPage);
  
  // 练习说明
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('练习说明：请在四线三格中认真书写英文单词，注意字母的占位和笔画。', margin, currentY);
  currentY += 15;
  
  while (wordIndex < words.length) {
    const word = words[wordIndex];
    const wordHeight = opts.linesPerWord * (opts.lineHeight + 2) + 15;
    
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
    doc.text(
      `英语单词练字模板 - 衡水体标准格式 | 共 ${words.length} 个单词`,
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
    title: `${title} - 练字模板`,
    date: new Date().toLocaleDateString('zh-CN')
  };
  
  generateHengshuiPDF(words, options, templateInfo);
};
