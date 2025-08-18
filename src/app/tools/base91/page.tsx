'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Base91Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const BASE91_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';

  const base91Encode = (data: Uint8Array): string => {
    let ebq = 0;
    let en = 0;
    let output = '';
    
    for (let i = 0; i < data.length; i++) {
      ebq |= (data[i] & 255) << en;
      en += 8;
      if (en > 13) {
        let ev = ebq & 8191;
        if (ev > 88) {
          ebq >>= 13;
          en -= 13;
        } else {
          ev = ebq & 16383;
          ebq >>= 14;
          en -= 14;
        }
        output += BASE91_ALPHABET[ev % 91] + BASE91_ALPHABET[Math.floor(ev / 91)];
      }
    }
    
    if (en > 0) {
      output += BASE91_ALPHABET[ebq % 91];
      if (en > 7 || ebq > 90) {
        output += BASE91_ALPHABET[Math.floor(ebq / 91)];
      }
    }
    
    return output;
  };

  const base91Decode = (str: string): Uint8Array => {
    let dbq = 0;
    let dn = 0;
    let dv = -1;
    const output: number[] = [];
    
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      const p = BASE91_ALPHABET.indexOf(c);
      
      if (p === -1) continue;
      
      if (dv === -1) {
        dv = p;
        continue;
      }
      
      dv += p * 91;
      dbq |= (dv << dn);
      
      if (dv > 88) {
        dn += 13;
      } else {
        dn += 14;
      }
      
      dv = -1;
      
      while (dn > 7) {
        output.push(dbq & 255);
        dbq >>= 8;
        dn -= 8;
      }
    }
    
    if (dv !== -1) {
      output.push((dbq | dv << dn) & 255);
    }
    
    return new Uint8Array(output);
  };

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(input);
        setOutput(base91Encode(bytes));
      } else {
        const decoded = base91Decode(input);
        setOutput(new TextDecoder().decode(decoded));
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
              <h1 className="text-3xl font-bold text-black mb-4">Base91編碼工具</h1>
              <p className="text-black">Base91編碼，整數與字串互轉</p>
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
                    輸入 ({mode === 'encode' ? '原文' : 'Base91編碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的文字...' : '請輸入要解碼的Base91文字...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? 'Base91編碼' : '原文'})
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

            {/* Character Set */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-black mb-2">Base91字符集</h3>
              <div className="font-mono text-xs text-gray-700 break-all">
                {BASE91_ALPHABET}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Base91:</strong> 使用91個可列印字符的高效編碼方案。</p>
                <p><strong>編碼效率:</strong> 平均編碼效率約為88.8%，比Base64的75%更高效。</p>
                <p><strong>字符集:</strong> 包含大小寫字母、數字和大部分可列印符號。</p>
                <p><strong>應用場景:</strong> 資料壓縮、網路傳輸、檔案編碼等需要高效率的場景。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> Base91是最高效的Base編碼之一，適合對編碼長度要求較高的應用。
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