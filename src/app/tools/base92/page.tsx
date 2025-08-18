'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Base92Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const BASE92_CHARS = '!#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~';

  const base92Encode = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    let result = '';
    let accumulator = BigInt(0);
    let bitCount = 0;
    
    for (const byte of bytes) {
      accumulator = (accumulator << BigInt(8)) | BigInt(byte);
      bitCount += 8;
      
      while (bitCount >= 6) {
        const index = Number((accumulator >> BigInt(bitCount - 6)) & BigInt(63));
        if (index < 92) {
          result += BASE92_CHARS[index];
        }
        bitCount -= 6;
      }
    }
    
    if (bitCount > 0) {
      const index = Number((accumulator << BigInt(6 - bitCount)) & BigInt(63));
      if (index < 92) {
        result += BASE92_CHARS[index];
      }
    }
    
    return result;
  };

  const base92Decode = (str: string): string => {
    let accumulator = BigInt(0);
    let bitCount = 0;
    const result: number[] = [];
    
    for (const char of str) {
      const index = BASE92_CHARS.indexOf(char);
      if (index === -1) {
        throw new Error(`無效的Base92字符: ${char}`);
      }
      
      accumulator = (accumulator << BigInt(6)) | BigInt(index);
      bitCount += 6;
      
      while (bitCount >= 8) {
        const byte = Number((accumulator >> BigInt(bitCount - 8)) & BigInt(255));
        result.push(byte);
        bitCount -= 8;
      }
    }
    
    return new TextDecoder().decode(new Uint8Array(result));
  };

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        setOutput(base92Encode(input));
      } else {
        setOutput(base92Decode(input));
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
              <h1 className="text-3xl font-bold text-black mb-4">Base92編碼工具</h1>
              <p className="text-black">Base92線上編碼、解碼</p>
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '原文' : 'Base92編碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的文字...' : '請輸入要解碼的Base92文字...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? 'Base92編碼' : '原文'})
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

            {/* Character Set */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-black mb-2">Base92字符集</h3>
              <div className="font-mono text-xs text-gray-700 break-all">
                {BASE92_CHARS}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Base92:</strong> 使用92個可列印字符的編碼方案。</p>
                <p><strong>編碼效率:</strong> 每3個位元組約編碼為4個字符，效率約90%。</p>
                <p><strong>字符集:</strong> 排除了空格、引號、反斜線等特殊字符。</p>
                <p><strong>應用場景:</strong> 適合需要高效率且字符安全的編碼場景。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> Base92提供了較高的編碼效率，同時避免了可能引起問題的字符。
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