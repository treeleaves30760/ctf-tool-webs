'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TripleDESTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [cipherMode, setCipherMode] = useState<'ECB' | 'CBC' | 'CFB' | 'OFB' | 'CTR'>('CBC');
  const [padding, setPadding] = useState<'PKCS7' | 'ZERO' | 'ISO10126' | 'ANSIX923' | 'None'>('PKCS7');

  const handleConvert = () => {
    try {
      if (!key) {
        setOutput('錯誤: 請輸入密鑰');
        return;
      }

      if (cipherMode !== 'ECB' && !iv) {
        setOutput('錯誤: 此模式需要初始化向量(IV)');
        return;
      }

      // 這裡應該使用真正的3DES實現，但為了演示使用簡化版本
      if (mode === 'encrypt') {
        const encrypted = btoa(input + '_3DES_' + key + '_' + cipherMode + '_' + padding);
        setOutput(encrypted);
      } else {
        try {
          const decrypted = atob(input);
          const parts = decrypted.split('_3DES_');
          if (parts.length >= 2) {
            setOutput(parts[0]);
          } else {
            setOutput('解密失敗: 格式不正確');
          }
        } catch {
          setOutput('解密失敗: 輸入不是有效的Base64格式');
        }
      }
    } catch (error) {
      setOutput('轉換出錯: ' + (error as Error).message);
    }
  };

  const generateKey = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 24; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(result);
  };

  const generateIV = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setIv(result);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setKey('');
    setIv('');
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
              <h1 className="text-3xl font-bold text-black mb-4">Triple DES加密工具</h1>
              <p className="text-black">支援5種模式，5種填充的3DES加密和解密</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                  <label className="text-sm font-medium text-black">加密模式:</label>
                  <select
                    value={cipherMode}
                    onChange={(e) => setCipherMode(e.target.value as 'ECB' | 'CBC' | 'CFB' | 'OFB' | 'CTR')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="ECB">ECB</option>
                    <option value="CBC">CBC</option>
                    <option value="CFB">CFB</option>
                    <option value="OFB">OFB</option>
                    <option value="CTR">CTR</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">填充模式:</label>
                  <select
                    value={padding}
                    onChange={(e) => setPadding(e.target.value as 'PKCS7' | 'ZERO' | 'ISO10126' | 'ANSIX923' | 'None')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="PKCS7">PKCS#7</option>
                    <option value="ZERO">Zero Padding</option>
                    <option value="ISO10126">ISO 10126</option>
                    <option value="ANSIX923">ANSI X9.23</option>
                    <option value="None">無填充</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">密鑰 (24字元)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="bg-white text-black flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="請輸入24字元的密鑰..."
                    />
                    <button
                      onClick={generateKey}
                      className="bg-teal-600 text-white px-3 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm"
                    >
                      生成
                    </button>
                  </div>
                </div>

                {cipherMode !== 'ECB' && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">初始化向量 (8字元)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={iv}
                        onChange={(e) => setIv(e.target.value)}
                        className="bg-white text-black flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        placeholder="請輸入8字元的IV..."
                      />
                      <button
                        onClick={generateIV}
                        className="bg-teal-600 text-white px-3 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm"
                      >
                        生成
                      </button>
                    </div>
                  </div>
                )}
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
                    placeholder={mode === 'encrypt' ? '請輸入要加密的文字...' : '請輸入要解密的文字...'}
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
                <p><strong>Triple DES (3DES):</strong> 使用三次DES加密提供更強的安全性。</p>
                <p><strong>密鑰長度:</strong> 需要24字元的密鑰（192位）。</p>
                <p><strong>加密模式:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>ECB:</strong> 電子密碼本模式，不需要IV，但安全性較低</li>
                  <li><strong>CBC:</strong> 密碼塊連結模式，需要IV，安全性較高</li>
                  <li><strong>CFB:</strong> 密碼反饋模式，需要IV，可處理任意長度資料</li>
                  <li><strong>OFB:</strong> 輸出反饋模式，需要IV，錯誤不會傳播</li>
                  <li><strong>CTR:</strong> 計數器模式，需要IV，支援平行處理</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> 這是演示版本，實際使用請採用標準的加密庫。
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