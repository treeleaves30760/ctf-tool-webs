/* eslint-disable prefer-const, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PlayfairTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [keyword, setKeyword] = useState('');

  const createPlayfairSquare = (key: string): string[][] => {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is omitted
    const used = new Set();
    const square: string[][] = [];
    let chars = '';

    // Add keyword characters (remove duplicates, convert I/J to I)
    for (const char of key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I')) {
      if (!used.has(char)) {
        used.add(char);
        chars += char;
      }
    }

    // Add remaining alphabet
    for (const char of alphabet) {
      if (!used.has(char)) {
        chars += char;
      }
    }

    // Create 5x5 square
    for (let i = 0; i < 5; i++) {
      square[i] = [];
      for (let j = 0; j < 5; j++) {
        square[i][j] = chars[i * 5 + j];
      }
    }

    return square;
  };

  const findPosition = (square: string[][], char: string): [number, number] => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (square[i][j] === char) {
          return [i, j];
        }
      }
    }
    return [0, 0];
  };

  const preparePlaintext = (text: string): string => {
    let prepared = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let result = '';
    
    for (let i = 0; i < prepared.length; i++) {
      result += prepared[i];
      if (i + 1 < prepared.length && prepared[i] === prepared[i + 1]) {
        result += 'X';
      }
    }
    
    if (result.length % 2 === 1) {
      result += 'X';
    }
    
    return result;
  };

  const playfairEncrypt = (text: string, key: string): string => {
    const square = createPlayfairSquare(key);
    const prepared = preparePlaintext(text);
    let result = '';

    for (let i = 0; i < prepared.length; i += 2) {
      const char1 = prepared[i];
      const char2 = prepared[i + 1];
      const [row1, col1] = findPosition(square, char1);
      const [row2, col2] = findPosition(square, char2);

      if (row1 === row2) {
        // Same row - move right
        result += square[row1][(col1 + 1) % 5];
        result += square[row2][(col2 + 1) % 5];
      } else if (col1 === col2) {
        // Same column - move down
        result += square[(row1 + 1) % 5][col1];
        result += square[(row2 + 1) % 5][col2];
      } else {
        // Rectangle - swap columns
        result += square[row1][col2];
        result += square[row2][col1];
      }
    }

    return result;
  };

  const playfairDecrypt = (text: string, key: string): string => {
    const square = createPlayfairSquare(key);
    const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';

    for (let i = 0; i < cleaned.length; i += 2) {
      const char1 = cleaned[i];
      const char2 = cleaned[i + 1] || 'X';
      const [row1, col1] = findPosition(square, char1);
      const [row2, col2] = findPosition(square, char2);

      if (row1 === row2) {
        // Same row - move left
        result += square[row1][(col1 + 4) % 5];
        result += square[row2][(col2 + 4) % 5];
      } else if (col1 === col2) {
        // Same column - move up
        result += square[(row1 + 4) % 5][col1];
        result += square[(row2 + 4) % 5][col2];
      } else {
        // Rectangle - swap columns
        result += square[row1][col2];
        result += square[row2][col1];
      }
    }

    return result;
  };

  const handleConvert = () => {
    try {
      if (!keyword.trim()) {
        setOutput('請輸入關鍵字');
        return;
      }

      if (mode === 'encrypt') {
        setOutput(playfairEncrypt(input, keyword));
      } else {
        setOutput(playfairDecrypt(input, keyword));
      }
    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setKeyword('');
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
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">普萊費爾密碼工具</h1>
              <p className="text-black">Playfair Cipher 加密解密工具</p>
            </div>

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
                  <label className="text-sm font-medium text-black">關鍵字:</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                    placeholder="輸入關鍵字..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>普萊費爾密碼:</strong> 使用5×5字母方陣的替換密碼，以字母對為加密單位。</p>
                <p><strong>特點:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>使用關鍵字生成5×5密碼方陣</li>
                  <li>字母J被替換為I</li>
                  <li>相同字母對會插入X分隔</li>
                  <li>明文長度不足時會補充X</li>
                </ul>
                <p className="text-sm">
                  <strong>範例:</strong> 關鍵字 "PLAYFAIR"，明文 "HELLO" → 密文根據方陣規則變換
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