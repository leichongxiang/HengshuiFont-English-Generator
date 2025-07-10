'use client';

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

import React from 'react';
import Link from 'next/link';

export default function ScreenshotsPage() {
  const screenshots = [
    {
      id: 1,
      title: '主页界面',
      description: '现代化的主页设计，包含功能介绍和快速开始按钮',
      image: '/screenshots/homepage.png',
      alt: '衡水体英语练字模板生成器主页'
    },
    {
      id: 2,
      title: '模板生成器',
      description: '直观的模板生成界面，支持多种自定义选项',
      image: '/screenshots/generator.png',
      alt: '模板生成器界面'
    },
    {
      id: 3,
      title: '词汇选择',
      description: '按年级和分类选择词汇，支持搜索和筛选',
      image: '/screenshots/vocabulary.png',
      alt: '词汇选择界面'
    },
    {
      id: 4,
      title: '预览效果',
      description: '实时预览生成的练字模板，确保效果满意',
      image: '/screenshots/preview.png',
      alt: '模板预览界面'
    },
    {
      id: 5,
      title: '导入功能',
      description: '支持CSV和JSON格式的批量词汇导入',
      image: '/screenshots/import.png',
      alt: '词汇导入界面'
    },
    {
      id: 6,
      title: '移动端适配',
      description: '完美适配移动设备，随时随地使用',
      image: '/screenshots/mobile.png',
      alt: '移动端界面'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold gradient-text">
                衡水体英语练字
              </Link>
              <span className="text-gray-500">项目截图</span>
            </div>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                首页
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors">
                演示
              </Link>
              <Link href="/screenshots" className="text-blue-600 font-medium">
                截图
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            项目截图展示
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过这些截图了解衡水体英语练字模板生成器的各项功能和界面设计
          </p>
        </div>

        {/* Screenshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {screenshot.title}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {screenshot.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {screenshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            主要功能特性
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">丰富词汇库</h3>
              <p className="text-gray-600 text-sm">135个精选词汇，覆盖小学到初中各年级</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">模板生成</h3>
              <p className="text-gray-600 text-sm">一键生成标准四线三格练字模板</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">批量导入</h3>
              <p className="text-gray-600 text-sm">支持CSV/JSON格式的词汇批量导入</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">移动适配</h3>
              <p className="text-gray-600 text-sm">完美适配手机和平板设备</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">高性能</h3>
              <p className="text-gray-600 text-sm">优化的构建，快速加载和响应</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">开源免费</h3>
              <p className="text-gray-600 text-sm">Apache 2.0许可证，完全开源</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              开始使用衡水体英语练字模板生成器
            </h2>
            <p className="text-xl mb-8 opacity-90">
              立即体验专业的英语练字模板生成工具
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                开始使用
              </Link>
              <Link
                href="/demo"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                查看演示
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">衡水体英语练字模板生成器</h3>
            <p className="text-gray-400 mb-6">
              专业的英语单词练字模板生成工具，助力学生提高英语书写水平
            </p>
            <div className="flex justify-center space-x-6">
              <a href="https://github.com/leichongxiang/HengshuiFont-English-Generator" 
                 className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                首页
              </Link>
              <Link href="/demo" className="text-gray-400 hover:text-white transition-colors">
                演示
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
              © 2024 衡水体英语练字模板生成器. 基于 Apache 2.0 许可证开源.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
