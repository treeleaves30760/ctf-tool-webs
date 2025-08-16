'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TapCodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  // Polybius square for tap code (K/C combined)
  const tapCodeGrid = [
    ['A', 'B', 'C/K', 'D', 'E'],
    ['F', 'G', 'H', 'I', 'J'],
    ['L', 'M', 'N', 'O', 'P'],
    ['Q', 'R', 'S', 'T', 'U'],
    ['V', 'W', 'X', 'Y', 'Z']
  ];

  const charToTap: { [key: string]: string } = {};
  const tapToChar: { [key: string]: string } = {};

  // Build lookup tables
  for (let row = 0; row < tapCodeGrid.length; row++) {
    for (let col = 0; col < tapCodeGrid[row].length; col++) {
      const cell = tapCodeGrid[row][col];
      const tapCode = `${row + 1} ${col + 1}`;
      
      if (cell.includes('/')) {
        // Handle C/K combination
        const chars = cell.split('/');
        chars.forEach(char => {
          charToTap[char] = tapCode;
        });
        tapToChar[tapCode] = 'C'; // Default to C for decoding
      } else {
        charToTap[cell] = tapCode;
        tapToChar[tapCode] = cell;
      }
    }
  }

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const cleanInput = input.toUpperCase().replace(/[^A-Z]/g, '');
        const result = cleanInput.split('').map(char => {
          if (char === 'K') return charToTap['C']; // Map K to C position
          return charToTap[char] || '';
        }).filter(code => code !== '').join('  ');
        
        setOutput(result);
      } else {
        // Decode
        const codes = input.trim().split(/\s+/);
        let result = '';
        
        for (let i = 0; i < codes.length; i += 2) {
          if (i + 1 < codes.length) {
            const tapCode = `${codes[i]} ${codes[i + 1]}`;
            const char = tapToChar[tapCode];
            if (char) {
              result += char;
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
              <h1 className="text-3xl font-bold text-black mb-4">敲擊碼工具</h1>
              <p className="text-black">敲擊碼編碼和解碼，使用5×5波利比奧斯方格</p>
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
                    輸入 ({mode === 'encode' ? '英文字母' : '敲擊碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的英文字母...' : '請輸入要解碼的敲擊碼（如: 1 1  2 3）...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? '敲擊碼' : '英文字母'})
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

            {/* Tap Code Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">敲擊碼對照表</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50"></th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">1</th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">2</th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">3</th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">4</th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tapCodeGrid.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold">
                          {rowIndex + 1}
                        </td>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border border-gray-300 px-4 py-2 text-center">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>敲擊碼:</strong> 使用5×5網格來編碼字母，每個字母用兩個數字表示（行號 列號）。</p>
                <p><strong>特殊處理:</strong> C和K共用一個位置，通常用C來表示。</p>
                <p><strong>格式:</strong> 編碼時字母間用兩個空格分隔，解碼時輸入「行號 列號」的數字對。</p>
                <p><strong>歷史:</strong> 敲擊碼曾被監獄囚犯用來通過敲擊牆壁進行通信。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 只支援英文字母，其他字符會被自動過濾。
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