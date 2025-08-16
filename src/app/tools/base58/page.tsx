'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Base58Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  const base58Encode = (buffer: Uint8Array): string => {
    if (buffer.length === 0) return '';
    
    const digits = [0];
    for (let i = 0; i < buffer.length; i++) {
      let carry = buffer[i];
      for (let j = 0; j < digits.length; j++) {
        carry += digits[j] << 8;
        digits[j] = carry % 58;
        carry = Math.floor(carry / 58);
      }
      while (carry > 0) {
        digits.push(carry % 58);
        carry = Math.floor(carry / 58);
      }
    }
    
    let leadingZeros = 0;
    for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
      leadingZeros++;
    }
    
    return '1'.repeat(leadingZeros) + digits.reverse().map(d => BASE58_ALPHABET[d]).join('');
  };

  const base58Decode = (str: string): Uint8Array => {
    if (str.length === 0) return new Uint8Array(0);
    
    const bytes = [0];
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const index = BASE58_ALPHABET.indexOf(char);
      if (index === -1) throw new Error(`Invalid Base58 character: ${char}`);
      
      let carry = index;
      for (let j = 0; j < bytes.length; j++) {
        carry += bytes[j] * 58;
        bytes[j] = carry & 0xff;
        carry >>= 8;
      }
      while (carry > 0) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    }
    
    let leadingOnes = 0;
    for (let i = 0; i < str.length && str[i] === '1'; i++) {
      leadingOnes++;
    }
    
    return new Uint8Array([...Array(leadingOnes).fill(0), ...bytes.reverse()]);
  };

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const buffer = new TextEncoder().encode(input);
        const result = base58Encode(buffer);
        setOutput(result);
      } else {
        const buffer = base58Decode(input);
        const result = new TextDecoder().decode(buffer);
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
              <h1 className="text-3xl font-bold text-black mb-4">Base58編碼工具</h1>
              <p className="text-black">Base58編碼解碼，常用於比特幣地址和加密貨幣</p>
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
                    輸入 ({mode === 'encode' ? '原文' : 'Base58編碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的文字...' : '請輸入要解碼的Base58字符...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? 'Base58編碼' : '解碼結果'})
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
                <p><strong>Base58編碼:</strong> 使用58個字符的編碼系統，排除了容易混淆的字符。</p>
                <p><strong>字符集:</strong> 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz</p>
                <p><strong>排除字符:</strong> 0（零）、O（大寫o）、I（大寫i）、l（小寫L）</p>
                <p><strong>應用:</strong> 比特幣地址、加密貨幣錢包、區塊鏈技術等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> Base58避免了視覺上相似的字符，提高了手動輸入的準確性。
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