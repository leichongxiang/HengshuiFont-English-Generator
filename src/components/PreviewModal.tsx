'use client';

import React from 'react';
import { Download, X } from 'lucide-react';

interface PreviewModalProps {
  showPreview: boolean;
  previewPdfUrl: string | null;
  previewTitle: string;
  selectedWordsCount: number;
  onClose: () => void;
  onDownload: () => void;
}

export default function PreviewModal({
  showPreview,
  previewPdfUrl,
  previewTitle,
  selectedWordsCount,
  onClose,
  onDownload
}: PreviewModalProps) {
  if (!showPreview || !previewPdfUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{previewTitle}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Preview showing first {selectedWordsCount <= 10 ? selectedWordsCount : '10'} words
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PDF预览区域 */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={previewPdfUrl}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          </div>
        </div>

        {/* 模态框底部 */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>💡 This is a preview with limited words. Download the full PDF to get all {selectedWordsCount} selected words.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={onDownload}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Download Full PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
