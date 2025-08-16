'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function A1Z26Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [separator, setSeparator] = useState(' ');

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const result = input.replace(/[a-zA-Z]/g, (char) => {
          const code = char.toUpperCase().charCodeAt(0) - 64; // A=1, B=2, ..., Z=26
          return code.toString();
        }).replace(/(\d+)/g, `$1${separator}`).replace(new RegExp(`${separator}$`), '');
        
        setOutput(result);
      } else {
        // Decode
        const numbers = input.split(new RegExp(`[${separator}\\s]+`)).filter(n => n.trim());
        let result = '';
        
        for (const numStr of numbers) {
          const num = parseInt(numStr.trim());
          if (num >= 1 && num <= 26) {
            result += String.fromCharCode(num + 64); // 1=A, 2=B, ..., 26=Z
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
              <h1 className="text-3xl font-bold text-black mb-4">A1Z26密碼工具</h1>
              <p className="text-black">字母數字對應密碼，A=1, B=2, ..., Z=26</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">模式:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'encode' | 'decode')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="encode">編碼</option>
                    <option value="decode">解碼</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">分隔符:</label>
                  <select
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value=" ">空格</option>
                    <option value="-">短橫線</option>
                    <option value=",">逗號</option>
                    <option value=".">句號</option>
                    <option value="">無分隔符</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '英文字母' : '數字'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的英文字母...' : '請輸入要解碼的數字（1-26）...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? '數字' : '英文字母'})
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
                  {mode === 'encode' ? '編碼' : '解碼'}
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

            {/* Reference Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">字母數字對照表</h3>
              <div className="grid grid-cols-13 gap-2 text-sm">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, index) => (
                  <div key={letter} className="text-center p-2 border border-gray-200 rounded">
                    <div className="font-bold text-blue-600">{letter}</div>
                    <div className="text-xs text-gray-600">↓</div>
                    <div className="font-mono">{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>A1Z26密碼:</strong> 最簡單的字母數字對應密碼，A對應1，Z對應26。</p>
                <p><strong>編碼規則:</strong> 將每個字母替換為其在字母表中的位置數字。</p>
                <p><strong>分隔符:</strong> 可以選擇不同的分隔符來分隔數字，避免歧義。</p>
                <p><strong>保留:</strong> 只轉換英文字母，其他字符保持不變。</p>
                <p><strong>應用:</strong> 密碼學入門、謎題遊戲、簡單的文字編碼等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 這是最基礎的替換密碼，安全性很低，主要用於教學和遊戲。
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