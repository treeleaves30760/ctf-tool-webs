'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RadixTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);

  const handleConvert = () => {
    try {
      if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
        setOutput('錯誤: 進制必須在2-36之間');
        return;
      }

      const cleanInput = input.trim();
      if (!cleanInput) {
        setOutput('');
        return;
      }

      // Convert from input base to decimal
      const decimal = parseInt(cleanInput, fromBase);
      
      if (isNaN(decimal)) {
        setOutput('錯誤: 輸入不是有效的' + fromBase + '進制數字');
        return;
      }

      // Convert from decimal to target base
      const result = decimal.toString(toBase).toUpperCase();
      setOutput(result);
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

  const commonBases = [
    { value: 2, name: '二進制' },
    { value: 8, name: '八進制' },
    { value: 10, name: '十進制' },
    { value: 16, name: '十六進制' },
    { value: 32, name: '32進制' },
    { value: 36, name: '36進制' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">進制轉換工具</h1>
              <p className="text-black">數字進制轉換，支援2-36進制</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">源進制:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={fromBase}
                      onChange={(e) => setFromBase(parseInt(e.target.value) || 10)}
                      min="2"
                      max="36"
                      className="bg-white text-black border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 w-20"
                    />
                    <select
                      value={fromBase}
                      onChange={(e) => setFromBase(parseInt(e.target.value))}
                      className="bg-white text-black border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 flex-1"
                    >
                      {commonBases.map(base => (
                        <option key={base.value} value={base.value}>{base.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">目標進制:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={toBase}
                      onChange={(e) => setToBase(parseInt(e.target.value) || 10)}
                      min="2"
                      max="36"
                      className="bg-white text-black border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 w-20"
                    />
                    <select
                      value={toBase}
                      onChange={(e) => setToBase(parseInt(e.target.value))}
                      className="bg-white text-black border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 flex-1"
                    >
                      {commonBases.map(base => (
                        <option key={base.value} value={base.value}>{base.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({fromBase}進制)
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={`請輸入${fromBase}進制數字...`}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({toBase}進制)
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
                  onClick={() => {setFromBase(toBase); setToBase(fromBase);}}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  交換進制
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

            {/* Quick Convert */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">快速轉換</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => {setFromBase(10); setToBase(2);}}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  十進制 → 二進制
                </button>
                <button
                  onClick={() => {setFromBase(10); setToBase(16);}}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  十進制 → 十六進制
                </button>
                <button
                  onClick={() => {setFromBase(2); setToBase(10);}}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  二進制 → 十進制
                </button>
                <button
                  onClick={() => {setFromBase(16); setToBase(10);}}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  十六進制 → 十進制
                </button>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>進制轉換:</strong> 將數字從一種進制表示轉換為另一種進制表示。</p>
                <p><strong>支援範圍:</strong> 2進制到36進制，使用0-9和A-Z字符。</p>
                <p><strong>常用進制:</strong> 二進制(計算機)、八進制(Unix權限)、十進制(日常)、十六進制(編程)。</p>
                <p><strong>字符對應:</strong> 0-9代表0-9，A-Z代表10-35。</p>
                <p><strong>應用:</strong> 程式設計、數學計算、計算機科學等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 輸入時不區分大小寫，輸出統一使用大寫字母。
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