'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [aesMode, setAesMode] = useState<'ECB' | 'CBC' | 'CFB' | 'OFB' | 'CTR'>('CBC');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');

  const handleConvert = () => {
    try {
      if (!key.trim()) {
        setOutput('錯誤: 請輸入密鑰');
        return;
      }

      if (aesMode !== 'ECB' && !iv.trim()) {
        setOutput('錯誤: 此模式需要初始化向量(IV)');
        return;
      }

      // Note: This is a placeholder implementation
      // Real AES encryption would require a proper cryptographic library like crypto-js
      if (mode === 'encrypt') {
        const fakeEncrypted = btoa(input + ':' + key + ':' + aesMode + ':' + Date.now());
        setOutput(`[模擬加密結果]\n${fakeEncrypted}\n\n注意: 這是模擬結果，實際使用需要安裝 crypto-js 等加密庫`);
      } else {
        try {
          const decoded = atob(input);
          if (decoded.includes(':')) {
            const parts = decoded.split(':');
            setOutput(`[模擬解密結果]\n${parts[0]}\n\n注意: 這是模擬結果，實際使用需要安裝 crypto-js 等加密庫`);
          } else {
            setOutput('解密失敗: 無效的密文格式');
          }
        } catch {
          setOutput('解密失敗: 無法解析密文');
        }
      }
    } catch (error) {
      setOutput('處理出錯: ' + (error as Error).message);
    }
  };

  const generateRandomKey = () => {
    const randomBytes = Array.from({length: 32}, () => Math.floor(Math.random() * 256));
    const hexKey = randomBytes.map(b => b.toString(16).padStart(2, '0')).join('');
    setKey(hexKey);
  };

  const generateRandomIV = () => {
    const randomBytes = Array.from({length: 16}, () => Math.floor(Math.random() * 256));
    const hexIV = randomBytes.map(b => b.toString(16).padStart(2, '0')).join('');
    setIv(hexIV);
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
              <h1 className="text-3xl font-bold text-black mb-4">AES加密工具</h1>
              <p className="text-black">進階加密標準（AES）加密解密，支援多種加密模式</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">操作:</label>
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
                    value={aesMode}
                    onChange={(e) => setAesMode(e.target.value as 'ECB' | 'CBC' | 'CFB' | 'OFB' | 'CTR')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="ECB">ECB</option>
                    <option value="CBC">CBC</option>
                    <option value="CFB">CFB</option>
                    <option value="OFB">OFB</option>
                    <option value="CTR">CTR</option>
                  </select>
                </div>
              </div>

              {/* Key and IV inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    密鑰 (Key) - 十六進位格式
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="bg-white text-black flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="輸入32字節的十六進位密鑰..."
                    />
                    <button
                      onClick={generateRandomKey}
                      className="bg-gray-100 text-black px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      隨機生成
                    </button>
                  </div>
                </div>

                {aesMode !== 'ECB' && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      初始化向量 (IV) - 十六進位格式
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={iv}
                        onChange={(e) => setIv(e.target.value)}
                        className="bg-white text-black flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        placeholder="輸入16字節的十六進位IV..."
                      />
                      <button
                        onClick={generateRandomIV}
                        className="bg-gray-100 text-black px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        隨機生成
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
                    placeholder={mode === 'encrypt' ? '請輸入要加密的明文...' : '請輸入要解密的密文...'}
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

            {/* Warning Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">重要提醒</h3>
              <div className="text-yellow-800 space-y-2">
                <p><strong>模擬版本:</strong> 這是AES加密工具的界面展示版本。</p>
                <p><strong>實際實現:</strong> 需要安裝 crypto-js 或其他加密庫才能進行真正的AES加密。</p>
                <p><strong>安裝方法:</strong> npm install crypto-js</p>
                <p><strong>安全提醒:</strong> 在生產環境中請使用經過驗證的加密庫。</p>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">AES加密模式說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>ECB:</strong> 電子密碼本模式，每個區塊獨立加密（不推薦用於敏感數據）。</p>
                <p><strong>CBC:</strong> 密碼區塊鏈結模式，需要IV，安全性較高。</p>
                <p><strong>CFB:</strong> 密碼反饋模式，將區塊密碼轉為串流密碼。</p>
                <p><strong>OFB:</strong> 輸出反饋模式，類似CFB但更安全。</p>
                <p><strong>CTR:</strong> 計數器模式，支援並行處理，效率高。</p>
                <p className="text-sm mt-3">
                  <strong>建議:</strong> 對於大多數應用，推薦使用CBC或CTR模式。
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