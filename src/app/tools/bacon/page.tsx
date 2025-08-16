'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BaconTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  // Bacon cipher mapping (I/J and U/V combined)
  const baconMapping: { [key: string]: string } = {
    'A': 'AAAAA', 'B': 'AAAAB', 'C': 'AAABA', 'D': 'AAABB', 'E': 'AABAA',
    'F': 'AABAB', 'G': 'AABBA', 'H': 'AABBB', 'I': 'ABAAA', 'J': 'ABAAA',
    'K': 'ABAAB', 'L': 'ABABA', 'M': 'ABABB', 'N': 'ABBAA', 'O': 'ABBAB',
    'P': 'ABBBA', 'Q': 'ABBBB', 'R': 'BAAAA', 'S': 'BAAAB', 'T': 'BAABA',
    'U': 'BAABB', 'V': 'BAABB', 'W': 'BABAA', 'X': 'BABAB', 'Y': 'BABBA', 'Z': 'BABBB'
  };

  const reverseBaconMapping: { [key: string]: string } = {};
  Object.entries(baconMapping).forEach(([letter, code]) => {
    if (!reverseBaconMapping[code]) {
      reverseBaconMapping[code] = letter;
    }
  });

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const cleanInput = input.toUpperCase().replace(/[^A-Z]/g, '');
        const result = cleanInput.split('').map(char => baconMapping[char] || '').join(' ');
        setOutput(result);
      } else {
        // Decode
        const codes = input.trim().split(/\s+/);
        let result = '';
        
        for (const code of codes) {
          if (code.length === 5 && /^[AB]+$/.test(code)) {
            const letter = reverseBaconMapping[code];
            if (letter) {
              result += letter;
            }
          }
        }
        
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
              <h1 className="text-3xl font-bold text-black mb-4">培根密碼工具</h1>
              <p className="text-black">培根密碼編碼解碼，使用5位二進制表示字母</p>
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
                    輸入 ({mode === 'encode' ? '英文字母' : '培根密碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的英文字母...' : '請輸入要解碼的培根密碼（如: AAAAA AAAAB）...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? '培根密碼' : '英文字母'})
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

            {/* Mapping Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">培根密碼對照表</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                {Object.entries(baconMapping).map(([letter, code]) => (
                  <div key={letter} className="flex justify-between p-2 border border-gray-200 rounded">
                    <span className="font-bold">{letter}:</span>
                    <span className="font-mono text-blue-600">{code}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>培根密碼:</strong> 由法蘭西斯·培根發明的編碼方法，使用5位二進制表示每個字母。</p>
                <p><strong>編碼規則:</strong> 每個字母對應一個5位的A/B組合，如A=AAAAA, B=AAAAB。</p>
                <p><strong>字母合併:</strong> I和J共用編碼，U和V共用編碼（24字母版本）。</p>
                <p><strong>變體:</strong> 可以用任何兩個不同符號代替A和B，如0/1、粗體/正常字體等。</p>
                <p><strong>隱寫術:</strong> 常用於隱寫術中，將密碼隱藏在看似正常的文本中。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 培根密碼是現代二進制編碼的早期形式。
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