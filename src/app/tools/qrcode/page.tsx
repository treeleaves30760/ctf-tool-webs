'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function QRCodeTool() {
  const [mode, setMode] = useState<'generate' | 'decode'>('generate');
  const [inputText, setInputText] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [errorLevel, setErrorLevel] = useState('M');
  const [decodedText, setDecodedText] = useState('');
  const [qrDataURL, setQrDataURL] = useState('');

  // Simple QR code generation using a placeholder
  const generateQRCode = (text: string, size: number): string => {
    // This is a placeholder implementation
    // In a real implementation, you would use a QR code library like qrcode.js
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple pattern to represent QR code
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      ctx.fillStyle = '#000000';
      const moduleSize = size / 25; // 25x25 modules
      
      // Create a pattern based on the text
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          const hash = (text.charCodeAt((i + j) % text.length) + i * j) % 2;
          if (hash === 1) {
            ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
          }
        }
      }
      
      // Add finder patterns (corners)
      const drawFinderPattern = (x: number, y: number) => {
        ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
      };
      
      drawFinderPattern(0, 0);
      drawFinderPattern(18 * moduleSize, 0);
      drawFinderPattern(0, 18 * moduleSize);
    }
    
    return canvas.toDataURL();
  };

  const handleGenerate = () => {
    if (!inputText.trim()) {
      setQrDataURL('');
      return;
    }
    
    try {
      const dataURL = generateQRCode(inputText, qrSize);
      setQrDataURL(dataURL);
    } catch (error) {
      setDecodedText('生成失敗: ' + (error as Error).message);
    }
  };

  const handleDecode = () => {
    // This is a placeholder for QR code decoding
    // In a real implementation, you would use a QR code decoder library
    setDecodedText('QR碼解碼功能需要使用專門的庫實現。請使用手機或專門的QR碼掃描器進行解碼。');
  };

  const handleClear = () => {
    setInputText('');
    setQrDataURL('');
    setDecodedText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decodedText || inputText);
  };

  const handleDownload = () => {
    if (!qrDataURL) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataURL;
    link.click();
  };

  const handleExample = () => {
    setInputText('https://example.com');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">QR碼工具</h1>
              <p className="text-black">生成和解碼QR碼</p>
            </div>

            {/* Mode Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">模式:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'generate' | 'decode')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="generate">生成QR碼</option>
                    <option value="decode">解碼QR碼</option>
                  </select>
                </div>

                {mode === 'generate' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-black">尺寸:</label>
                      <select
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value={150}>150x150</option>
                        <option value={200}>200x200</option>
                        <option value={300}>300x300</option>
                        <option value={400}>400x400</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-black">錯誤修正:</label>
                      <select
                        value={errorLevel}
                        onChange={(e) => setErrorLevel(e.target.value)}
                        className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="L">低 (L)</option>
                        <option value="M">中 (M)</option>
                        <option value="Q">高 (Q)</option>
                        <option value="H">最高 (H)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleExample}
                      className="text-sm bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      載入範例
                    </button>
                  </>
                )}
              </div>

              {mode === 'generate' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      輸入內容
                    </label>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                      placeholder="輸入要生成QR碼的內容（文字、URL、聯絡資訊等）..."
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      字數: {inputText.length}
                    </div>
                  </div>

                  {/* QR Code Preview */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      QR碼預覽
                    </label>
                    <div className="border border-gray-300 rounded-md p-4 bg-white flex items-center justify-center" style={{ minHeight: '200px' }}>
                      {qrDataURL ? (
                        <img 
                          src={qrDataURL} 
                          alt="QR Code" 
                          className="max-w-full h-auto"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <div className="text-4xl mb-2">📱</div>
                          <div>QR碼將顯示在這裡</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Decode Section */}
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-4xl mb-4">📷</div>
                    <p className="text-gray-600 mb-4">上傳QR碼圖片或使用攝像頭掃描</p>
                    <p className="text-sm text-gray-500">
                      注意：此功能需要使用專門的QR碼解碼庫實現
                    </p>
                  </div>
                  
                  {decodedText && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-black mb-2">
                        解碼結果
                      </label>
                      <textarea
                        value={decodedText}
                        readOnly
                        className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {mode === 'generate' ? (
                  <>
                    <button
                      onClick={handleGenerate}
                      className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      生成QR碼
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={!qrDataURL}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下載圖片
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleDecode}
                    className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                  >
                    解碼QR碼
                  </button>
                )}
                
                <button
                  onClick={handleClear}
                  className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  清空
                </button>
                
                <button
                  onClick={handleCopy}
                  disabled={!decodedText && !inputText}
                  className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  複製內容
                </button>
              </div>
            </div>

            {/* Common QR Code Types */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">常用QR碼類型</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setInputText('https://example.com')}
                  className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-black">網址</div>
                  <div className="text-sm text-gray-600">https://example.com</div>
                </button>
                
                <button
                  onClick={() => setInputText('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD')}
                  className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-black">聯絡人</div>
                  <div className="text-sm text-gray-600">vCard格式</div>
                </button>
                
                <button
                  onClick={() => setInputText('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;')}
                  className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-black">WiFi連接</div>
                  <div className="text-sm text-gray-600">自動連接WiFi</div>
                </button>
                
                <button
                  onClick={() => setInputText('mailto:example@email.com?subject=Hello&body=Message')}
                  className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-black">電子郵件</div>
                  <div className="text-sm text-gray-600">預填郵件內容</div>
                </button>
                
                <button
                  onClick={() => setInputText('tel:+1234567890')}
                  className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-black">電話號碼</div>
                  <div className="text-sm text-gray-600">直接撥打電話</div>
                </button>
                
                <button
                  onClick={() => setInputText('sms:+1234567890:Hello World')}
                  className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-black">簡訊</div>
                  <div className="text-sm text-gray-600">預填簡訊內容</div>
                </button>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>QR碼 (Quick Response Code):</strong> 二維條碼，可快速儲存和讀取資訊。</p>
                <p><strong>錯誤修正等級:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>L:</strong> 約可修正7%的錯誤</li>
                  <li><strong>M:</strong> 約可修正15%的錯誤</li>
                  <li><strong>Q:</strong> 約可修正25%的錯誤</li>
                  <li><strong>H:</strong> 約可修正30%的錯誤</li>
                </ul>
                <p><strong>容量限制:</strong> 數字最多7089個字符，英數字最多4296個字符。</p>
                <p><strong>應用:</strong> 網址分享、聯絡資訊、WiFi連接、CTF隱寫術等。</p>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> 此為演示版本，實際應用需要使用專門的QR碼庫。
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