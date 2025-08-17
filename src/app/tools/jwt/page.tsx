'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function JWTTool() {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const base64UrlDecode = (str: string): string => {
    // Add padding if needed
    const padded = str + '='.repeat((4 - str.length % 4) % 4);
    // Replace URL-safe characters
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    try {
      return atob(base64);
    } catch {
      throw new Error('Invalid Base64 encoding');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      setHeader('');
      setPayload('');
      setSignature('');

      if (!input.trim()) {
        setError('請輸入JWT令牌');
        return;
      }

      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        setError('無效的JWT格式，應該包含三個部分（header.payload.signature）');
        return;
      }

      // Decode header
      try {
        const headerDecoded = base64UrlDecode(parts[0]);
        const headerJson = JSON.parse(headerDecoded);
        setHeader(JSON.stringify(headerJson, null, 2));
      } catch {
        setError('無法解碼Header部分');
        return;
      }

      // Decode payload
      try {
        const payloadDecoded = base64UrlDecode(parts[1]);
        const payloadJson = JSON.parse(payloadDecoded);
        setPayload(JSON.stringify(payloadJson, null, 2));
      } catch {
        setError('無法解碼Payload部分');
        return;
      }

      // Set signature (base64url encoded)
      setSignature(parts[2]);

    } catch (error) {
      setError('解碼出錯: ' + (error as Error).message);
    }
  };

  const handleClear = () => {
    setInput('');
    setHeader('');
    setPayload('');
    setSignature('');
    setError('');
  };

  const handleCopyHeader = () => {
    navigator.clipboard.writeText(header);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payload);
  };

  const handleCopySignature = () => {
    navigator.clipboard.writeText(signature);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">JWT解碼工具</h1>
              <p className="text-black">解析JSON Web Token的Header、Payload和Signature</p>
            </div>

            {/* Input */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  JWT令牌
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                  placeholder="請輸入JWT令牌 (格式: header.payload.signature)..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={handleDecode}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  解碼
                </button>
                <button
                  onClick={handleClear}
                  className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  清空
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Output */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-black">Header</h3>
                  <button
                    onClick={handleCopyHeader}
                    disabled={!header}
                    className="text-sm border border-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    複製
                  </button>
                </div>
                <textarea
                  value={header}
                  readOnly
                  className="bg-gray-50 text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Header將顯示在這裡..."
                />
              </div>

              {/* Payload */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-black">Payload</h3>
                  <button
                    onClick={handleCopyPayload}
                    disabled={!payload}
                    className="text-sm border border-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    複製
                  </button>
                </div>
                <textarea
                  value={payload}
                  readOnly
                  className="bg-gray-50 text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Payload將顯示在這裡..."
                />
              </div>

              {/* Signature */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-black">Signature</h3>
                  <button
                    onClick={handleCopySignature}
                    disabled={!signature}
                    className="text-sm border border-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    複製
                  </button>
                </div>
                <textarea
                  value={signature}
                  readOnly
                  className="bg-gray-50 text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Signature將顯示在這裡..."
                />
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>JWT (JSON Web Token):</strong> 一種用於在各方之間安全傳輸信息的開放標準。</p>
                <p><strong>結構:</strong> JWT由三個部分組成，用點號分隔：Header.Payload.Signature</p>
                <p><strong>Header:</strong> 包含令牌類型和簽名算法信息。</p>
                <p><strong>Payload:</strong> 包含聲明（claims），如用戶信息和過期時間。</p>
                <p><strong>Signature:</strong> 用於驗證令牌的簽名部分。</p>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> 此工具僅解碼JWT內容，不驗證簽名的有效性。
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