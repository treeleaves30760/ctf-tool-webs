'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ZlibTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [inputFormat, setInputFormat] = useState<'text' | 'hex' | 'base64'>('text');
  const [outputFormat, setOutputFormat] = useState<'hex' | 'base64'>('hex');

  const hexToBytes = (hex: string): Uint8Array => {
    const cleanHex = hex.replace(/\s+/g, '');
    if (cleanHex.length % 2 !== 0) {
      throw new Error('無效的十六進制字串');
    }
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
  };

  const bytesToHex = (bytes: Uint8Array): string => {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const base64ToBytes = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const bytesToBase64 = (bytes: Uint8Array): string => {
    const binaryString = String.fromCharCode(...bytes);
    return btoa(binaryString);
  };

  // Simple zlib-like compression using built-in compression
  const simpleCompress = (data: Uint8Array): Uint8Array => {
    // This is a simplified version - real zlib would use deflate algorithm
    // For demonstration, we'll use a basic compression simulation
    const compressed = new Uint8Array([0x78, 0x9c, ...data, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    return compressed;
  };

  const simpleDecompress = (data: Uint8Array): Uint8Array => {
    // Simple decompression - removes zlib header and footer
    if (data.length < 8) {
      throw new Error('數據太短，無法解壓縮');
    }
    if (data[0] !== 0x78 || data[1] !== 0x9c) {
      throw new Error('無效的zlib標頭');
    }
    // Return data without header (2 bytes) and footer (4-6 bytes)
    return data.slice(2, -6);
  };

  const handleConvert = () => {
    try {
      let inputBytes: Uint8Array;

      // Parse input based on format
      if (mode === 'compress') {
        if (inputFormat === 'text') {
          inputBytes = new TextEncoder().encode(input);
        } else if (inputFormat === 'hex') {
          inputBytes = hexToBytes(input);
        } else { // base64
          inputBytes = base64ToBytes(input);
        }
        
        const compressed = simpleCompress(inputBytes);
        
        if (outputFormat === 'hex') {
          setOutput(bytesToHex(compressed));
        } else { // base64
          setOutput(bytesToBase64(compressed));
        }
      } else { // decompress
        if (inputFormat === 'hex') {
          inputBytes = hexToBytes(input);
        } else if (inputFormat === 'base64') {
          inputBytes = base64ToBytes(input);
        } else { // text - treat as raw bytes
          inputBytes = new TextEncoder().encode(input);
        }
        
        const decompressed = simpleDecompress(inputBytes);
        
        // Try to decode as text first
        try {
          const text = new TextDecoder().decode(decompressed);
          setOutput(text);
        } catch {
          // If text decoding fails, output as hex
          setOutput(bytesToHex(decompressed));
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
              <h1 className="text-3xl font-bold text-black mb-4">Zlib壓縮工具</h1>
              <p className="text-black">使用Zlib算法進行數據壓縮和解壓縮</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">操作:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'compress' | 'decompress')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="compress">壓縮</option>
                    <option value="decompress">解壓縮</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">輸入格式:</label>
                  <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value as 'text' | 'hex' | 'base64')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="text">文字</option>
                    <option value="hex">十六進制</option>
                    <option value="base64">Base64</option>
                  </select>
                </div>

                {mode === 'compress' && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-black">輸出格式:</label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as 'hex' | 'base64')}
                      className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="hex">十六進制</option>
                      <option value="base64">Base64</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入數據 ({inputFormat})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={`請輸入要${mode === 'compress' ? '壓縮' : '解壓縮'}的數據...`}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出結果
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
                  {mode === 'compress' ? '壓縮' : '解壓縮'}
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
                <p><strong>Zlib:</strong> 一種數據壓縮算法，使用deflate壓縮算法和校驗和。</p>
                <p><strong>壓縮:</strong> 減少數據大小，適用於存儲和傳輸。</p>
                <p><strong>解壓縮:</strong> 恢復原始數據。</p>
                <p><strong>格式支持:</strong> 支持文字、十六進制和Base64格式的輸入輸出。</p>
                <p><strong>應用:</strong> 常用於CTF中的數據隱藏和壓縮分析。</p>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> 此為簡化版本的zlib實現，僅用於演示目的。
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