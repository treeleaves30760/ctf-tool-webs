'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HtmlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [entityType, setEntityType] = useState<'named' | 'numeric' | 'hex'>('named');

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        if (entityType === 'named') {
          // Named entities
          const namedEntities: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            ' ': '&nbsp;',
            '¡': '&iexcl;',
            '¢': '&cent;',
            '£': '&pound;',
            '¤': '&curren;',
            '¥': '&yen;',
            '¦': '&brvbar;',
            '§': '&sect;',
            '¨': '&uml;',
            '©': '&copy;',
            'ª': '&ordf;',
            '«': '&laquo;',
            '¬': '&not;',
            '®': '&reg;',
            '¯': '&macr;',
            '°': '&deg;',
            '±': '&plusmn;',
            '²': '&sup2;',
            '³': '&sup3;',
            '´': '&acute;',
            'µ': '&micro;',
            '¶': '&para;',
            '·': '&middot;',
            '¸': '&cedil;',
            '¹': '&sup1;',
            'º': '&ordm;',
            '»': '&raquo;',
            '¼': '&frac14;',
            '½': '&frac12;',
            '¾': '&frac34;',
            '¿': '&iquest;'
          };
          
          let result = input;
          for (const [char, entity] of Object.entries(namedEntities)) {
            result = result.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), entity);
          }
          setOutput(result);
        } else if (entityType === 'numeric') {
          // Numeric entities
          setOutput(input.replace(/./g, (char) => `&#${char.charCodeAt(0)};`));
        } else {
          // Hex entities
          setOutput(input.replace(/./g, (char) => `&#x${char.charCodeAt(0).toString(16).toUpperCase()};`));
        }
      } else {
        // Decode
        let result = input;
        
        // Decode named entities
        const namedEntities: { [key: string]: string } = {
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#39;': "'",
          '&apos;': "'",
          '&nbsp;': ' ',
          '&iexcl;': '¡',
          '&cent;': '¢',
          '&pound;': '£',
          '&curren;': '¤',
          '&yen;': '¥',
          '&brvbar;': '¦',
          '&sect;': '§',
          '&uml;': '¨',
          '&copy;': '©',
          '&ordf;': 'ª',
          '&laquo;': '«',
          '&not;': '¬',
          '&reg;': '®',
          '&macr;': '¯',
          '&deg;': '°',
          '&plusmn;': '±',
          '&sup2;': '²',
          '&sup3;': '³',
          '&acute;': '´',
          '&micro;': 'µ',
          '&para;': '¶',
          '&middot;': '·',
          '&cedil;': '¸',
          '&sup1;': '¹',
          '&ordm;': 'º',
          '&raquo;': '»',
          '&frac14;': '¼',
          '&frac12;': '½',
          '&frac34;': '¾',
          '&iquest;': '¿'
        };
        
        for (const [entity, char] of Object.entries(namedEntities)) {
          result = result.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), char);
        }
        
        // Decode numeric entities (&#123;)
        result = result.replace(/&#(\d+);/g, (match, num) => {
          return String.fromCharCode(parseInt(num, 10));
        });
        
        // Decode hex entities (&#x7B;)
        result = result.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
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
              <h1 className="text-3xl font-bold text-black mb-4">HTML實體編碼工具</h1>
              <p className="text-black">HTML實體編碼和解碼，支援命名實體、數字實體和十六進位實體</p>
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
                    <label className="text-sm font-medium text-black">實體類型:</label>
                    <select
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value as 'named' | 'numeric' | 'hex')}
                      className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="named">命名實體</option>
                      <option value="numeric">數字實體</option>
                      <option value="hex">十六進位實體</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '原始文字' : '編碼文字'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder={mode === 'encode' ? '請輸入要編碼的HTML文字...' : '請輸入要解碼的HTML實體...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? '編碼結果' : '解碼結果'})
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
                  {mode === 'encode' ? '編碼' : '解碼'}
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
                <p><strong>命名實體:</strong> 使用預定義的名稱（如 &amp;lt; 代表 &lt;）。</p>
                <p><strong>數字實體:</strong> 使用字符的十進位ASCII碼（如 &amp;#60; 代表 &lt;）。</p>
                <p><strong>十六進位實體:</strong> 使用字符的十六進位ASCII碼（如 &amp;#x3C; 代表 &lt;）。</p>
                <p><strong>應用場景:</strong> HTML文檔編輯、特殊字符顯示、XSS防護等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> HTML實體編碼可以防止特殊字符在網頁中被錯誤解析。
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