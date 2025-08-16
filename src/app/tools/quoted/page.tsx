'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function QuotedPrintableTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        setOutput(quotedPrintableEncode(input));
      } else {
        setOutput(quotedPrintableDecode(input));
      }
    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const quotedPrintableEncode = (str: string): string => {
    const encoded = new TextEncoder().encode(str);
    let result = '';
    let lineLength = 0;
    
    for (const byte of encoded) {
      if ((byte >= 33 && byte <= 60) || (byte >= 62 && byte <= 126)) {
        result += String.fromCharCode(byte);
        lineLength++;
      } else if (byte === 32) {
        result += ' ';
        lineLength++;
      } else {
        const hex = '=' + byte.toString(16).toUpperCase().padStart(2, '0');
        result += hex;
        lineLength += 3;
      }
      
      if (lineLength >= 76) {
        result += '=\r\n';
        lineLength = 0;
      }
    }
    
    return result;
  };

  const quotedPrintableDecode = (str: string): string => {
    str = str.replace(/=\r?\n/g, '');
    return str.replace(/=([0-9A-F]{2})/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
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
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">Quoted-printable編碼工具</h1>
              <p className="text-black">Quoted-printable編碼解碼工具</p>
            </div>

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
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '原文' : 'Quoted-printable編碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的文字...' : '請輸入Quoted-printable編碼...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? 'Quoted-printable編碼' : '解碼結果'})
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Quoted-printable:</strong> 一種編碼方式，用於電子郵件傳輸，將8位元字符轉換為7位元ASCII。</p>
                <p className="text-sm">
                  <strong>特點:</strong> 非ASCII字符會被編碼為=XX格式，其中XX是十六進制值。
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