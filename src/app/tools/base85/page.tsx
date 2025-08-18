'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Base85Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [variant, setVariant] = useState<'ascii85' | 'z85'>('ascii85');

  // ASCII85 字符集 (Adobe版本)
  const ASCII85_CHARS = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstu';
  
  // Z85 字符集 (ZeroMQ版本)
  const Z85_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#';

  const base85Encode = (data: Uint8Array, useZ85: boolean): string => {
    const chars = useZ85 ? Z85_CHARS : ASCII85_CHARS;
    let result = '';
    let padding = 0;

    // 將資料補齊為4的倍數
    const paddedData = new Uint8Array(Math.ceil(data.length / 4) * 4);
    paddedData.set(data);
    padding = paddedData.length - data.length;

    for (let i = 0; i < paddedData.length; i += 4) {
      let value = 0;
      for (let j = 0; j < 4; j++) {
        value = value * 256 + paddedData[i + j];
      }

      if (!useZ85 && value === 0) {
        result += 'z';
      } else {
        const encoded = [];
        for (let k = 0; k < 5; k++) {
          encoded.unshift(chars[value % 85]);
          value = Math.floor(value / 85);
        }
        result += encoded.join('');
      }
    }

    // 移除因補齊而多出的字符
    if (padding > 0) {
      result = result.slice(0, result.length - padding);
    }

    // ASCII85 需要包裹標記
    if (!useZ85) {
      result = '<~' + result + '~>';
    }

    return result;
  };

  const base85Decode = (str: string, useZ85: boolean): Uint8Array => {
    const chars = useZ85 ? Z85_CHARS : ASCII85_CHARS;
    let data = str;

    if (!useZ85) {
      // 移除 ASCII85 的包裹標記
      if (data.startsWith('<~') && data.endsWith('~>')) {
        data = data.slice(2, -2);
      }
    }

    const result: number[] = [];
    let padding = 0;

    // 補齊為5的倍數
    if (data.length % 5 !== 0) {
      padding = 5 - (data.length % 5);
      data += 'u'.repeat(padding);
    }

    for (let i = 0; i < data.length; i += 5) {
      const chunk = data.slice(i, i + 5);
      
      if (!useZ85 && chunk === 'z    ') {
        result.push(0, 0, 0, 0);
        continue;
      }

      let value = 0;
      for (let j = 0; j < 5; j++) {
        const index = chars.indexOf(chunk[j]);
        if (index === -1) {
          throw new Error(`無效的Base85字符: ${chunk[j]}`);
        }
        value = value * 85 + index;
      }

      for (let k = 3; k >= 0; k--) {
        result.push((value >>> (k * 8)) & 0xFF);
      }
    }

    // 移除補齊的位元組
    if (padding > 0) {
      result.splice(result.length - padding);
    }

    return new Uint8Array(result);
  };

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(input);
        setOutput(base85Encode(bytes, variant === 'z85'));
      } else {
        const decoded = base85Decode(input, variant === 'z85');
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
              <h1 className="text-3xl font-bold text-black mb-4">Base85編碼工具</h1>
              <p className="text-black">Base85線上編碼、解碼，支援ASCII85和Z85格式</p>
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
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">變體:</label>
                  <select
                    value={variant}
                    onChange={(e) => setVariant(e.target.value as 'ascii85' | 'z85')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="ascii85">ASCII85</option>
                    <option value="z85">Z85</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '原文' : 'Base85編碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的文字...' : '請輸入要解碼的Base85文字...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? 'Base85編碼' : '原文'})
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

            {/* Character Sets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-black mb-2">ASCII85字符集</h3>
                <div className="font-mono text-xs text-gray-700 break-all">
                  {ASCII85_CHARS}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-black mb-2">Z85字符集</h3>
                <div className="font-mono text-xs text-gray-700 break-all">
                  {Z85_CHARS}
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Base85:</strong> 使用85個字符的編碼系統，比Base64更高效。</p>
                <p><strong>編碼效率:</strong> 每4個位元組編碼為5個字符，效率約80%。</p>
                <p><strong>變體說明:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>ASCII85:</strong> Adobe PDF和PostScript使用，包含 &lt;~ ~&gt; 包裹符號</li>
                  <li><strong>Z85:</strong> ZeroMQ使用，不含特殊包裹符號，更適合網路傳輸</li>
                </ul>
                <p><strong>應用場景:</strong> PDF文件、PostScript、網路協議、二進位資料編碼等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> Base85比Base64節省約20%的空間，適合對編碼長度敏感的應用。
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