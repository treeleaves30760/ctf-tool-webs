/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VigenereTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const vigenereEncrypt = (text: string, key: string): string => {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (cleanKey.length === 0) throw new Error('密鑰不能為空');
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[A-Za-z]/.test(char)) {
        const isUpper = char === char.toUpperCase();
        const charCode = char.toUpperCase().charCodeAt(0) - 65;
        const keyCode = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
        const encryptedCode = (charCode + keyCode) % 26;
        const encryptedChar = String.fromCharCode(encryptedCode + 65);
        result += isUpper ? encryptedChar : encryptedChar.toLowerCase();
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  };

  const vigenereDecrypt = (text: string, key: string): string => {
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (cleanKey.length === 0) throw new Error('密鑰不能為空');
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[A-Za-z]/.test(char)) {
        const isUpper = char === char.toUpperCase();
        const charCode = char.toUpperCase().charCodeAt(0) - 65;
        const keyCode = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
        const decryptedCode = (charCode - keyCode + 26) % 26;
        const decryptedChar = String.fromCharCode(decryptedCode + 65);
        result += isUpper ? decryptedChar : decryptedChar.toLowerCase();
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  };

  const handleConvert = () => {
    try {
      if (!key.trim()) {
        setOutput('錯誤: 請輸入密鑰');
        return;
      }

      const result = mode === 'encrypt' 
        ? vigenereEncrypt(input, key)
        : vigenereDecrypt(input, key);
      
      setOutput(result);
    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setKey('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">維吉尼亞密碼工具</h1>
              <p className="text-black">多字母替換密碼，使用關鍵字進行加密解密</p>
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
              </div>

              {/* Key input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">
                  密鑰 (Key)
                </label>
                <input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="請輸入密鑰（只能包含字母）..."
                />
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
                  onClick={handleSwap}
                  disabled={!output}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  交換加密/解密
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
                <p><strong>維吉尼亞密碼:</strong> 16世紀發明的多字母替換密碼，使用關鍵字重複加密。</p>
                <p><strong>加密原理:</strong> 根據密鑰字母的位置，對明文字母進行移位。</p>
                <p><strong>密鑰:</strong> 只能包含字母，會自動重複使用來匹配明文長度。</p>
                <p><strong>保留:</strong> 非字母字符（數字、標點、空格）保持不變。</p>
                <p><strong>歷史:</strong> 曾被稱為"無法破解的密碼"，直到19世紀才被破解。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 密鑰越長且越隨機，加密強度越高。
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