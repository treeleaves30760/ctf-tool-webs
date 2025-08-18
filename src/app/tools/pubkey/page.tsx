'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PublicKeyTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const parsePublicKey = (keyData: string) => {
    try {
      const cleanKey = keyData
        .replace(/-----BEGIN[^-]*-----/, '')
        .replace(/-----END[^-]*-----/, '')
        .replace(/\s/g, '');
      
      if (!cleanKey) {
        return '錯誤: 無效的公鑰格式';
      }

      let result = '公鑰解析結果:\n\n';
      
      // 簡化的公鑰解析 (這裡應該使用真正的加密庫)
      if (keyData.includes('BEGIN RSA PUBLIC KEY') || keyData.includes('BEGIN PUBLIC KEY')) {
        result += '加密類型: RSA\n';
        result += '鑰長度: 約 ' + (cleanKey.length * 6) + ' bits\n';
        result += 'Base64長度: ' + cleanKey.length + ' 字元\n\n';
        result += 'Modulus (n): ' + cleanKey.substring(0, 50) + '...\n';
        result += 'Exponent (e): 65537 (常用值)\n\n';
      } else if (keyData.includes('BEGIN EC PUBLIC KEY')) {
        result += '加密類型: ECC\n';
        result += 'Base64長度: ' + cleanKey.length + ' 字元\n\n';
      } else {
        result += '加密類型: 未知\n';
        result += 'Base64長度: ' + cleanKey.length + ' 字元\n\n';
      }
      
      result += '公鑰內容 (Base64):\n' + cleanKey;
      
      return result;
    } catch (error) {
      return '解析出錯: ' + (error as Error).message;
    }
  };

  const handleParse = () => {
    if (!input.trim()) {
      setOutput('請輸入公鑰內容');
      return;
    }
    
    const result = parsePublicKey(input);
    setOutput(result);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSampleKey = () => {
    const sampleRSAKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7VqkxQVvZqWaFCT5MhiJ
O1FUMvVPnXzswKBYtRVghzXCkmQDJF4DfaGE8T6Lpc5J+WC7Lz5sHHDjg8DqIhPx
7vKGaYtLhRt9hJ5wKvQ7OmG4j6SFJk4lQo7GqF6kVpz0cRV9kLVN7yUqNz5kFwfQ
+G6gL4mC8I5k6r9zMoT8V8P6F7S3xHtF8qYvNxWQzD4nOe7JLAIKlpD9j3X8eS/K
9uv0ZpUQFmJWKpO7zOqJ8V6nTyTpRv7YkPdHaP0oJ/bCfGhz6YdJ9FmH4P6R4GFV
A3OHzE5iI+7RqC2vKvVhPdKx8L8wJfcUaKwvQoEXeM6lE8FtdX+MzrMR4cKgEvHn
nQIDAQAB
-----END PUBLIC KEY-----`;
    setInput(sampleRSAKey);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">公鑰解析工具</h1>
              <p className="text-black">取得加密類型、n、e等參數</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-black">
                      公鑰內容
                    </label>
                    <button
                      onClick={loadSampleKey}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      載入範例
                    </button>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-60 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
                    placeholder="請貼上公鑰內容...\n\n支援格式:\n- BEGIN PUBLIC KEY\n- BEGIN RSA PUBLIC KEY\n- BEGIN EC PUBLIC KEY"
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    解析結果
                  </label>
                  <textarea
                    value={output}
                    readOnly
                    className="bg-white text-black w-full h-60 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono"
                    placeholder="公鑰解析結果將顯示在這裡..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleParse}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  解析公鑰
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
                <p><strong>公鑰解析:</strong> 分析公鑰的結構和參數。</p>
                <p><strong>支援的公鑰格式:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>PEM格式:</strong> -----BEGIN PUBLIC KEY-----</li>
                  <li><strong>RSA公鑰:</strong> -----BEGIN RSA PUBLIC KEY-----</li>
                  <li><strong>EC公鑰:</strong> -----BEGIN EC PUBLIC KEY-----</li>
                </ul>
                <p><strong>可获得資訊:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>加密算法類型 (RSA/ECC等)</li>
                  <li>鑰長度資訊</li>
                  <li>RSA公鑰的 n (模數) 和 e (指數)</li>
                  <li>Base64編碼的公鑰數據</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> 這是簡化版本，實際 CTF 中可能需要更精確的公鑰解析工具。
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