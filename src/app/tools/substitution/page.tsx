'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SubstitutionTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [keyType, setKeyType] = useState<'custom' | 'atbash' | 'rot13'>('custom');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const defaultSubstitution = 'ZYXWVUTSRQPONMLKJIHGFEDCBA'; // Atbash

  const generateAtbashKey = (): string => {
    return alphabet.split('').reverse().join('');
  };

  const generateROT13Key = (): string => {
    return alphabet.substring(13) + alphabet.substring(0, 13);
  };

  const generateRandomKey = (): string => {
    const chars = alphabet.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  };

  const getSubstitutionKey = (): string => {
    switch (keyType) {
      case 'atbash':
        return generateAtbashKey();
      case 'rot13':
        return generateROT13Key();
      case 'custom':
      default:
        return key || defaultSubstitution;
    }
  };

  const handleConvert = () => {
    try {
      const substitutionKey = getSubstitutionKey();
      
      if (substitutionKey.length !== 26) {
        setOutput('錯誤: 替換密鑰必須包含26個字母');
        return;
      }

      // 檢查是否包含所有字母
      const uniqueChars = new Set(substitutionKey.toUpperCase());
      if (uniqueChars.size !== 26) {
        setOutput('錯誤: 替換密鑰必須包含所有不重複的字母');
        return;
      }

      let result = '';
      const upperKey = substitutionKey.toUpperCase();
      
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const upperChar = char.toUpperCase();
        
        if (upperChar >= 'A' && upperChar <= 'Z') {
          const index = upperChar.charCodeAt(0) - 'A'.charCodeAt(0);
          
          if (mode === 'encrypt') {
            const newChar = upperKey[index];
            result += char === char.toLowerCase() ? newChar.toLowerCase() : newChar;
          } else {
            const keyIndex = upperKey.indexOf(upperChar);
            if (keyIndex !== -1) {
              const newChar = alphabet[keyIndex];
              result += char === char.toLowerCase() ? newChar.toLowerCase() : newChar;
            } else {
              result += char;
            }
          }
        } else {
          result += char;
        }
      }
      
      setOutput(result);
    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const handleKeyTypeChange = (newType: 'custom' | 'atbash' | 'rot13') => {
    setKeyType(newType);
    if (newType === 'atbash') {
      setKey(generateAtbashKey());
    } else if (newType === 'rot13') {
      setKey(generateROT13Key());
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    if (keyType === 'custom') {
      setKey('');
    }
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
              <h1 className="text-3xl font-bold text-black mb-4">簡單替換密碼工具</h1>
              <p className="text-black">自定義字母替換表進行加密解密</p>
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
                  <label className="text-sm font-medium text-black">密鑰類型:</label>
                  <select
                    value={keyType}
                    onChange={(e) => handleKeyTypeChange(e.target.value as 'custom' | 'atbash' | 'rot13')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="custom">自定義</option>
                    <option value="atbash">Atbash</option>
                    <option value="rot13">ROT13</option>
                  </select>
                </div>

                {keyType === 'custom' && (
                  <>
                    <button
                      onClick={() => setKey(generateRandomKey())}
                      className="bg-teal-600 text-white px-4 py-1 rounded-md hover:bg-teal-700 transition-colors text-sm"
                    >
                      随機密鑰
                    </button>
                    <button
                      onClick={() => setKey(defaultSubstitution)}
                      className="border border-gray-300 text-black px-4 py-1 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      預設密鑰
                    </button>
                  </>
                )}
              </div>

              {/* Key Display */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">
                  替換密鑰 ({keyType === 'atbash' ? 'Atbash 逆序' : keyType === 'rot13' ? 'ROT13 移位' : '自定義'})
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">原字母:</div>
                    <div className="font-mono text-sm bg-gray-50 p-2 rounded border">
                      {alphabet}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">替換為:</div>
                    {keyType === 'custom' ? (
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value.toUpperCase())}
                        className="bg-white text-black w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 font-mono"
                        placeholder="輸入26個不重複的字母"
                        maxLength={26}
                      />
                    ) : (
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded border">
                        {getSubstitutionKey()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encrypt' ? '明文' : '密文'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encrypt' ? '請輸入要加密的英文文字...' : '請輸入要解密的密文...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encrypt' ? '密文' : '明文'})
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
                <p><strong>簡單替換密碼:</strong> 將每個字母替換為其他字母的密碼。</p>
                <p><strong>密鑰類型:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>自定義:</strong> 手動輸入26個不重複的字母作為替換表</li>
                  <li><strong>Atbash:</strong> 將字母順序逆轉的古典密碼</li>
                  <li><strong>ROT13:</strong> 將每個字母向後移位13位的密碼</li>
                </ul>
                <p><strong>特點:</strong> 保持大小寫和非字母字符不變。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 簡單替換密碼容易被頻率分析攻擊，主要用於CTF和教學。
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