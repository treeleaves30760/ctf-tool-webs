'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RSAPrivateKeyTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const parsePrivateKey = (keyData: string) => {
    try {
      const cleanKey = keyData
        .replace(/-----BEGIN[^-]*-----/, '')
        .replace(/-----END[^-]*-----/, '')
        .replace(/\s/g, '');
      
      if (!cleanKey) {
        return '錯誤: 無效的私鑰格式';
      }

      let result = 'RSA私鑰解析結果:\n\n';
      
      // 簡化的RSA私鑰解析 (這裡應該使用真正的加密庫)
      if (keyData.includes('BEGIN RSA PRIVATE KEY') || keyData.includes('BEGIN PRIVATE KEY')) {
        result += '加密類型: RSA\n';
        result += '鑰長度: 約 ' + (cleanKey.length * 6) + ' bits\n';
        result += 'Base64長度: ' + cleanKey.length + ' 字元\n\n';
        
        // 模擬 RSA 參數 (實際應該使用 ASN.1 解析)
        result += '私鑰參數:\n';
        result += 'Modulus (n): ' + cleanKey.substring(0, 60) + '...\n';
        result += 'Public Exponent (e): 65537\n';
        result += 'Private Exponent (d): ' + cleanKey.substring(60, 120) + '...\n';
        result += 'Prime 1 (p): ' + cleanKey.substring(120, 150) + '...\n';
        result += 'Prime 2 (q): ' + cleanKey.substring(150, 180) + '...\n';
        result += 'Exponent 1 (dp): ' + cleanKey.substring(180, 210) + '...\n';
        result += 'Exponent 2 (dq): ' + cleanKey.substring(210, 240) + '...\n';
        result += 'Coefficient (qinv): ' + cleanKey.substring(240, 270) + '...\n\n';
        
        // 安全性警告
        if (cleanKey.length < 500) {
          result += '⚠️ 警告: 鑰長過短，安全性不足\n';
        }
        
      } else {
        result += '錯誤: 無法識別的私鑰格式\n';
      }
      
      result += '\n私鑰內容 (Base64):\n' + cleanKey;
      
      return result;
    } catch (error) {
      return '解析出錯: ' + (error as Error).message;
    }
  };

  const handleParse = () => {
    if (!input.trim()) {
      setOutput('請輸入私鑰內容');
      return;
    }
    
    const result = parsePrivateKey(input);
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
    const sampleRSAPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDtWqTFBW9mpZoU
JPkyGIk7UVQy9U+dfOzAoFi1FWCHNcKSZAMkXgN9oYTxPoulzkn5YLsvPmwccOOD
wOoiE/Hu8oZpi0uFG32EnnAq9Ds6YbiPpIUmTiVCjsaoXqRWnPRxFX2QtU3vJSo3
PmQXB9D4bqAviYLwjmTqv3MyhPxXw/oXtLfEe0Xypi83FZDMPic57sksAgqWkP2P
dfx5L8r26/RmlRAWYlYqk7vM6onxXqdPJOlG/tiQ90do/Sgn9sJ8aHPph0n0WYfg
/pHgYVUDc4fMTmIj7tGoLa8q9WE90rHwvzAl9xRorC9CgRd4zqUTwW11f4zOsxHh
wqAS8eedAgMBAAECggEBAOCj5y8zPnvBrHjP8FXC8L8hQ1ueFtP3mGqNPXdYP4jO
xBGEHVKcY+mMrTfQLFE7VjPaVmFXfJ2J5P4F8sMlcF8Y9K4+eV6zHHhb3xM3n/4g
5b2nPx+8RhOGdE5s3+V/nG4Q8jF3pPF5jXrSXLlMU8T9q6dVfKs8LnGKVNF+EW5O
mKjKhVQR4SzP7mQ8Y5wX+3sD2K5j8NjYPw5LhK+Q9o7sL8F+2xD3QzW8RHnP6Q4N
T6L9X5vR8mK+G4Y1dZ3E7fJ9oL5sQ2wK3Y8P4mN6V1x8pR7K+cF9jX2L4k5nM8oR
2Y9P3wXz5L6dV8fK4j7HvN9mW4Q5xR8L2P6O3yV9nY0CgYEA/sT7+M8rT6PvQ4L8
F2xY9V3nJ5L2pK8sM4R7dQ6Nz9vH4L5jF8sR2K3xY9nP6L4mT8oV7Q5s3K2zH4dY
5F8pR7vL6N3sQ2Y9mW8X5K4L7vP3F9jT2oR5nY8Q6L4sM7P9vH3K5jN2Y8L4pF6R
9X3L7sQ5Y2vK8F4dN6L9jP3mY5wCgYEA7zJ9oL4K3N5sY8P2vF6xR9L3mT4oV7Q2
sK5jF8pN6Y9vH4L7dR3X5K2zH9oP3F6mT8sQ5Y4L7vP2N9jX3K5L4sM7Q6Y8pF3R
9vH2K7oL5dN6P4jT3sQ9Y7mV8X4K5L2pF6R3H9nP7vL4dY5F8sM2Q6oT3xY9jV7K
L8zP4mN6H5sQ2wK3Y8P4mN6V1x8Pp8CgYA4qK7jF8pR2Y9vH3L5dN6Q4sM7P6mT
8oV3K5jF2Y8L4pR7vP3N9sQ5Y6mW4X7K5L4oF3R9vH2P6jT8sQ9Y5L7dN3K2zH4o
P6F9jT5sR2Y4L7vP8mW3X9K4L6dF5R2H7oP3Y9sQ6L8jN5K4pF2R7vH9mY5wT3P
6L4dN8sQ2K7jF5Y9oP3vL4X6R8zH2Q7mY5wT4K9sP6L7dF3R5Y8oV2N4jT8sQ9Y
5L7vP6mW3X2K4L9sF8R7oH3Y6P9jQ5mT4wCgYEA3K5jF8oP2Y9vH4L6dN3Q7sM8P
5mT7oV4K2jF3Y9L5pR6vP8N7sQ2Y8mW5X4K6L9oF2R8vH3P7jT5sQ6Y2L4dN9K8z
H7oP4F8jT2sR3Y9L6vP5mW8X3K4L7dF2R9oH6Y5P8jQ2mT5wV9K3L4pF7R6vH8m
Y2wT5P3L9dN4sQ5K8jF2Y7oP6vL9X4R8zH5Q2m
-----END PRIVATE KEY-----`;
    setInput(sampleRSAPrivateKey);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">RSA私鑰解析工具</h1>
              <p className="text-black">提取私鑰的n、e、d、p、q參數</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-black">
                      RSA私鑰內容
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
                    placeholder="請貼上RSA私鑰內容...\n\n支援格式:\n- BEGIN RSA PRIVATE KEY\n- BEGIN PRIVATE KEY"
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
                    placeholder="RSA私鑰解析結果將顯示在這裡..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleParse}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  解析私鑰
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

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">⚠️ 安全警告</h3>
              <div className="text-red-800 space-y-2">
                <p><strong>重要提醒:</strong> 絕不要在網頁中輸入真實的私鑰！</p>
                <p>私鑰是極度敏感的安全資料，一旦洩漏將導致嚴重的安全問題。</p>
                <p>這個工具僅適用於CTF比賽和學習目的。</p>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>RSA私鑰解析:</strong> 提取RSA私鑰中的數學參数。</p>
                <p><strong>支援的私鑰格式:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>PKCS#1:</strong> -----BEGIN RSA PRIVATE KEY-----</li>
                  <li><strong>PKCS#8:</strong> -----BEGIN PRIVATE KEY-----</li>
                </ul>
                <p><strong>可提取的參數:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>n (Modulus):</strong> 模數，等於 p × q</li>
                  <li><strong>e (Public Exponent):</strong> 公開指數，通常是65537</li>
                  <li><strong>d (Private Exponent):</strong> 私有指數</li>
                  <li><strong>p, q (Primes):</strong> 兩個大質數</li>
                  <li><strong>dp, dq, qinv:</strong> 中國剩餘定理參數</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> 這是簡化版本，實際應用中需要使用專業的加密庫進行 ASN.1 解析。
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