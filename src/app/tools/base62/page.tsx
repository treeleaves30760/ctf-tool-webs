'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Base62Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputType, setInputType] = useState<'string' | 'number'>('string');

  const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  const base62Encode = (str: string): string => {
    if (!str) return '';
    
    const bytes = new TextEncoder().encode(str);
    let result = '';
    let num = BigInt(0);
    
    // 將位元組轉換為大整數
    for (const byte of bytes) {
      num = (num << BigInt(8)) | BigInt(byte);
    }
    
    // 如果是0，直接返回
    if (num === BigInt(0)) return '0';
    
    // 轉換為Base62
    while (num > BigInt(0)) {
      result = BASE62_CHARS[Number(num % BigInt(62))] + result;
      num = num / BigInt(62);
    }
    
    return result;
  };

  const base62Decode = (str: string): string => {
    if (!str) return '';
    
    try {
      let num = BigInt(0);
      
      // 將Base62字串轉換為大整數
      for (const char of str) {
        const index = BASE62_CHARS.indexOf(char);
        if (index === -1) {
          throw new Error(`無效的Base62字符: ${char}`);
        }
        num = num * BigInt(62) + BigInt(index);
      }
      
      if (num === BigInt(0)) return '';
      
      // 將大整數轉換為位元組陣列
      const bytes: number[] = [];
      while (num > BigInt(0)) {
        bytes.unshift(Number(num & BigInt(255)));
        num = num >> BigInt(8);
      }
      
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch (error) {
      throw new Error('Base62解碼失敗: ' + (error as Error).message);
    }
  };

  const numberToBase62 = (num: number): string => {
    if (num === 0) return '0';
    if (num < 0) throw new Error('不支援負數');
    
    let result = '';
    let n = Math.floor(num);
    
    while (n > 0) {
      result = BASE62_CHARS[n % 62] + result;
      n = Math.floor(n / 62);
    }
    
    return result;
  };

  const base62ToNumber = (str: string): number => {
    let result = 0;
    
    for (const char of str) {
      const index = BASE62_CHARS.indexOf(char);
      if (index === -1) {
        throw new Error(`無效的Base62字符: ${char}`);
      }
      result = result * 62 + index;
    }
    
    return result;
  };

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        if (inputType === 'string') {
          setOutput(base62Encode(input));
        } else {
          const num = parseInt(input);
          if (isNaN(num)) {
            setOutput('錯誤: 請輸入有效數字');
            return;
          }
          setOutput(numberToBase62(num));
        }
      } else {
        if (inputType === 'string') {
          setOutput(base62Decode(input));
        } else {
          const result = base62ToNumber(input);
          setOutput(result.toString());
        }
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
              <h1 className="text-3xl font-bold text-black mb-4">Base62編碼工具</h1>
              <p className="text-black">Base62編碼，支援整數與字串互轉</p>
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
                  <label className="text-sm font-medium text-black">輸入類型:</label>
                  <select
                    value={inputType}
                    onChange={(e) => setInputType(e.target.value as 'string' | 'number')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="string">字串</option>
                    <option value="number">數字</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? (inputType === 'string' ? '原文' : '數字') : 'Base62編碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' 
                      ? (inputType === 'string' ? '請輸入要編碼的文字...' : '請輸入要編碼的數字...')
                      : '請輸入要解碼的Base62文字...'
                    }
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? 'Base62編碼' : (inputType === 'string' ? '原文' : '數字')})
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

            {/* Character Set Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-black mb-2">Base62字符集</h3>
              <div className="font-mono text-sm text-gray-700 break-all">
                {BASE62_CHARS}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Base62:</strong> 使用62個字符（0-9, A-Z, a-z）的編碼系統。</p>
                <p><strong>應用場景:</strong> 常用於短網址生成、數據壓縮、ID編碼等。</p>
                <p><strong>字符集:</strong> 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz</p>
                <p><strong>功能特點:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>支援字串編碼/解碼：將任意文字轉換為Base62格式</li>
                  <li>支援數字編碼/解碼：將整數轉換為Base62表示法</li>
                  <li>編碼結果較Base64更短，且URL友好</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> Base62編碼特別適合需要人類可讀且不含特殊字符的場景。
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