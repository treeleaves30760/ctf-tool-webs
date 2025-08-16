'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AsciiTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-ascii' | 'ascii-to-text' | 'text-to-unicode' | 'unicode-to-text' | 'text-to-utf8' | 'utf8-to-text'>('text-to-ascii');

  const handleConvert = () => {
    try {
      if (mode === 'text-to-ascii') {
        const result = input.split('').map(char => char.charCodeAt(0)).join(' ');
        setOutput(result);
      } else if (mode === 'ascii-to-text') {
        const codes = input.split(/\s+/).filter(code => code.trim());
        let result = '';
        for (const code of codes) {
          const num = parseInt(code.trim());
          if (!isNaN(num) && num >= 0 && num <= 127) {
            result += String.fromCharCode(num);
          }
        }
        setOutput(result);
      } else if (mode === 'text-to-unicode') {
        const result = input.split('').map(char => {
          const code = char.charCodeAt(0);
          return code > 127 ? `U+${code.toString(16).toUpperCase().padStart(4, '0')}` : code.toString();
        }).join(' ');
        setOutput(result);
      } else {
        // unicode-to-text
        const codes = input.split(/\s+/).filter(code => code.trim());
        let result = '';
        for (const code of codes) {
          const cleanCode = code.trim();
          if (cleanCode.startsWith('U+')) {
            const hex = cleanCode.slice(2);
            const num = parseInt(hex, 16);
            if (!isNaN(num)) {
              result += String.fromCharCode(num);
            }
          } else {
            const num = parseInt(cleanCode);
            if (!isNaN(num)) {
              result += String.fromCharCode(num);
            }
          }
        }
        setOutput(result);
      }
    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">ASCII/Unicode轉換工具</h1>
              <p className="text-black">ASCII和Unicode字符編碼轉換</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">轉換模式:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'text-to-ascii' | 'ascii-to-text' | 'text-to-unicode' | 'unicode-to-text' | 'text-to-utf8' | 'utf8-to-text')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="text-to-ascii">文字轉ASCII</option>
                    <option value="ascii-to-text">ASCII轉文字</option>
                    <option value="text-to-unicode">文字轉Unicode</option>
                    <option value="unicode-to-text">Unicode轉文字</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={
                      mode.includes('text-to') ? '請輸入要轉換的文字...' : '請輸入要轉換的編碼...'
                    }
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出
                  </label>
                  <textarea
                    value={output}
                    readOnly
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600"
                    placeholder="結果將顯示在這裡..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleConvert}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  轉換
                </button>
                <button
                  onClick={handleClear}
                  className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  清空
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  複製結果
                </button>
              </div>
            </div>

            {/* ASCII Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">常用ASCII對照表</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-xs">
                {Array.from({length: 95}, (_, i) => i + 32).map(code => (
                  <div key={code} className="text-center p-1 border border-gray-200 rounded">
                    <div className="font-bold">{String.fromCharCode(code)}</div>
                    <div className="text-gray-600">{code}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>ASCII:</strong> 美國標準資訊交換碼，範圍0-127，包含英文字母、數字和符號。</p>
                <p><strong>Unicode:</strong> 國際標準字符編碼，可以表示世界上大部分文字系統。</p>
                <p><strong>轉換格式:</strong> ASCII用空格分隔數字，Unicode用U+前綴表示十六進位。</p>
                <p><strong>應用:</strong> 字符編碼分析、數據格式轉換、程式開發等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> ASCII是Unicode的子集，Unicode完全兼容ASCII。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}