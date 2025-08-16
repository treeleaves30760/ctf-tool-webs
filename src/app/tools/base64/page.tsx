'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encoding, setEncoding] = useState<'base64' | 'base32' | 'base16'>('base64');

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        if (encoding === 'base64') {
          setOutput(btoa(unescape(encodeURIComponent(input))));
        } else if (encoding === 'base32') {
          // Simple Base32 implementation
          setOutput(base32Encode(input));
        } else if (encoding === 'base16') {
          setOutput(Array.from(new TextEncoder().encode(input))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase());
        }
      } else {
        if (encoding === 'base64') {
          setOutput(decodeURIComponent(escape(atob(input))));
        } else if (encoding === 'base32') {
          setOutput(base32Decode(input));
        } else if (encoding === 'base16') {
          const bytes = input.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
          setOutput(new TextDecoder().decode(new Uint8Array(bytes)));
        }
      }
    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const base32Encode = (str: string): string => {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    let bits = 0;
    let value = 0;
    
    for (let i = 0; i < str.length; i++) {
      value = (value << 8) | str.charCodeAt(i);
      bits += 8;
      
      while (bits >= 5) {
        result += base32Chars[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    
    if (bits > 0) {
      result += base32Chars[(value << (5 - bits)) & 31];
    }
    
    while (result.length % 8 !== 0) {
      result += '=';
    }
    
    return result;
  };

  const base32Decode = (str: string): string => {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    str = str.replace(/=/g, '');
    let result = '';
    let bits = 0;
    let value = 0;
    
    for (let i = 0; i < str.length; i++) {
      const index = base32Chars.indexOf(str[i].toUpperCase());
      if (index === -1) throw new Error('Invalid Base32 character');
      
      value = (value << 5) | index;
      bits += 5;
      
      if (bits >= 8) {
        result += String.fromCharCode((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }
    
    return result;
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
              <h1 className="text-3xl font-bold text-black mb-4">Base編碼工具</h1>
              <p className="text-black">支援 Base64、Base32、Base16 編碼和解碼</p>
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
                  <label className="text-sm font-medium text-black">編碼類型:</label>
                  <select
                    value={encoding}
                    onChange={(e) => setEncoding(e.target.value as 'base64' | 'base32' | 'base16')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="base64">Base64</option>
                    <option value="base32">Base32</option>
                    <option value="base16">Base16 (Hex)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '原文' : '編碼文字'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的文字...' : '請輸入要解碼的文字...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? '編碼結果' : '解碼結果'})
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
                <p><strong>Base64:</strong> 最常用的編碼方式，將二進位資料編碼為ASCII字元。</p>
                <p><strong>Base32:</strong> 使用32個字元（A-Z, 2-7）的編碼方式，常用於檔案名稱等場景。</p>
                <p><strong>Base16 (Hex):</strong> 十六進位編碼，使用0-9和A-F字元。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 編碼用於將普通文字轉換為特定格式，解碼用於還原編碼後的文字。
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