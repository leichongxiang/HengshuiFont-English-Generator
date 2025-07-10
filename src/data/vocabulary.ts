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

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  grade: 'primary1' | 'primary2' | 'primary3' | 'primary4' | 'primary5' | 'primary6' | 'grade7' | 'grade8' | 'grade9';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: number; // 1-10, 10 being most frequent
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection' | 'article';
  example?: string; // 例句
  collocations?: string[]; // 常用搭配
  textbookVersion?: 'PEP' | 'Foreign' | 'Oxford' | 'Cambridge'; // 教材版本
  unit?: string; // 单元
  isLearned?: boolean; // 学习状态
  masteryLevel?: number; // 掌握程度 1-5
}

export interface EbbinghausSchedule {
  day1: boolean;
  day3: boolean;
  day7: boolean;
  day15: boolean;
  day30: boolean;
}

const vocabularyDataArray: VocabularyWord[] = [
  // ==================== 小学一年级 (Primary 1) ====================
  // 日常用语
  {
    id: '1',
    word: 'hello',
    phonetic: '/həˈloʊ/',
    translation: '你好',
    grade: 'primary1',
    category: '日常用语',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'interjection',
    example: 'Hello, how are you?',
    collocations: ['hello there', 'say hello'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '2',
    word: 'hi',
    phonetic: '/haɪ/',
    translation: '嗨',
    grade: 'primary1',
    category: '日常用语',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'interjection',
    example: 'Hi! Nice to meet you.',
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '3',
    word: 'bye',
    phonetic: '/baɪ/',
    translation: '再见',
    grade: 'primary1',
    category: '日常用语',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'interjection',
    example: 'Bye! See you tomorrow.',
    collocations: ['bye bye', 'say bye'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '4',
    word: 'thank',
    phonetic: '/θæŋk/',
    translation: '谢谢',
    grade: 'primary1',
    category: '日常用语',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'verb',
    example: 'Thank you very much.',
    collocations: ['thank you', 'thank God'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '5',
    word: 'please',
    phonetic: '/pliːz/',
    translation: '请',
    grade: 'primary1',
    category: '日常用语',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'adverb',
    example: 'Please sit down.',
    collocations: ['please help', 'please come'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '6',
    word: 'sorry',
    phonetic: '/ˈsɔːri/',
    translation: '对不起',
    grade: 'primary1',
    category: '日常用语',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'adjective',
    example: 'Sorry, I am late.',
    collocations: ['sorry for', 'feel sorry'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },

  // 代词
  {
    id: '7',
    word: 'I',
    phonetic: '/aɪ/',
    translation: '我',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'pronoun',
    example: 'I am a student.',
    collocations: ['I am', 'I have', 'I like'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '8',
    word: 'you',
    phonetic: '/juː/',
    translation: '你',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'pronoun',
    example: 'You are my friend.',
    collocations: ['you are', 'you have', 'thank you'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '9',
    word: 'he',
    phonetic: '/hiː/',
    translation: '他',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'pronoun',
    example: 'He is my brother.',
    collocations: ['he is', 'he has'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '10',
    word: 'she',
    phonetic: '/ʃiː/',
    translation: '她',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'pronoun',
    example: 'She is my sister.',
    collocations: ['she is', 'she has'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '11',
    word: 'it',
    phonetic: '/ɪt/',
    translation: '它',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'pronoun',
    example: 'It is a cat.',
    collocations: ['it is', 'it has'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '12',
    word: 'we',
    phonetic: '/wiː/',
    translation: '我们',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'pronoun',
    example: 'We are friends.',
    collocations: ['we are', 'we have'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '13',
    word: 'they',
    phonetic: '/ðeɪ/',
    translation: '他们',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'pronoun',
    example: 'They are students.',
    collocations: ['they are', 'they have'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },

  // 颜色
  {
    id: '14',
    word: 'red',
    phonetic: '/red/',
    translation: '红色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'adjective',
    example: 'I have a red pen.',
    collocations: ['red color', 'red apple', 'red car'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },
  {
    id: '15',
    word: 'blue',
    phonetic: '/bluː/',
    translation: '蓝色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'adjective',
    example: 'The sky is blue.',
    collocations: ['blue sky', 'blue sea', 'blue book'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },
  {
    id: '16',
    word: 'yellow',
    phonetic: '/ˈjeloʊ/',
    translation: '黄色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'adjective',
    example: 'The banana is yellow.',
    collocations: ['yellow flower', 'yellow light'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },
  {
    id: '17',
    word: 'green',
    phonetic: '/ɡriːn/',
    translation: '绿色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'adjective',
    example: 'The grass is green.',
    collocations: ['green tree', 'green apple'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },
  {
    id: '18',
    word: 'black',
    phonetic: '/blæk/',
    translation: '黑色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'adjective',
    example: 'I have a black cat.',
    collocations: ['black hair', 'black car'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },
  {
    id: '19',
    word: 'white',
    phonetic: '/waɪt/',
    translation: '白色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'adjective',
    example: 'The snow is white.',
    collocations: ['white paper', 'white shirt'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },

  // 动物
  {
    id: '20',
    word: 'cat',
    phonetic: '/kæt/',
    translation: '猫',
    grade: 'primary1',
    category: '动物',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'The cat is sleeping.',
    collocations: ['black cat', 'white cat', 'pet cat'],
    textbookVersion: 'PEP',
    unit: 'Unit 4'
  },
  {
    id: '21',
    word: 'dog',
    phonetic: '/dɔːɡ/',
    translation: '狗',
    grade: 'primary1',
    category: '动物',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'My dog is very friendly.',
    collocations: ['pet dog', 'big dog', 'small dog'],
    textbookVersion: 'PEP',
    unit: 'Unit 4'
  },
  {
    id: '22',
    word: 'bird',
    phonetic: '/bɜːrd/',
    translation: '鸟',
    grade: 'primary1',
    category: '动物',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'The bird can fly.',
    collocations: ['little bird', 'bird nest'],
    textbookVersion: 'PEP',
    unit: 'Unit 4'
  },
  {
    id: '23',
    word: 'fish',
    phonetic: '/fɪʃ/',
    translation: '鱼',
    grade: 'primary1',
    category: '动物',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'Fish live in water.',
    collocations: ['big fish', 'small fish'],
    textbookVersion: 'PEP',
    unit: 'Unit 4'
  },
  {
    id: '24',
    word: 'duck',
    phonetic: '/dʌk/',
    translation: '鸭子',
    grade: 'primary1',
    category: '动物',
    difficulty: 'easy',
    frequency: 7,
    partOfSpeech: 'noun',
    example: 'The duck is swimming.',
    collocations: ['yellow duck', 'duck pond'],
    textbookVersion: 'PEP',
    unit: 'Unit 4'
  },

  // 水果
  {
    id: '25',
    word: 'apple',
    phonetic: '/ˈæpəl/',
    translation: '苹果',
    grade: 'primary1',
    category: '水果',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I like to eat apples.',
    collocations: ['red apple', 'green apple', 'apple juice'],
    textbookVersion: 'PEP',
    unit: 'Unit 5'
  },
  {
    id: '26',
    word: 'banana',
    phonetic: '/bəˈnænə/',
    translation: '香蕉',
    grade: 'primary1',
    category: '水果',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'The banana is yellow.',
    collocations: ['yellow banana', 'banana milk'],
    textbookVersion: 'PEP',
    unit: 'Unit 5'
  },
  {
    id: '27',
    word: 'orange',
    phonetic: '/ˈɔːrɪndʒ/',
    translation: '橙子',
    grade: 'primary1',
    category: '水果',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'The orange is sweet.',
    collocations: ['orange juice', 'fresh orange'],
    textbookVersion: 'PEP',
    unit: 'Unit 5'
  },

  // 数字
  {
    id: '28',
    word: 'one',
    phonetic: '/wʌn/',
    translation: '一',
    grade: 'primary1',
    category: '数字',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'noun',
    example: 'I have one apple.',
    collocations: ['one day', 'one time'],
    textbookVersion: 'PEP',
    unit: 'Unit 6'
  },
  {
    id: '29',
    word: 'two',
    phonetic: '/tuː/',
    translation: '二',
    grade: 'primary1',
    category: '数字',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'noun',
    example: 'I have two hands.',
    collocations: ['two days', 'two books'],
    textbookVersion: 'PEP',
    unit: 'Unit 6'
  },
  {
    id: '30',
    word: 'three',
    phonetic: '/θriː/',
    translation: '三',
    grade: 'primary1',
    category: '数字',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I see three birds.',
    collocations: ['three times', 'three days'],
    textbookVersion: 'PEP',
    unit: 'Unit 6'
  },

  // 身体部位
  {
    id: '31',
    word: 'head',
    phonetic: '/hed/',
    translation: '头',
    grade: 'primary1',
    category: '身体部位',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'Touch your head.',
    collocations: ['my head', 'head teacher'],
    textbookVersion: 'PEP',
    unit: 'Unit 7'
  },
  {
    id: '32',
    word: 'eye',
    phonetic: '/aɪ/',
    translation: '眼睛',
    grade: 'primary1',
    category: '身体部位',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'I have two eyes.',
    collocations: ['blue eyes', 'big eyes'],
    textbookVersion: 'PEP',
    unit: 'Unit 7'
  },
  {
    id: '33',
    word: 'nose',
    phonetic: '/noʊz/',
    translation: '鼻子',
    grade: 'primary1',
    category: '身体部位',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'Touch your nose.',
    collocations: ['big nose', 'small nose'],
    textbookVersion: 'PEP',
    unit: 'Unit 7'
  },
  {
    id: '34',
    word: 'mouth',
    phonetic: '/maʊθ/',
    translation: '嘴巴',
    grade: 'primary1',
    category: '身体部位',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'Open your mouth.',
    collocations: ['big mouth', 'small mouth'],
    textbookVersion: 'PEP',
    unit: 'Unit 7'
  },
  {
    id: '35',
    word: 'hand',
    phonetic: '/hænd/',
    translation: '手',
    grade: 'primary1',
    category: '身体部位',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'Raise your hand.',
    collocations: ['left hand', 'right hand'],
    textbookVersion: 'PEP',
    unit: 'Unit 7'
  },

  // 基本形容词
  {
    id: '36',
    word: 'big',
    phonetic: '/bɪɡ/',
    translation: '大的',
    grade: 'primary1',
    category: '形容词',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'adjective',
    example: 'It is a big house.',
    collocations: ['big house', 'big dog'],
    textbookVersion: 'PEP',
    unit: 'Unit 8'
  },
  {
    id: '37',
    word: 'small',
    phonetic: '/smɔːl/',
    translation: '小的',
    grade: 'primary1',
    category: '形容词',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'adjective',
    example: 'It is a small cat.',
    collocations: ['small house', 'small dog'],
    textbookVersion: 'PEP',
    unit: 'Unit 8'
  },
  {
    id: '38',
    word: 'good',
    phonetic: '/ɡʊd/',
    translation: '好的',
    grade: 'primary1',
    category: '形容词',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'adjective',
    example: 'This is a good book.',
    collocations: ['good morning', 'good night', 'good job'],
    textbookVersion: 'PEP',
    unit: 'Unit 8'
  },

  // ==================== 小学二年级 (Primary 2) ====================
  // 学习用品
  {
    id: '39',
    word: 'book',
    phonetic: '/bʊk/',
    translation: '书',
    grade: 'primary2',
    category: '学习用品',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'noun',
    example: 'I read a book every day.',
    collocations: ['English book', 'story book', 'text book'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '40',
    word: 'pen',
    phonetic: '/pen/',
    translation: '钢笔',
    grade: 'primary2',
    category: '学习用品',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I write with a pen.',
    collocations: ['blue pen', 'red pen', 'ball pen'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '41',
    word: 'pencil',
    phonetic: '/ˈpensəl/',
    translation: '铅笔',
    grade: 'primary2',
    category: '学习用品',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I draw with a pencil.',
    collocations: ['colored pencil', 'pencil box'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '42',
    word: 'afternoon',
    phonetic: '/ˌæftərˈnuːn/',
    translation: '下午',
    grade: 'primary1',
    category: '时间',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'Good afternoon, everyone!',
    collocations: ['good afternoon', 'this afternoon'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '43',
    word: 'night',
    phonetic: '/naɪt/',
    translation: '晚上',
    grade: 'primary1',
    category: '时间',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'Good night, mom!',
    collocations: ['good night', 'at night', 'last night'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '44',
    word: 'name',
    phonetic: '/neɪm/',
    translation: '名字',
    grade: 'primary1',
    category: '个人信息',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'noun',
    example: 'My name is Tom.',
    collocations: ['my name', 'your name', 'first name'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },
  {
    id: '45',
    word: 'I',
    phonetic: '/aɪ/',
    translation: '我',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'pronoun',
    example: 'I am a student.',
    collocations: ['I am', 'I have', 'I like'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },
  {
    id: '46',
    word: 'you',
    phonetic: '/juː/',
    translation: '你',
    grade: 'primary1',
    category: '代词',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'pronoun',
    example: 'You are my friend.',
    collocations: ['you are', 'you have', 'thank you'],
    textbookVersion: 'PEP',
    unit: 'Unit 3'
  },
  {
    id: '47',
    word: 'apple',
    phonetic: '/ˈæpəl/',
    translation: '苹果',
    grade: 'primary1',
    category: '水果',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I like to eat apples.',
    collocations: ['red apple', 'green apple', 'apple juice'],
    textbookVersion: 'PEP',
    unit: 'Unit 4'
  },
  {
    id: '48',
    word: 'banana',
    phonetic: '/bəˈnænə/',
    translation: '香蕉',
    grade: 'primary1',
    category: '水果',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'noun',
    example: 'The banana is yellow.',
    collocations: ['yellow banana', 'banana milk'],
    textbookVersion: 'PEP',
    unit: 'Unit 4'
  },
  {
    id: '49',
    word: 'cat',
    phonetic: '/kæt/',
    translation: '猫',
    grade: 'primary1',
    category: '动物',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'The cat is sleeping.',
    collocations: ['black cat', 'white cat', 'pet cat'],
    textbookVersion: 'PEP',
    unit: 'Unit 5'
  },
  {
    id: '50',
    word: 'dog',
    phonetic: '/dɔːɡ/',
    translation: '狗',
    grade: 'primary1',
    category: '动物',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'My dog is very friendly.',
    collocations: ['pet dog', 'big dog', 'small dog'],
    textbookVersion: 'PEP',
    unit: 'Unit 5'
  },
  {
    id: '51',
    word: 'red',
    phonetic: '/red/',
    translation: '红色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'adjective',
    example: 'I have a red pen.',
    collocations: ['red color', 'red apple', 'red car'],
    textbookVersion: 'PEP',
    unit: 'Unit 6'
  },
  {
    id: '52',
    word: 'blue',
    phonetic: '/bluː/',
    translation: '蓝色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'adjective',
    example: 'The sky is blue.',
    collocations: ['blue sky', 'blue sea', 'blue book'],
    textbookVersion: 'PEP',
    unit: 'Unit 6'
  },
  {
    id: '53',
    word: 'yellow',
    phonetic: '/ˈjeloʊ/',
    translation: '黄色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'adjective',
    example: 'The banana is yellow.',
    collocations: ['yellow flower', 'yellow light'],
    textbookVersion: 'PEP',
    unit: 'Unit 6'
  },
  {
    id: '54',
    word: 'green',
    phonetic: '/ɡriːn/',
    translation: '绿色',
    grade: 'primary1',
    category: '颜色',
    difficulty: 'easy',
    frequency: 8,
    partOfSpeech: 'adjective',
    example: 'The grass is green.',
    collocations: ['green tree', 'green apple'],
    textbookVersion: 'PEP',
    unit: 'Unit 6'
  },

  // Primary 2 - 小学二年级
  {
    id: '55',
    word: 'book',
    phonetic: '/bʊk/',
    translation: '书',
    grade: 'primary2',
    category: '学习用品',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'noun',
    example: 'I read a book every day.',
    collocations: ['English book', 'story book', 'text book'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '56',
    word: 'pen',
    phonetic: '/pen/',
    translation: '钢笔',
    grade: 'primary2',
    category: '学习用品',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I write with a pen.',
    collocations: ['blue pen', 'red pen', 'ball pen'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '57',
    word: 'pencil',
    phonetic: '/ˈpensəl/',
    translation: '铅笔',
    grade: 'primary2',
    category: '学习用品',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I draw with a pencil.',
    collocations: ['colored pencil', 'pencil box'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '58',
    word: 'one',
    phonetic: '/wʌn/',
    translation: '一',
    grade: 'primary2',
    category: '数字',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'noun',
    example: 'I have one apple.',
    collocations: ['one day', 'one time'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },
  {
    id: '59',
    word: 'two',
    phonetic: '/tuː/',
    translation: '二',
    grade: 'primary2',
    category: '数字',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'noun',
    example: 'I have two hands.',
    collocations: ['two days', 'two books'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  },

  // Grade 7 - 初中七年级
  {
    id: '60',
    word: 'family',
    phonetic: '/ˈfæməli/',
    translation: '家庭',
    grade: 'grade7',
    category: '家庭',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I love my family.',
    collocations: ['big family', 'happy family', 'family photo'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '61',
    word: 'school',
    phonetic: '/skuːl/',
    translation: '学校',
    grade: 'grade7',
    category: '学习',
    difficulty: 'easy',
    frequency: 10,
    partOfSpeech: 'noun',
    example: 'I go to school every day.',
    collocations: ['primary school', 'go to school', 'school bus'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '62',
    word: 'teacher',
    phonetic: '/ˈtiːtʃər/',
    translation: '老师',
    grade: 'grade7',
    category: '学习',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'My teacher is very kind.',
    collocations: ['English teacher', 'math teacher', 'good teacher'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '63',
    word: 'student',
    phonetic: '/ˈstuːdənt/',
    translation: '学生',
    grade: 'grade7',
    category: '学习',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'I am a good student.',
    collocations: ['good student', 'new student', 'primary student'],
    textbookVersion: 'PEP',
    unit: 'Unit 1'
  },
  {
    id: '64',
    word: 'friend',
    phonetic: '/frend/',
    translation: '朋友',
    grade: 'grade7',
    category: '人际关系',
    difficulty: 'easy',
    frequency: 9,
    partOfSpeech: 'noun',
    example: 'You are my best friend.',
    collocations: ['best friend', 'good friend', 'make friends'],
    textbookVersion: 'PEP',
    unit: 'Unit 2'
  }
];

export const gradeCategories = {
  primary1: ['日常用语', '水果', '动物', '颜色', '代词', '时间', '个人信息'],
  primary2: ['学习用品', '数字', '时间'],
  primary3: ['家庭', '人际关系'],
  primary4: ['学习', '学习用品'],
  primary5: ['科技', '通讯'],
  primary6: ['节日', '情感', '人际关系'],
  grade7: ['日常用语', '家庭', '学习', '人际关系', '情感', '形容词', '个人信息', '描述', '数学', '通讯', '科技', '学习用品'],
  grade8: ['形容词', '动词', '学科', '活动', '健康', '旅行', '地点', '地理'],
  grade9: ['科学', '社会', '品格', '抽象概念', '学习', '成功', '困难', '进步']
};

export const partOfSpeechCategories = {
  noun: '名词',
  verb: '动词',
  adjective: '形容词',
  adverb: '副词',
  pronoun: '代词',
  preposition: '介词',
  conjunction: '连词',
  interjection: '感叹词',
  article: '冠词'
};

export const textbookVersions = {
  PEP: '人教版',
  Foreign: '外研版',
  Oxford: '牛津版',
  Cambridge: '剑桥版'
};

export const ebbinghausIntervals = [1, 3, 7, 15, 30]; // days

// 导入扩展词汇
import { extendedVocabularyData, primary3Vocabulary, primary4Vocabulary } from './extendedVocabulary';
import { grade7Vocabulary, grade8Vocabulary } from './juniorHighVocabulary';

// 合并所有词汇数据
const allVocabularyData = [
  ...vocabularyDataArray,
  ...extendedVocabularyData,
  ...primary3Vocabulary,
  ...primary4Vocabulary,
  ...grade7Vocabulary,
  ...grade8Vocabulary
];

// 导出词汇数据
export const vocabularyData = allVocabularyData;

// 按年级分组的词汇数据
export const vocabularyByGrade = {
  primary1: allVocabularyData.filter(word => word.grade === 'primary1'),
  primary2: allVocabularyData.filter(word => word.grade === 'primary2'),
  primary3: allVocabularyData.filter(word => word.grade === 'primary3'),
  primary4: allVocabularyData.filter(word => word.grade === 'primary4'),
  primary5: allVocabularyData.filter(word => word.grade === 'primary5'),
  primary6: allVocabularyData.filter(word => word.grade === 'primary6'),
  grade7: allVocabularyData.filter(word => word.grade === 'grade7'),
  grade8: allVocabularyData.filter(word => word.grade === 'grade8'),
  grade9: allVocabularyData.filter(word => word.grade === 'grade9')
};

// 预设模板配置
export const presetTemplates = {
  // 单年级模板
  primary1_all: {
    name: '小学一年级全部单词',
    description: '包含小学一年级所有核心词汇',
    words: vocabularyByGrade.primary1,
    grade: 'primary1'
  },
  primary2_all: {
    name: '小学二年级全部单词',
    description: '包含小学二年级所有核心词汇',
    words: vocabularyByGrade.primary2,
    grade: 'primary2'
  },
  primary3_all: {
    name: '小学三年级全部单词',
    description: '包含小学三年级所有核心词汇',
    words: vocabularyByGrade.primary3,
    grade: 'primary3'
  },

  // 主题分类模板
  colors_primary: {
    name: '小学阶段颜色类单词',
    description: '小学1-6年级所有颜色相关词汇',
    words: allVocabularyData.filter(word =>
      word.category === '颜色' &&
      ['primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6'].includes(word.grade)
    ),
    category: '颜色'
  },
  animals_primary: {
    name: '小学阶段动物类单词',
    description: '小学1-6年级所有动物相关词汇',
    words: allVocabularyData.filter(word =>
      word.category === '动物' &&
      ['primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6'].includes(word.grade)
    ),
    category: '动物'
  },
  family_primary: {
    name: '小学阶段家庭类单词',
    description: '小学1-6年级所有家庭相关词汇',
    words: allVocabularyData.filter(word =>
      word.category === '家庭' &&
      ['primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6'].includes(word.grade)
    ),
    category: '家庭'
  },

  // 高频词汇模板
  high_frequency_100: {
    name: '小学必背100词',
    description: '小学阶段最高频的100个核心词汇',
    words: allVocabularyData
      .filter(word => ['primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6'].includes(word.grade))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 100),
    type: 'high_frequency'
  },
  junior_high_essential: {
    name: '初中必背核心词汇',
    description: '初中7-9年级最重要的核心词汇',
    words: allVocabularyData
      .filter(word => ['grade7', 'grade8', 'grade9'].includes(word.grade))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 150),
    type: 'high_frequency'
  }
};
