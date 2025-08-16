'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AtbashTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    try {
      const result = input.replace(/[a-zA-Z]/g, (char) => {
        if (char >= 'a' && char <= 'z') {
          return String.fromCharCode(219 - char.charCodeAt(0)); // 'a' + 'z' = 97 + 122 = 219
        } else {
          return String.fromCharCode(155 - char.charCodeAt(0)); // 'A' + 'Z' = 65 + 90 = 155
        }
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
              <h1 className="text-3xl font-bold text-black mb-4">阿特巴希密碼工具</h1>
              <p className="text-black">古老的希伯來字母替換密碼，A↔Z, B↔Y</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
                    placeholder="請輸入要轉換的文字..."
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

            {/* Mapping Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">字母對照表</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-black mb-2">大寫字母</h4>
                  <div className="grid grid-cols-13 gap-1 text-xs">
                    {'ABCDEFGHIJKLM'.split('').map((char, i) => (
                      <div key={i} className="text-center p-1 border border-gray-200">
                        <div className="font-bold">{char}</div>
                        <div>↓</div>
                        <div className="text-red-600">{String.fromCharCode(155 - char.charCodeAt(0))}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-13 gap-1 text-xs mt-1">
                    {'NOPQRSTUVWXYZ'.split('').map((char, i) => (
                      <div key={i} className="text-center p-1 border border-gray-200">
                        <div className="font-bold">{char}</div>
                        <div>↓</div>
                        <div className="text-red-600">{String.fromCharCode(155 - char.charCodeAt(0))}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-black mb-2">小寫字母</h4>
                  <div className="grid grid-cols-13 gap-1 text-xs">
                    {'abcdefghijklm'.split('').map((char, i) => (
                      <div key={i} className="text-center p-1 border border-gray-200">
                        <div className="font-bold">{char}</div>
                        <div>↓</div>
                        <div className="text-red-600">{String.fromCharCode(219 - char.charCodeAt(0))}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-13 gap-1 text-xs mt-1">
                    {'nopqrstuvwxyz'.split('').map((char, i) => (
                      <div key={i} className="text-center p-1 border border-gray-200">
                        <div className="font-bold">{char}</div>
                        <div>↓</div>
                        <div className="text-red-600">{String.fromCharCode(219 - char.charCodeAt(0))}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>阿特巴希密碼:</strong> 來自古代希伯來文的替換密碼，將字母順序顛倒。</p>
                <p><strong>轉換規則:</strong> A↔Z, B↔Y, C↔X ... 每個字母對應字母表中相反位置的字母。</p>
                <p><strong>對稱性:</strong> 加密和解密是同一個操作，轉換兩次回到原文。</p>
                <p><strong>保留:</strong> 數字、標點符號和空格保持不變，只轉換英文字母。</p>
                <p><strong>歷史:</strong> 在《聖經》和一些古代文獻中有使用記錄。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 這是最簡單的單字母替換密碼之一，破解難度很低。
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