'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Rot13Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rotValue, setRotValue] = useState(13);

  const handleConvert = () => {
    try {
      const result = input.replace(/[a-zA-Z]/g, (char) => {
        const start = char <= 'Z' ? 65 : 97;
        const rotated = ((char.charCodeAt(0) - start + rotValue) % 26 + 26) % 26;
        return String.fromCharCode(start + rotated);
      });
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

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">ROT13/ROTn密碼工具</h1>
              <p className="text-black">ROT13和可調整的ROT-n字母移位密碼</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">移位數值:</label>
                  <input
                    type="number"
                    value={rotValue}
                    onChange={(e) => setRotValue(parseInt(e.target.value) || 0)}
                    min="0"
                    max="25"
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500 w-20"
                  />
                </div>
                <button
                  onClick={() => setRotValue(13)}
                  className="bg-gray-100 text-black px-3 py-1 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  設為ROT13
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入文字
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="請輸入要加密或解密的文字..."
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
                  轉換
                </button>
                <button
                  onClick={handleSwap}
                  disabled={!output}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  交換輸入輸出
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
                <p><strong>ROT13:</strong> 將每個字母向後移動13位的簡單替換密碼。</p>
                <p><strong>ROT-n:</strong> 可以自定義移位數值（0-25），ROT13是其中的特例。</p>
                <p><strong>特點:</strong> ROT13是對稱的，加密和解密是同一個操作。</p>
                <p><strong>保留:</strong> 數字、標點符號和空格保持不變，只轉換字母。</p>
                <p><strong>應用:</strong> 簡單的文字隱藏、論壇劇透保護、基礎密碼學教學等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> ROT13安全性很低，僅適用於簡單的文字混淆。
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