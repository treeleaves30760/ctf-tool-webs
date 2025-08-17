'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function XORTool() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [inputFormat, setInputFormat] = useState<'text' | 'hex'>('text');
  const [keyFormat, setKeyFormat] = useState<'text' | 'hex'>('text');
  const [outputFormat, setOutputFormat] = useState<'text' | 'hex'>('hex');

  const hexToBytes = (hex: string): number[] => {
    const cleanHex = hex.replace(/\s+/g, '');
    if (cleanHex.length % 2 !== 0) {
      throw new Error('無效的十六進制字串');
    }
    const bytes = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes.push(parseInt(cleanHex.substr(i, 2), 16));
    }
    return bytes;
  };

  const bytesToHex = (bytes: number[]): string => {
    return bytes.map(byte => byte.toString(16).padStart(2, '0')).join(' ');
  };

  const stringToBytes = (str: string): number[] => {
    return Array.from(new TextEncoder().encode(str));
  };

  const bytesToString = (bytes: number[]): string => {
    try {
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch {
      return bytesToHex(bytes);
    }
  };

  const xorOperation = (data: number[], keyBytes: number[]): number[] => {
    if (keyBytes.length === 0) {
      throw new Error('密鑰不能為空');
    }
    
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const keyByte = keyBytes[i % keyBytes.length];
      result.push(data[i] ^ keyByte);
    }
    return result;
  };

  const handleConvert = () => {
    try {
      if (!input.trim()) {
        setOutput('請輸入要加密的數據');
        return;
      }
      
      if (!key.trim()) {
        setOutput('請輸入密鑰');
        return;
      }

      // Parse input data
      let inputBytes: number[];
      if (inputFormat === 'text') {
        inputBytes = stringToBytes(input);
      } else {
        inputBytes = hexToBytes(input);
      }

      // Parse key
      let keyBytes: number[];
      if (keyFormat === 'text') {
        keyBytes = stringToBytes(key);
      } else {
        keyBytes = hexToBytes(key);
      }

      // Perform XOR operation
      const resultBytes = xorOperation(inputBytes, keyBytes);

      // Format output
      if (outputFormat === 'text') {
        setOutput(bytesToString(resultBytes));
      } else {
        setOutput(bytesToHex(resultBytes));
      }

    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const handleClear = () => {
    setInput('');
    setKey('');
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleBruteForce = () => {
    try {
      if (!input.trim()) {
        setOutput('請輸入要破解的數據');
        return;
      }

      let inputBytes: number[];
      if (inputFormat === 'text') {
        inputBytes = stringToBytes(input);
      } else {
        inputBytes = hexToBytes(input);
      }

      let results = [];
      
      // Try single byte keys (0-255)
      for (let keyByte = 0; keyByte <= 255; keyByte++) {
        const resultBytes = xorOperation(inputBytes, [keyByte]);
        const resultStr = bytesToString(resultBytes);
        
        // Check if result looks like readable text
        if (/^[a-zA-Z0-9\s.,!?'"()-]+$/.test(resultStr) && resultStr.length > 2) {
          results.push(`Key: ${keyByte} (0x${keyByte.toString(16).padStart(2, '0')}) -> "${resultStr}"`);
        }
      }

      if (results.length === 0) {
        setOutput('未找到有意義的明文結果');
      } else {
        setOutput(results.slice(0, 20).join('\n')); // Show top 20 results
      }

    } catch (error) {
      setOutput('暴力破解出錯: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">XOR密碼工具</h1>
              <p className="text-black">使用XOR運算進行加密解密，支持多種格式和暴力破解</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">輸入格式:</label>
                  <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value as 'text' | 'hex')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="text">文字</option>
                    <option value="hex">十六進制</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">密鑰格式:</label>
                  <select
                    value={keyFormat}
                    onChange={(e) => setKeyFormat(e.target.value as 'text' | 'hex')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="text">文字</option>
                    <option value="hex">十六進制</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">輸出格式:</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as 'text' | 'hex')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="text">文字</option>
                    <option value="hex">十六進制</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {/* Input Data */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入數據 ({inputFormat})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="請輸入要加密/解密的數據..."
                  />
                </div>

                {/* Key */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    密鑰 ({keyFormat})
                  </label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="請輸入密鑰..."
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出結果 ({outputFormat})
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
                  XOR加密/解密
                </button>
                <button
                  onClick={handleBruteForce}
                  className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  暴力破解
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
                <p><strong>XOR密碼:</strong> 使用異或運算的對稱加密算法，同樣的操作既可加密也可解密。</p>
                <p><strong>密鑰重複:</strong> 當數據長度超過密鑰長度時，密鑰會循環重複使用。</p>
                <p><strong>格式支持:</strong> 支持文字和十六進制格式的輸入輸出。</p>
                <p><strong>暴力破解:</strong> 嘗試所有可能的單字節密鑰（0-255），尋找有意義的明文。</p>
                <p><strong>應用:</strong> 常用於CTF比賽中的簡單加密挑戰。</p>
                <p className="text-sm mt-3">
                  <strong>範例:</strong> "Hello" XOR "A" → 十六進制: 09 04 0d 0d 0e
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