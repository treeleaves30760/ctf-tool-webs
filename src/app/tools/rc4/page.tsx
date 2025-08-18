'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RC4Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputFormat, setInputFormat] = useState<'text' | 'hex'>('text');
  const [outputFormat, setOutputFormat] = useState<'hex' | 'base64'>('hex');

  const rc4 = (data: Uint8Array, key: string): Uint8Array => {
    const keyBytes = new TextEncoder().encode(key);
    const s = new Array(256);
    
    // 初始化 S 盒
    for (let i = 0; i < 256; i++) {
      s[i] = i;
    }
    
    // 鑰調度演算法
    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + s[i] + keyBytes[i % keyBytes.length]) % 256;
      [s[i], s[j]] = [s[j], s[i]];
    }
    
    // 偽隨機數生成演算法
    let i = 0;
    j = 0;
    const result = new Uint8Array(data.length);
    
    for (let k = 0; k < data.length; k++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      [s[i], s[j]] = [s[j], s[i]];
      const t = (s[i] + s[j]) % 256;
      result[k] = data[k] ^ s[t];
    }
    
    return result;
  };

  const hexToBytes = (hex: string): Uint8Array => {
    const bytes: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
  };

  const bytesToHex = (bytes: Uint8Array): string => {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  };

  const handleConvert = () => {
    try {
      if (!key) {
        setOutput('錯誤: 請輸入密鑰');
        return;
      }

      let inputData: Uint8Array;
      
      if (mode === 'encrypt') {
        if (inputFormat === 'text') {
          inputData = new TextEncoder().encode(input);
        } else {
          inputData = hexToBytes(input.replace(/\s/g, ''));
        }
      } else {
        if (outputFormat === 'hex') {
          inputData = hexToBytes(input.replace(/\s/g, ''));
        } else {
          inputData = new Uint8Array(Array.from(atob(input), c => c.charCodeAt(0)));
        }
      }

      const result = rc4(inputData, key);
      
      if (mode === 'encrypt') {
        if (outputFormat === 'hex') {
          setOutput(bytesToHex(result));
        } else {
          setOutput(btoa(String.fromCharCode(...result)));
        }
      } else {
        setOutput(new TextDecoder().decode(result));
      }
    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const generateKey = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(result);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setKey('');
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
              <h1 className="text-3xl font-bold text-black mb-4">RC4加密工具</h1>
              <p className="text-black">多種字元集、Base64輸出的RC4流密碼</p>
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
                  <label className="text-sm font-medium text-black">輸入格式:</label>
                  <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value as 'text' | 'hex')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                    disabled={mode === 'decrypt'}
                  >
                    <option value="text">文本</option>
                    <option value="hex">十六進制</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">輸出格式:</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as 'hex' | 'base64')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                    disabled={mode === 'decrypt'}
                  >
                    <option value="hex">十六進制</option>
                    <option value="base64">Base64</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={generateKey}
                    className="bg-teal-600 text-white px-4 py-1 rounded-md hover:bg-teal-700 transition-colors text-sm"
                  >
                    随機密鑰
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">密鑰</label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="請輸入RC4密鑰..."
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encrypt' ? (inputFormat === 'text' ? '文本' : '十六進制') : '加密數據'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
                    placeholder={mode === 'encrypt' 
                      ? (inputFormat === 'text' ? '請輸入要加密的文字...' : '請輸入十六進制數據...')
                      : '請輸入要解密的數據...'
                    }
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encrypt' ? (outputFormat === 'hex' ? '十六進制' : 'Base64') : '文本'})
                  </label>
                  <textarea
                    value={output}
                    readOnly
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono"
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
                <p><strong>RC4:</strong> 一種流密碼，使用可變長度密鑰（1-256位元組）。</p>
                <p><strong>算法特點:</strong> 加密和解密使用相同的過程，因為RC4是對稱密碼。</p>
                <p><strong>支援格式:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>輸入:</strong> 文本或十六進制</li>
                  <li><strong>輸出:</strong> 十六進制或Base64</li>
                </ul>
                <p><strong>應用場景:</strong> WEP無線網路、SSL/TLS早期版本、文檔加密等。</p>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> RC4已被發現存在安全性問題，不建議在生產環境中使用。
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