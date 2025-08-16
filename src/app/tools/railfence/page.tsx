/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RailFenceTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [rails, setRails] = useState(3);

  const railFenceEncrypt = (text: string, numRails: number): string => {
    if (numRails <= 1) return text;
    
    const fence: string[][] = Array(numRails).fill(null).map(() => []);
    let rail = 0;
    let direction = 1;
    
    for (const char of text) {
      fence[rail].push(char);
      rail += direction;
      
      if (rail === numRails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    return fence.map(row => row.join('')).join('');
  };

  const railFenceDecrypt = (cipher: string, numRails: number): string => {
    if (numRails <= 1) return cipher;
    
    const fence: (string | null)[][] = Array(numRails).fill(null).map(() => Array(cipher.length).fill(null));
    let rail = 0;
    let direction = 1;
    
    // Mark positions
    for (let i = 0; i < cipher.length; i++) {
      fence[rail][i] = '*';
      rail += direction;
      
      if (rail === numRails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    // Fill characters
    let index = 0;
    for (let r = 0; r < numRails; r++) {
      for (let c = 0; c < cipher.length; c++) {
        if (fence[r][c] === '*') {
          fence[r][c] = cipher[index++];
        }
      }
    }
    
    // Read zigzag
    let result = '';
    rail = 0;
    direction = 1;
    
    for (let i = 0; i < cipher.length; i++) {
      result += fence[rail][i];
      rail += direction;
      
      if (rail === numRails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    return result;
  };

  const handleConvert = () => {
    try {
      if (rails < 2) {
        setOutput('錯誤: 柵欄數量必須至少為2');
        return;
      }

      const result = mode === 'encrypt' 
        ? railFenceEncrypt(input, rails)
        : railFenceDecrypt(input, rails);
      
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">柵欄密碼工具</h1>
              <p className="text-black">柵欄密碼（Rail Fence Cipher）加密解密</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">模式:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="encrypt">加密</option>
                    <option value="decrypt">解密</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">柵欄數量:</label>
                  <input
                    type="number"
                    value={rails}
                    onChange={(e) => setRails(parseInt(e.target.value) || 3)}
                    min="2"
                    max="10"
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500 w-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encrypt' ? '明文' : '密文'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encrypt' ? '請輸入要加密的明文...' : '請輸入要解密的密文...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encrypt' ? '密文' : '明文'})
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
                  {mode === 'encrypt' ? '加密' : '解密'}
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
                <p><strong>柵欄密碼:</strong> 一種置換密碼，將明文以之字形路徑寫在多條柵欄上。</p>
                <p><strong>加密過程:</strong> 文字以之字形寫在指定數量的柵欄上，然後按行讀取。</p>
                <p><strong>柵欄數量:</strong> 決定加密強度，數量越多加密效果越好但也越複雜。</p>
                <p><strong>範例:</strong> "HELLO"在3條柵欄上會變成"H O L E L"的形式。</p>
                <p><strong>應用:</strong> 古典密碼學、密碼學教學、CTF競賽等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 柵欄密碼是換位密碼的一種，改變字母順序而不改變字母本身。
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