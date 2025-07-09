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

'use client';

import { useState, useEffect } from 'react';
import { vocabularyData, gradeCategories, VocabularyWord, partOfSpeechCategories, textbookVersions, vocabularyByGrade, presetTemplates } from '@/data/vocabulary';
import { Download, BookOpen, GraduationCap, Filter, Settings, FileText, Sparkles, Search, Plus, Heart, Star, Book, Grid, Target, Zap } from 'lucide-react';
import { generateVocabularyPDF, generateEbbinghausSchedulePDF, generateEssayTemplatePDF, generateWordBookPDF, PDFOptions, defaultPDFOptions } from '@/utils/pdfGenerator';
import { generateGradeTemplate, generateCategoryTemplate, generateHighFrequencyTemplate, HengshuiGridOptions, defaultHengshuiOptions } from '@/utils/hengshuiPdfGenerator';
import { WordBook, wordBookManager } from '@/data/wordbook';

export default function Home() {
  const [selectedWords, setSelectedWords] = useState<VocabularyWord[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'selector' | 'template' | 'schedule' | 'essay' | 'wordbook' | 'grade-template'>('selector');
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);
  const [selectedWordBook, setSelectedWordBook] = useState<string>('');
  const [showCreateWordBook, setShowCreateWordBook] = useState<boolean>(false);

  // 年级模板相关状态
  const [selectedPresetTemplate, setSelectedPresetTemplate] = useState<string>('');
  const [hengshuiOptions, setHengshuiOptions] = useState<HengshuiGridOptions>(defaultHengshuiOptions);

  // PDF generation functions
  const handleDownloadVocabularyPDF = () => {
    if (selectedWords.length === 0) {
      alert('请先选择要练习的单词');
      return;
    }

    const generator = generateVocabularyPDF(
      selectedWords,
      defaultPDFOptions,
      `${selectedGrade === 'all' ? '全年级' : selectedGrade === 'grade7' ? '七年级' : selectedGrade === 'grade8' ? '八年级' : '九年级'}英语单词练字模板`
    );
    generator.download(`vocabulary-template-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleDownloadSchedulePDF = () => {
    if (selectedWords.length === 0) {
      alert('请先选择要复习的单词');
      return;
    }

    const generator = generateEbbinghausSchedulePDF(selectedWords);
    generator.download(`ebbinghaus-schedule-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleDownloadEssayPDF = () => {
    const generator = generateEssayTemplatePDF('衡水体英语作文练习');
    generator.download(`essay-template-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // 年级模板生成函数
  const handleDownloadGradeTemplate = (templateKey: string) => {
    const template = presetTemplates[templateKey as keyof typeof presetTemplates];
    if (!template) {
      alert('请选择一个有效的模板');
      return;
    }

    if (template.words.length === 0) {
      alert('该模板暂无词汇数据');
      return;
    }

    if ('grade' in template) {
      generateGradeTemplate(template.grade, template.words, hengshuiOptions);
    } else if ('category' in template) {
      generateCategoryTemplate(template.category, template.words, hengshuiOptions);
    } else if ('type' in template && template.type === 'high_frequency') {
      generateHighFrequencyTemplate(template.name, template.words, hengshuiOptions);
    }
  };

  // 自定义衡水体模板生成
  const handleDownloadCustomHengshuiTemplate = () => {
    if (selectedWords.length === 0) {
      alert('请先选择要练习的单词');
      return;
    }

    const templateInfo = {
      title: '自定义英语单词练字模板',
      date: new Date().toLocaleDateString('zh-CN')
    };

    import('@/utils/hengshuiPdfGenerator').then(({ generateHengshuiPDF }) => {
      generateHengshuiPDF(selectedWords, hengshuiOptions, templateInfo);
    });
  };

  const handleDownloadWordBookPDF = (bookId: string, sortBy: 'alphabetical' | 'grade' | 'frequency' = 'alphabetical') => {
    const book = wordBooks.find(b => b.id === bookId);
    if (!book || book.words.length === 0) {
      alert('单词本为空或不存在');
      return;
    }

    const generator = generateWordBookPDF(book.words, book.name, sortBy);
    generator.download(`wordbook-${book.name}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Load word books on component mount
  useEffect(() => {
    setWordBooks(wordBookManager.getAllWordBooks());
  }, []);

  // Filter words based on search and filters
  const filteredWords = vocabularyData.filter(word => {
    const gradeMatch = selectedGrade === 'all' || word.grade === selectedGrade;
    const categoryMatch = selectedCategory === 'all' || word.category === selectedCategory;
    const partOfSpeechMatch = selectedPartOfSpeech === 'all' || word.partOfSpeech === selectedPartOfSpeech;
    const searchMatch = searchTerm === '' ||
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.translation.includes(searchTerm) ||
      (word.example && word.example.toLowerCase().includes(searchTerm.toLowerCase()));

    return gradeMatch && categoryMatch && partOfSpeechMatch && searchMatch;
  });

  const availableCategories = selectedGrade === 'all'
    ? [...new Set(vocabularyData.map(word => word.category))]
    : gradeCategories[selectedGrade as keyof typeof gradeCategories] || [];

  const availablePartOfSpeech = [...new Set(vocabularyData.map(word => word.partOfSpeech))];

  // Word book management functions
  const createNewWordBook = (name: string, description?: string) => {
    const newBook = wordBookManager.createWordBook(name, description);
    setWordBooks(wordBookManager.getAllWordBooks());
    return newBook;
  };

  const addWordToBook = (bookId: string, word: VocabularyWord) => {
    const success = wordBookManager.addWordToBook(bookId, word);
    if (success) {
      setWordBooks(wordBookManager.getAllWordBooks());
    }
    return success;
  };

  const removeWordFromBook = (bookId: string, wordId: string) => {
    const success = wordBookManager.removeWordFromBook(bookId, wordId);
    if (success) {
      setWordBooks(wordBookManager.getAllWordBooks());
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent hengshui-font">
              英语单词练字模板生成器
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 ml-3 animate-pulse" />
          </div>
          <p className="text-xl text-blue-100 hengshui-font">
            基于衡水体字体和艾宾浩斯遗忘曲线的智能英语学习工具
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">AI智能推荐</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">科学记忆</span>
            <span className="px-3 py-1 bg-pink-500/20 text-pink-200 rounded-full text-sm">标准字体</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-2 flex border border-white/20">
            <button
              onClick={() => setActiveTab('selector')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'selector'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              选择单词
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'template'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              生成模板
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'schedule'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              复习计划
            </button>
            <button
              onClick={() => setActiveTab('essay')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'essay'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              作文模板
            </button>
            <button
              onClick={() => setActiveTab('grade-template')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'grade-template'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5 mr-2" />
              年级模板
            </button>
            <button
              onClick={() => setActiveTab('wordbook')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'wordbook'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Book className="w-5 h-5 mr-2" />
              单词本
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="glass rounded-3xl shadow-2xl p-8 border border-white/20">
          {activeTab === 'selector' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white hengshui-font">选择要练习的单词</h2>

              {/* Search and Filters */}
              <div className="mb-8">
                {/* Search Bar */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/90 mb-3 hengshui-font">
                    搜索单词
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="输入英文单词或中文翻译..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3 hengshui-font">
                      年级选择
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="all" className="text-gray-800">全部年级</option>
                      <option value="primary1" className="text-gray-800">小学一年级</option>
                      <option value="primary2" className="text-gray-800">小学二年级</option>
                      <option value="primary3" className="text-gray-800">小学三年级</option>
                      <option value="primary4" className="text-gray-800">小学四年级</option>
                      <option value="primary5" className="text-gray-800">小学五年级</option>
                      <option value="primary6" className="text-gray-800">小学六年级</option>
                      <option value="grade7" className="text-gray-800">初中七年级</option>
                      <option value="grade8" className="text-gray-800">初中八年级</option>
                      <option value="grade9" className="text-gray-800">初中九年级</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3 hengshui-font">
                      分类选择
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="all" className="text-gray-800">全部分类</option>
                      {availableCategories.map(category => (
                        <option key={category} value={category} className="text-gray-800">{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3 hengshui-font">
                      词性选择
                    </label>
                    <select
                      value={selectedPartOfSpeech}
                      onChange={(e) => setSelectedPartOfSpeech(e.target.value)}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="all" className="text-gray-800">全部词性</option>
                      {availablePartOfSpeech.map(pos => (
                        <option key={pos} value={pos} className="text-gray-800">
                          {partOfSpeechCategories[pos as keyof typeof partOfSpeechCategories] || pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Results Summary */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-white/80 text-sm">
                    找到 {filteredWords.length} 个单词
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedGrade('all');
                        setSelectedCategory('all');
                        setSelectedPartOfSpeech('all');
                      }}
                      className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors text-sm"
                    >
                      清除筛选
                    </button>
                    <button
                      onClick={() => setSelectedWords(filteredWords)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-colors text-sm"
                    >
                      全选当前结果
                    </button>
                  </div>
                </div>
              </div>

              {/* Word Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWords.map(word => (
                  <div
                    key={word.id}
                    className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 hover-lift ${
                      selectedWords.find(w => w.id === word.id)
                        ? 'border-blue-400 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg transform scale-105'
                        : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                    }`}
                    onClick={() => {
                      const isSelected = selectedWords.find(w => w.id === word.id);
                      if (isSelected) {
                        setSelectedWords(selectedWords.filter(w => w.id !== word.id));
                      } else {
                        setSelectedWords([...selectedWords, word]);
                      }
                    }}
                  >
                    <div className="hengshui-english text-xl font-medium text-white mb-2">{word.word}</div>
                    <div className="text-sm text-white/80 mb-1">{word.phonetic}</div>
                    <div className="text-sm text-white/90 hengshui-font mb-3">{word.translation}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-white/60">
                        {word.grade === 'grade7' ? '七年级' : word.grade === 'grade8' ? '八年级' : '九年级'}
                      </div>
                      <div className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                        {word.category}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      {selectedWords.find(w => w.id === word.id) && (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedWordBook) {
                              addWordToBook(selectedWordBook, word);
                            } else {
                              alert('请先选择一个单词本');
                            }
                          }}
                          className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                          title="添加到单词本"
                        >
                          <Plus className="w-4 h-4 text-white/80" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle favorite functionality can be added here
                          }}
                          className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                          title="收藏"
                        >
                          <Heart className="w-4 h-4 text-white/80" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'template' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white hengshui-font">生成练字模板</h2>
              {selectedWords.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-white/60 mx-auto mb-4" />
                  <p className="text-white/80 hengshui-font text-lg">请先选择要练习的单词</p>
                </div>
              ) : (
                <div>
                  <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleDownloadVocabularyPDF}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg hover-lift animate-pulse-glow"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      下载PDF练字模板
                    </button>
                    <div className="text-white/80 text-sm flex items-center">
                      <span className="bg-white/10 px-3 py-2 rounded-lg">
                        已选择 {selectedWords.length} 个单词
                      </span>
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div className="bg-white rounded-xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 hengshui-font">英语单词练字模板预览</h3>
                    <div className="space-y-8">
                      {selectedWords.slice(0, 3).map((word, index) => (
                        <div key={word.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
                            <div className="hengshui-english text-3xl font-bold text-gray-800">{word.word}</div>
                            <div className="text-lg text-gray-600 italic">{word.phonetic}</div>
                            <div className="text-lg text-gray-700 hengshui-font">{word.translation}</div>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="border-2 border-gray-300 h-16 flex items-center justify-center text-gray-400 hengshui-english text-lg rounded-lg bg-gray-50">
                                {i === 0 ? word.word : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {selectedWords.length > 3 && (
                        <div className="text-center text-gray-500 py-4">
                          <span className="bg-gray-100 px-4 py-2 rounded-full">
                            还有 {selectedWords.length - 3} 个单词将在PDF中显示...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white hengshui-font">艾宾浩斯复习计划</h2>
              {selectedWords.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="w-16 h-16 text-white/60 mx-auto mb-4" />
                  <p className="text-white/80 hengshui-font text-lg">请先选择要复习的单词</p>
                </div>
              ) : (
                <div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-xl mb-8 border border-white/20">
                    <h3 className="font-bold text-white mb-3 hengshui-font text-xl">科学复习时间安排</h3>
                    <p className="text-white/90 hengshui-font mb-4">
                      根据艾宾浩斯遗忘曲线，建议在学习后的第1天、第3天、第7天、第15天、第30天进行复习
                    </p>
                    <button
                      onClick={handleDownloadSchedulePDF}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center shadow-lg hover-lift"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      下载复习计划PDF
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {[1, 3, 7, 15, 30].map((day, index) => (
                      <div key={day} className="bg-white/10 border border-white/20 rounded-xl p-6 hover-lift backdrop-blur-sm">
                        <h4 className="font-bold text-center mb-4 text-white hengshui-font text-lg">第{day}天</h4>
                        <div className="space-y-3">
                          {selectedWords.slice(0, 5).map(word => (
                            <div key={word.id} className="text-sm">
                              <div className="hengshui-english font-medium text-white">{word.word}</div>
                              <div className="text-white/70 hengshui-font">{word.translation}</div>
                            </div>
                          ))}
                          {selectedWords.length > 5 && (
                            <div className="text-xs text-white/60 hengshui-font">
                              还有 {selectedWords.length - 5} 个单词...
                            </div>
                          )}
                        </div>
                        <div className="mt-4 text-center">
                          <span className="inline-block w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'essay' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white hengshui-font">衡水体满分作文模板</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Essay Template Options */}
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4 hengshui-font">作文类型选择</h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleDownloadEssayPDF}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center shadow-lg hover-lift"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        下载通用作文模板
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button className="bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                          记叙文模板
                        </button>
                        <button className="bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                          议论文模板
                        </button>
                        <button className="bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                          说明文模板
                        </button>
                        <button className="bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                          应用文模板
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4 hengshui-font">衡水体写作要点</h3>
                    <ul className="space-y-2 text-white/90">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        字迹工整，笔画清晰，字母规范
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        行距均匀，版面整洁美观
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        语法正确，用词准确地道
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        结构清晰，逻辑连贯
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sample Essay Preview */}
                <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 hengshui-font">满分作文示例</h3>
                  <div className="bg-white rounded-lg p-6 text-gray-800 hengshui-english text-sm leading-relaxed">
                    <div className="text-center font-bold mb-4">My Dream School</div>
                    <div className="space-y-3">
                      <p>Everyone has a dream school in their mind. My dream school would be a place where learning is both fun and meaningful.</p>
                      <p>First of all, my dream school would have modern facilities. There would be well-equipped laboratories, a large library with thousands of books, and comfortable classrooms with smart boards.</p>
                      <p>Moreover, the teachers in my dream school would be patient and caring. They would encourage students to think creatively and help us develop our potential.</p>
                      <p>In conclusion, my dream school would be a place where students can grow both academically and personally. I believe such a school would help create a better future for all students.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grade-template' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white hengshui-font">年级默写模板生成</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 预设模板选择 */}
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4 hengshui-font flex items-center">
                      <Target className="w-6 h-6 mr-2" />
                      预设模板
                    </h3>

                    {/* 单年级模板 */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white/90 mb-3">单年级完整词汇</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(presetTemplates)
                          .filter(([key, template]) => 'grade' in template)
                          .map(([key, template]) => (
                            <button
                              key={key}
                              onClick={() => setSelectedPresetTemplate(key)}
                              className={`p-3 rounded-lg text-left transition-all duration-300 ${
                                selectedPresetTemplate === key
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                  : 'bg-white/5 text-white/80 hover:bg-white/10'
                              }`}
                            >
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm opacity-80">{template.description}</div>
                              <div className="text-xs mt-1 opacity-60">{template.words.length} 个单词</div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* 主题分类模板 */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white/90 mb-3">主题分类模板</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(presetTemplates)
                          .filter(([key, template]) => 'category' in template)
                          .map(([key, template]) => (
                            <button
                              key={key}
                              onClick={() => setSelectedPresetTemplate(key)}
                              className={`p-3 rounded-lg text-left transition-all duration-300 ${
                                selectedPresetTemplate === key
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                  : 'bg-white/5 text-white/80 hover:bg-white/10'
                              }`}
                            >
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm opacity-80">{template.description}</div>
                              <div className="text-xs mt-1 opacity-60">{template.words.length} 个单词</div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* 高频词汇模板 */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white/90 mb-3">高频词汇模板</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(presetTemplates)
                          .filter(([key, template]) => 'type' in template && template.type === 'high_frequency')
                          .map(([key, template]) => (
                            <button
                              key={key}
                              onClick={() => setSelectedPresetTemplate(key)}
                              className={`p-3 rounded-lg text-left transition-all duration-300 ${
                                selectedPresetTemplate === key
                                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                                  : 'bg-white/5 text-white/80 hover:bg-white/10'
                              }`}
                            >
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm opacity-80">{template.description}</div>
                              <div className="text-xs mt-1 opacity-60">{template.words.length} 个单词</div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* 生成按钮 */}
                    <button
                      onClick={() => handleDownloadGradeTemplate(selectedPresetTemplate)}
                      disabled={!selectedPresetTemplate}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      生成衡水体练字模板
                    </button>
                  </div>
                </div>

                {/* 衡水体格子设置 */}
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4 hengshui-font flex items-center">
                      <Settings className="w-6 h-6 mr-2" />
                      衡水体格子设置
                    </h3>

                    <div className="space-y-4">
                      {/* 行高设置 */}
                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                          行高 (mm): {hengshuiOptions.lineHeight}
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="20"
                          step="1"
                          value={hengshuiOptions.lineHeight}
                          onChange={(e) => setHengshuiOptions(prev => ({
                            ...prev,
                            lineHeight: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* 格子宽度设置 */}
                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                          格子宽度 (mm): {hengshuiOptions.gridWidth}
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="12"
                          step="1"
                          value={hengshuiOptions.gridWidth}
                          onChange={(e) => setHengshuiOptions(prev => ({
                            ...prev,
                            gridWidth: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* 每个单词的练习行数 */}
                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">
                          每个单词练习行数: {hengshuiOptions.linesPerWord}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={hengshuiOptions.linesPerWord}
                          onChange={(e) => setHengshuiOptions(prev => ({
                            ...prev,
                            linesPerWord: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* 练习模式 */}
                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">练习模式</label>
                        <select
                          value={hengshuiOptions.practiceMode}
                          onChange={(e) => setHengshuiOptions(prev => ({
                            ...prev,
                            practiceMode: e.target.value as 'trace' | 'blank' | 'mixed'
                          }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="trace">描红练习</option>
                          <option value="blank">空白练习</option>
                          <option value="mixed">混合练习</option>
                        </select>
                      </div>

                      {/* 开关选项 */}
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={hengshuiOptions.showGuideLines}
                            onChange={(e) => setHengshuiOptions(prev => ({
                              ...prev,
                              showGuideLines: e.target.checked
                            }))}
                            className="mr-3"
                          />
                          <span className="text-white/90">显示引导线</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={hengshuiOptions.showLetterGuides}
                            onChange={(e) => setHengshuiOptions(prev => ({
                              ...prev,
                              showLetterGuides: e.target.checked
                            }))}
                            className="mr-3"
                          />
                          <span className="text-white/90">显示字母占位提示</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 自定义模板生成 */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4 hengshui-font flex items-center">
                      <Zap className="w-6 h-6 mr-2" />
                      自定义模板
                    </h3>
                    <p className="text-white/80 mb-4">
                      使用左侧"选择单词"功能选择词汇，然后生成自定义的衡水体练字模板
                    </p>
                    <button
                      onClick={handleDownloadCustomHengshuiTemplate}
                      disabled={selectedWords.length === 0}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      生成自定义模板 ({selectedWords.length} 个单词)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wordbook' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white hengshui-font">我的单词本</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Word Books List */}
                <div className="lg:col-span-1">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white hengshui-font">单词本列表</h3>
                      <button
                        onClick={() => setShowCreateWordBook(true)}
                        className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-teal-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {wordBooks.map(book => (
                        <div
                          key={book.id}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedWordBook === book.id
                              ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }`}
                          onClick={() => setSelectedWordBook(book.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{book.icon}</span>
                              <div>
                                <div className="text-white font-medium">{book.name}</div>
                                <div className="text-white/60 text-sm">{book.words.length} 个单词</div>
                              </div>
                            </div>
                            {book.studyProgress && (
                              <div className="text-right">
                                <div className="text-white/80 text-sm">
                                  {Math.round((book.studyProgress.learnedWords / Math.max(book.studyProgress.totalWords, 1)) * 100)}%
                                </div>
                                <div className="w-12 h-2 bg-white/20 rounded-full mt-1">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                                    style={{
                                      width: `${(book.studyProgress.learnedWords / Math.max(book.studyProgress.totalWords, 1)) * 100}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {showCreateWordBook && (
                      <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
                        <h4 className="text-white font-medium mb-3">创建新单词本</h4>
                        <input
                          type="text"
                          placeholder="单词本名称"
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 mb-3"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const name = (e.target as HTMLInputElement).value;
                              if (name.trim()) {
                                createNewWordBook(name.trim());
                                (e.target as HTMLInputElement).value = '';
                                setShowCreateWordBook(false);
                              }
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowCreateWordBook(false)}
                            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => {
                              const input = document.querySelector('input[placeholder="单词本名称"]') as HTMLInputElement;
                              const name = input?.value;
                              if (name?.trim()) {
                                createNewWordBook(name.trim());
                                input.value = '';
                                setShowCreateWordBook(false);
                              }
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                          >
                            创建
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Word Book Content */}
                <div className="lg:col-span-2">
                  {selectedWordBook ? (
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                      {(() => {
                        const book = wordBooks.find(b => b.id === selectedWordBook);
                        if (!book) return null;

                        return (
                          <>
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center">
                                <span className="text-3xl mr-4">{book.icon}</span>
                                <div>
                                  <h3 className="text-2xl font-bold text-white">{book.name}</h3>
                                  <p className="text-white/70">{book.description}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDownloadWordBookPDF(book.id, 'alphabetical')}
                                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors flex items-center"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  导出PDF
                                </button>
                              </div>
                            </div>

                            {book.words.length === 0 ? (
                              <div className="text-center py-12">
                                <Book className="w-16 h-16 text-white/60 mx-auto mb-4" />
                                <p className="text-white/80 text-lg">单词本为空</p>
                                <p className="text-white/60">从左侧选择单词添加到此单词本</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {book.words.map(word => (
                                  <div
                                    key={word.id}
                                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="text-white font-medium text-lg hengshui-english">{word.word}</div>
                                        <div className="text-white/70 text-sm">{word.phonetic}</div>
                                        <div className="text-white/90 hengshui-font">{word.translation}</div>
                                        {word.example && (
                                          <div className="text-white/60 text-sm mt-2 italic">{word.example}</div>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => removeWordFromBook(book.id, word.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors ml-2"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20 text-center">
                      <Book className="w-16 h-16 text-white/60 mx-auto mb-4" />
                      <p className="text-white/80 text-lg">请选择一个单词本</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass rounded-2xl shadow-xl p-8 text-center hover-lift animate-float border border-white/20">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              {vocabularyData.length}
            </div>
            <div className="text-white/90 hengshui-font text-lg">总词汇量</div>
            <div className="mt-2 text-white/60 text-sm">涵盖初中三年级</div>
          </div>
          <div className="glass rounded-2xl shadow-xl p-8 text-center hover-lift animate-float border border-white/20" style={{animationDelay: '1s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
              {selectedWords.length}
            </div>
            <div className="text-white/90 hengshui-font text-lg">已选择单词</div>
            <div className="mt-2 text-white/60 text-sm">准备练习</div>
          </div>
          <div className="glass rounded-2xl shadow-xl p-8 text-center hover-lift animate-float border border-white/20" style={{animationDelay: '2s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              {availableCategories.length}
            </div>
            <div className="text-white/90 hengshui-font text-lg">可用分类</div>
            <div className="mt-2 text-white/60 text-sm">精准分类</div>
          </div>
        </div>
      </div>
    </div>
  );
}
