'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AffineTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [keyA, setKeyA] = useState('5');
  const [keyB, setKeyB] = useState('8');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // 計算最大公約數
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // 計算模逆
  const modInverse = (a: number, m: number): number => {
    if (gcd(a, m) !== 1) return -1;
    
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) return x;
    }
    return -1;
  };

  const handleConvert = () => {
    try {
      const a = parseInt(keyA);
      const b = parseInt(keyB);
      
      if (isNaN(a) || isNaN(b)) {
        setOutput('錯誤: 密鑰必須是數字');
        return;
      }

      if (gcd(a, 26) !== 1) {
        setOutput('錯誤: 密鑰a必須與26互質');
        return;
      }

      let result = '';
      
      if (mode === 'encrypt') {
        for (let i = 0; i < input.length; i++) {
          const char = input[i];
          if (char >= 'A' && char <= 'Z') {
            const x = char.charCodeAt(0) - 'A'.charCodeAt(0);
            const encrypted = (a * x + b) % 26;
            result += String.fromCharCode(encrypted + 'A'.charCodeAt(0));
          } else if (char >= 'a' && char <= 'z') {
            const x = char.charCodeAt(0) - 'a'.charCodeAt(0);
            const encrypted = (a * x + b) % 26;
            result += String.fromCharCode(encrypted + 'a'.charCodeAt(0));
          } else {
            result += char;
          }
        }
      } else {
        const aInv = modInverse(a, 26);
        if (aInv === -1) {
          setOutput('錯誤: 無法計算密鑰a的模逆');
          return;
        }
        
        for (let i = 0; i < input.length; i++) {
          const char = input[i];
          if (char >= 'A' && char <= 'Z') {
            const y = char.charCodeAt(0) - 'A'.charCodeAt(0);
            let decrypted = (aInv * (y - b)) % 26;
            if (decrypted < 0) decrypted += 26;
            result += String.fromCharCode(decrypted + 'A'.charCodeAt(0));
          } else if (char >= 'a' && char <= 'z') {
            const y = char.charCodeAt(0) - 'a'.charCodeAt(0);
            let decrypted = (aInv * (y - b)) % 26;
            if (decrypted < 0) decrypted += 26;
            result += String.fromCharCode(decrypted + 'a'.charCodeAt(0));
          } else {
            result += char;
          }
        }
      }
      
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

  const generateRandomKeys = () => {
    // 選擇與26互質的數字作為a
    const coprimes = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    const randomA = coprimes[Math.floor(Math.random() * coprimes.length)];
    const randomB = Math.floor(Math.random() * 26);
    
    setKeyA(randomA.toString());
    setKeyB(randomB.toString());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">仿射密碼工具</h1>
              <p className="text-black">使用線性函數 E(x) = (ax + b) mod 26 進行加密</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                  <label className="text-sm font-medium text-black">密鑰a:</label>
                  <input
                    type="number"
                    value={keyA}
                    onChange={(e) => setKeyA(e.target.value)}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500 w-20"
                    min="1"
                    max="25"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">密鑰b:</label>
                  <input
                    type="number"
                    value={keyB}
                    onChange={(e) => setKeyB(e.target.value)}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500 w-20"
                    min="0"
                    max="25"
                  />
                </div>

                <button
                  onClick={generateRandomKeys}
                  className="bg-teal-600 text-white px-4 py-1 rounded-md hover:bg-teal-700 transition-colors text-sm"
                >
                  隨機密鑰
                </button>
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
                    placeholder={mode === 'encrypt' ? '請輸入要加密的英文文字...' : '請輸入要解密的密文...'}
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
                <p><strong>仿射密碼:</strong> 一種單字母替換密碼，使用數學函數進行加密。</p>
                <p><strong>加密公式:</strong> E(x) = (ax + b) mod 26</p>
                <p><strong>解密公式:</strong> D(y) = a⁻¹(y - b) mod 26</p>
                <p><strong>密鑰要求:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>密鑰a:</strong> 必須與26互質 (可用值: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25)</li>
                  <li><strong>密鑰b:</strong> 可以是0-25之間的任意整數</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 僅處理英文字母，其他字符保持不變。大小寫會被保留。
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