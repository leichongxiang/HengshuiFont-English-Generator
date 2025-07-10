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

import React, { useState, useRef } from 'react';
import { FileParser } from '@/utils/fileParser';
import { ImportValidator } from '@/utils/importValidator';

interface ImportResult {
  success: boolean;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errors: string[];
  warnings: string[];
}

export default function VocabularyImporter() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Read file content
      const content = await file.text();
      
      // Detect file type
      const detectedType = FileParser.detectFormat(content);
      let fileType: 'csv' | 'json';
      
      if (detectedType === 'unknown') {
        const extension = file.name.toLowerCase().split('.').pop();
        if (extension === 'csv') {
          fileType = 'csv';
        } else if (extension === 'json') {
          fileType = 'json';
        } else {
          throw new Error('Unsupported file format. Please use CSV or JSON files.');
        }
      } else {
        fileType = detectedType;
      }

      // Parse file content
      const parseResult = fileType === 'csv' 
        ? FileParser.parseCSV(content)
        : FileParser.parseJSON(content);

      if (parseResult.errors.length > 0) {
        setImportResult({
          success: false,
          totalRecords: 0,
          validRecords: 0,
          invalidRecords: 0,
          errors: parseResult.errors,
          warnings: parseResult.warnings
        });
        return;
      }

      // Validate records
      const validationResult = ImportValidator.validateRecords(parseResult.data);
      
      setImportResult({
        success: validationResult.invalidCount === 0,
        totalRecords: validationResult.totalRecords,
        validRecords: validationResult.validCount,
        invalidRecords: validationResult.invalidCount,
        errors: validationResult.invalidRecords.map(({ errors, row }) => 
          `Row ${row}: ${errors.map(e => e.message).join(', ')}`
        ),
        warnings: [
          ...parseResult.warnings,
          ...validationResult.warnings.map(w => w.message)
        ]
      });

    } catch (error) {
      setImportResult({
        success: false,
        totalRecords: 0,
        validRecords: 0,
        invalidRecords: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: []
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const downloadTemplate = (format: 'csv' | 'json') => {
    const template = format === 'csv' 
      ? FileParser.generateCSVTemplate()
      : FileParser.generateJSONTemplate();
    
    const blob = new Blob([template], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary_template.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">词汇导入工具</h2>
        <p className="text-gray-600">支持CSV和JSON格式的批量词汇导入</p>
      </div>

      {/* Template Downloads */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">下载模板</h3>
        <p className="text-blue-700 mb-3">使用标准模板确保导入格式正确</p>
        <div className="flex gap-3">
          <button
            onClick={() => downloadTemplate('csv')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            下载 CSV 模板
          </button>
          <button
            onClick={() => downloadTemplate('json')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            下载 JSON 模板
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              拖拽文件到此处或点击选择文件
            </p>
            <p className="text-gray-500">
              支持 CSV 和 JSON 格式，最大 10MB
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? '处理中...' : '选择文件'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>

      {/* Import Results */}
      {importResult && (
        <div className={`border rounded-lg p-6 ${
          importResult.success 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center mb-4">
            <div className={`text-2xl mr-3 ${
              importResult.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {importResult.success ? '✅' : '❌'}
            </div>
            <h3 className={`text-lg font-semibold ${
              importResult.success ? 'text-green-900' : 'text-red-900'
            }`}>
              {importResult.success ? '验证成功' : '验证失败'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {importResult.totalRecords}
              </div>
              <div className="text-gray-600">总记录数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {importResult.validRecords}
              </div>
              <div className="text-gray-600">有效记录</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {importResult.invalidRecords}
              </div>
              <div className="text-gray-600">无效记录</div>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-red-900 mb-2">错误信息:</h4>
              <div className="bg-white border border-red-200 rounded p-3 max-h-40 overflow-y-auto">
                {importResult.errors.map((error, index) => (
                  <div key={index} className="text-red-700 text-sm mb-1">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {importResult.warnings.length > 0 && (
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">警告信息:</h4>
              <div className="bg-white border border-yellow-200 rounded p-3 max-h-40 overflow-y-auto">
                {importResult.warnings.map((warning, index) => (
                  <div key={index} className="text-yellow-700 text-sm mb-1">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {importResult.success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded">
              <p className="text-green-800">
                ✨ 所有记录验证通过！您可以继续进行实际导入操作。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
