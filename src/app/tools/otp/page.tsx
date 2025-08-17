'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OTPTool() {
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const generateRandomKey = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const otpEncrypt = (text: string, keyStr: string): string => {
    const normalizedText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const normalizedKey = keyStr.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (normalizedKey.length < normalizedText.length) {
      throw new Error('密鑰長度必須大於等於明文長度');
    }
    
    let result = '';
    for (let i = 0; i < normalizedText.length; i++) {
      const textChar = normalizedText.charCodeAt(i) - 65;
      const keyChar = normalizedKey.charCodeAt(i) - 65;
      const encryptedChar = (textChar + keyChar) % 26;
      result += String.fromCharCode(encryptedChar + 65);
    }
    
    return result;
  };

  const otpDecrypt = (cipher: string, keyStr: string): string => {
    const normalizedCipher = cipher.toUpperCase().replace(/[^A-Z]/g, '');
    const normalizedKey = keyStr.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (normalizedKey.length < normalizedCipher.length) {
      throw new Error('密鑰長度必須大於等於密文長度');
    }
    
    let result = '';
    for (let i = 0; i < normalizedCipher.length; i++) {
      const cipherChar = normalizedCipher.charCodeAt(i) - 65;
      const keyChar = normalizedKey.charCodeAt(i) - 65;
      const decryptedChar = (cipherChar - keyChar + 26) % 26;
      result += String.fromCharCode(decryptedChar + 65);
    }
    
    return result;
  };

  const handleConvert = () => {
    try {
      if (mode === 'encrypt') {
        if (!plaintext.trim()) {
          setCiphertext('請輸入明文');
          return;
        }
        if (!key.trim()) {
          setCiphertext('請輸入密鑰');
          return;
        }
        const result = otpEncrypt(plaintext, key);
        setCiphertext(result);
      } else {
        if (!ciphertext.trim()) {
          setPlaintext('請輸入密文');
          return;
        }
        if (!key.trim()) {
          setPlaintext('請輸入密鑰');
          return;
        }
        const result = otpDecrypt(ciphertext, key);
        setPlaintext(result);
      }
    } catch (error) {
      if (mode === 'encrypt') {
        setCiphertext('加密出錯: ' + (error as Error).message);
      } else {
        setPlaintext('解密出錯: ' + (error as Error).message);
      }
    }
  };

  const handleGenerateKey = () => {
    const textLength = mode === 'encrypt' 
      ? plaintext.replace(/[^A-Z]/gi, '').length 
      : ciphertext.replace(/[^A-Z]/gi, '').length;
    
    if (textLength === 0) {
      setKey('請先輸入文字');
      return;
    }
    
    const newKey = generateRandomKey(textLength);
    setKey(newKey);
  };

  const handleClear = () => {
    setPlaintext('');
    setKey('');
    setCiphertext('');
  };

  const handleCopy = () => {
    const textToCopy = mode === 'encrypt' ? ciphertext : plaintext;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">一次性密碼本工具</h1>
              <p className="text-black">理論上無法破解的完美加密算法</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
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
              </div>

              <div className="space-y-6">
                {/* Plaintext */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    明文
                  </label>
                  <textarea
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="請輸入明文（只保留英文字母）..."
                    readOnly={mode === 'decrypt'}
                  />
                </div>

                {/* Key */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-black">
                      密鑰
                    </label>
                    <button
                      onClick={handleGenerateKey}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      生成隨機密鑰
                    </button>
                  </div>
                  <textarea
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="請輸入密鑰（長度必須大於等於明文長度）..."
                  />
                </div>

                {/* Ciphertext */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    密文
                  </label>
                  <textarea
                    value={ciphertext}
                    onChange={(e) => setCiphertext(e.target.value)}
                    className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="密文將顯示在這裡..."
                    readOnly={mode === 'encrypt'}
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
                  disabled={mode === 'encrypt' ? !ciphertext : !plaintext}
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
                <p><strong>一次性密碼本 (One-Time Pad):</strong> 理論上無法破解的完美保密加密算法。</p>
                <p><strong>安全條件:</strong> 密鑰必須完全隨機、與明文等長、只使用一次。</p>
                <p><strong>加密過程:</strong> 明文字母與密鑰字母相加（模26）得到密文。</p>
                <p><strong>解密過程:</strong> 密文字母減去密鑰字母（模26）得到明文。</p>
                <p><strong>限制:</strong> 只處理英文字母，其他字符會被忽略。</p>
                <p className="text-sm mt-3">
                  <strong>範例:</strong> "HELLO" + "XMCKL" → "UQNVZ"
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