'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BinaryTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [separator, setSeparator] = useState<'space' | 'none'>('space');

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const binary = Array.from(new TextEncoder().encode(input))
          .map(byte => byte.toString(2).padStart(8, '0'))
          .join(separator === 'space' ? ' ' : '');
        setOutput(binary);
      } else {
        const binaryStr = input.replace(/\s+/g, separator === 'space' ? ' ' : '');
        const binaryArray = separator === 'space' 
          ? binaryStr.split(' ')
          : binaryStr.match(/.{1,8}/g) || [];
        
        const bytes = binaryArray.map(bin => {
          if (!/^[01]{8}$/.test(bin)) {
            throw new Error(`無效的二進制格式: ${bin}`);
          }
          return parseInt(bin, 2);
        });
        
        const decoded = new TextDecoder().decode(new Uint8Array(bytes));
        setOutput(decoded);
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
              <h1 className="text-3xl font-bold text-black mb-4">二進制編碼工具</h1>
              <p className="text-black">將文字轉換為二進制編碼或將二進制編碼轉換為文字</p>
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
                    onChange={(e) => setSeparator(e.target.value as 'space' | 'none')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="space">空格分隔</option>
                    <option value="none">無分隔</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '原文' : '二進制'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的文字...' : '請輸入二進制編碼...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? '二進制' : '原文'})
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

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>二進制編碼:</strong> 將文字轉換為由0和1組成的二進制表示。</p>
                <p><strong>編碼:</strong> 將普通文字轉換為二進制編碼。</p>
                <p><strong>解碼:</strong> 將二進制編碼轉換回原始文字。</p>
                <p><strong>分隔符:</strong> 可選擇使用空格分隔每個字節的二進制表示。</p>
                <p className="text-sm mt-3">
                  <strong>範例:</strong> "Hi" → "01001000 01101001" (空格分隔) 或 "0100100001101001" (無分隔)
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