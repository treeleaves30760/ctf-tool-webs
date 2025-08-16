'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HashTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});

  // Simple hash implementations (for demonstration - in production use crypto libraries)
  const md5 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null);
    if (!hashBuffer) return 'MD5 not supported';
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const sha1 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const sha256 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const sha512 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Simple CRC32 implementation
  const crc32 = (str: string): string => {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i);
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
      }
    }
    return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  };

  const handleCalculate = async () => {
    if (!input) {
      setResults({});
      return;
    }

    try {
      const newResults: Record<string, string> = {};
      
      // Calculate different hashes
      newResults['CRC32'] = crc32(input);
      newResults['MD5'] = await md5(input);
      newResults['SHA-1'] = await sha1(input);
      newResults['SHA-256'] = await sha256(input);
      newResults['SHA-512'] = await sha512(input);
      
      // Base64 encode
      newResults['Base64'] = btoa(unescape(encodeURIComponent(input)));
      
      // URL encode
      newResults['URL'] = encodeURIComponent(input);
      
      // Hex encode
      newResults['Hex'] = Array.from(new TextEncoder().encode(input))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

      setResults(newResults);
    } catch (error) {
      console.error('計算雜湊值時出錯:', error);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleClear = () => {
    setInput('');
    setResults({});
  };

  const hashTypes = [
    { name: 'CRC32', description: '32位循環冗餘校驗', length: 8 },
    { name: 'MD5', description: '128位訊息摘要演算法', length: 32 },
    { name: 'SHA-1', description: '160位安全雜湊演算法', length: 40 },
    { name: 'SHA-256', description: '256位安全雜湊演算法', length: 64 },
    { name: 'SHA-512', description: '512位安全雜湊演算法', length: 128 },
    { name: 'Base64', description: 'Base64編碼', length: 0 },
    { name: 'URL', description: 'URL編碼', length: 0 },
    { name: 'Hex', description: '十六進位編碼', length: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">雜湊計算工具</h1>
              <p className="text-gray-600">支援多種雜湊演算法和編碼方式</p>
            </div>

            {/* Input */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                輸入文字
              </label>
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (e.target.value) {
                    handleCalculate();
                  } else {
                    setResults({});
                  }
                }}
                className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                placeholder="請輸入要計算雜湊值的文字..."
              />
              
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={handleCalculate}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  計算雜湊
                </button>
                <button
                  onClick={handleClear}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>

            {/* Results */}
            {Object.keys(results).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">計算結果</h3>
                <div className="space-y-4">
                  {hashTypes.map((hashType) => {
                    const value = results[hashType.name];
                    if (!value) return null;

                    return (
                      <div key={hashType.name} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{hashType.name}</h4>
                            <p className="text-sm text-gray-600">{hashType.description}</p>
                            {hashType.length > 0 && (
                              <p className="text-xs text-gray-500">長度: {hashType.length} 字元</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleCopy(value)}
                            className="text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            複製
                          </button>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <code className="text-sm font-mono break-all">{value}</code>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">雜湊演算法說明</h3>
              <div className="text-blue-800 space-y-3">
                <div>
                  <p><strong>雜湊函數特點:</strong></p>
                  <ul className="list-disc ml-6 mt-1 space-y-1">
                    <li>單向性：從輸出無法推導出輸入</li>
                    <li>確定性：相同輸入總是產生相同輸出</li>
                    <li>雪崩效應：輸入的微小變化會導致輸出的巨大變化</li>
                    <li>抗碰撞性：很難找到兩個產生相同輸出的不同輸入</li>
                  </ul>
                </div>
                
                <div>
                  <p><strong>常見用途:</strong></p>
                  <ul className="list-disc ml-6 mt-1 space-y-1">
                    <li>密碼儲存（加鹽雜湊）</li>
                    <li>數位簽章和憑證</li>
                    <li>檔案完整性驗證</li>
                    <li>區塊鏈和加密貨幣</li>
                  </ul>
                </div>

                <div className="bg-blue-100 p-3 rounded mt-3">
                  <p className="text-sm"><strong>安全提示:</strong> MD5和SHA-1已不被認為是安全的雜湊演算法，建議使用SHA-256或更強的演算法。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}