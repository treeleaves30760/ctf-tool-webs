'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EscapeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [escapeType, setEscapeType] = useState<'javascript' | 'json' | 'unicode' | 'hex'>('javascript');

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        if (escapeType === 'javascript') {
          // JavaScript escape
          const result = input.replace(/[\\"']/g, '\\$&')
                             .replace(/\u0000/g, '\\0')
                             .replace(/\u0008/g, '\\b')
                             .replace(/\u0009/g, '\\t')
                             .replace(/\u000A/g, '\\n')
                             .replace(/\u000C/g, '\\f')
                             .replace(/\u000D/g, '\\r')
                             .replace(/[\u0001-\u0007\u000B\u000E-\u001F\u007F-\u009F]/g, (char) => {
                               return '\\x' + char.charCodeAt(0).toString(16).padStart(2, '0');
                             });
          setOutput(result);
        } else if (escapeType === 'json') {
          // JSON escape
          setOutput(JSON.stringify(input).slice(1, -1));
        } else if (escapeType === 'unicode') {
          // Unicode escape
          setOutput(input.replace(/./g, (char) => {
            const code = char.charCodeAt(0);
            if (code > 127) {
              return '\\u' + code.toString(16).padStart(4, '0');
            }
            return char;
          }));
        } else {
          // Hex escape
          setOutput(input.replace(/./g, (char) => '\\x' + char.charCodeAt(0).toString(16).padStart(2, '0')));
        }
      } else {
        // Decode
        let result = input;
        
        // Decode all types of escapes
        result = result.replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
        
        result = result.replace(/\\u([0-9A-Fa-f]{4})/g, (match, unicode) => {
          return String.fromCharCode(parseInt(unicode, 16));
        });
        
        result = result.replace(/\\(.)/g, (match, char) => {
          switch (char) {
            case '0': return '\u0000';
            case 'b': return '\u0008';
            case 't': return '\u0009';
            case 'n': return '\u000A';
            case 'f': return '\u000C';
            case 'r': return '\u000D';
            case '"': return '"';
            case "'": return "'";
            case '\\': return '\\';
            case '/': return '/';
            default: return char;
          }
        });
        
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
              <h1 className="text-3xl font-bold text-black mb-4">JavaScript轉義編碼工具</h1>
              <p className="text-black">JavaScript、JSON、Unicode和十六進位轉義編碼解碼</p>
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
                
                {mode === 'encode' && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-black">轉義類型:</label>
                    <select
                      value={escapeType}
                      onChange={(e) => setEscapeType(e.target.value as 'javascript' | 'json' | 'unicode' | 'hex')}
                      className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="json">JSON</option>
                      <option value="unicode">Unicode</option>
                      <option value="hex">十六進位</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '原始文字' : '轉義文字'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要轉義的文字...' : '請輸入要解碼的轉義字符...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? '轉義結果' : '解碼結果'})
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
                  {mode === 'encode' ? '轉義' : '解碼'}
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
                <p><strong>JavaScript:</strong> 轉義引號、反斜線和控制字符（\\n, \\t等）。</p>
                <p><strong>JSON:</strong> 符合JSON標準的字符轉義。</p>
                <p><strong>Unicode:</strong> 將非ASCII字符轉換為 \\uXXXX 格式。</p>
                <p><strong>十六進位:</strong> 將所有字符轉換為 \\xXX 格式。</p>
                <p><strong>應用場景:</strong> JavaScript開發、JSON數據處理、字符串安全傳輸等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 轉義編碼可以確保特殊字符在代碼中正確顯示和處理。
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