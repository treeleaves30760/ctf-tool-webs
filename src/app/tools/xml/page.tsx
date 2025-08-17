'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function XMLTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify' | 'validate'>('format');
  const [indent, setIndent] = useState<number>(2);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const formatXML = (xmlString: string, indentSize: number): string => {
    const PADDING = ' '.repeat(indentSize);
    const reg = /(>)(<)(\/*)/g;
    let formatted = xmlString.replace(reg, '$1\r\n$2$3');
    
    let pad = 0;
    return formatted.split('\r\n').map(line => {
      let indent = 0;
      if (line.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (line.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      
      const padding = PADDING.repeat(pad);
      pad += indent;
      return padding + line;
    }).join('\r\n');
  };

  const minifyXML = (xmlString: string): string => {
    return xmlString
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const validateXML = (xmlString: string): { valid: boolean; error?: string } => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      
      const errorNode = doc.querySelector('parsererror');
      if (errorNode) {
        return { 
          valid: false, 
          error: errorNode.textContent || 'XML解析錯誤' 
        };
      }
      
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: (error as Error).message 
      };
    }
  };

  const handleProcess = () => {
    try {
      setError('');
      setIsValid(null);

      if (!input.trim()) {
        setOutput('請輸入XML數據');
        return;
      }

      switch (mode) {
        case 'format':
          const validation = validateXML(input);
          if (!validation.valid) {
            setError(validation.error || '無效的XML格式');
            setIsValid(false);
            setOutput('格式化失敗：XML語法錯誤');
            return;
          }
          
          const formatted = formatXML(input, indent);
          setOutput(formatted);
          setIsValid(true);
          break;

        case 'minify':
          const minifyValidation = validateXML(input);
          if (!minifyValidation.valid) {
            setError(minifyValidation.error || '無效的XML格式');
            setIsValid(false);
            setOutput('壓縮失敗：XML語法錯誤');
            return;
          }
          
          const minified = minifyXML(input);
          setOutput(minified);
          setIsValid(true);
          break;

        case 'validate':
          const validationResult = validateXML(input);
          setIsValid(validationResult.valid);
          if (validationResult.valid) {
            setOutput('✓ XML格式正確\n\n結構良好的XML文檔');
          } else {
            setError(validationResult.error || '未知錯誤');
            setOutput('✗ XML格式錯誤\n\n請檢查XML語法');
          }
          break;
      }
    } catch (error) {
      setError('處理XML時出錯: ' + (error as Error).message);
      setIsValid(false);
      setOutput('處理失敗');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleExample = () => {
    const exampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
<book id="1">
<title>XML入門指南</title>
<author>張三</author>
<price currency="TWD">350</price>
<category>技術</category>
<description><![CDATA[這是一本介紹XML基礎知識的書籍，適合初學者閱讀。]]></description>
</book>
<book id="2">
<title>網頁開發實戰</title>
<author>李四</author>
<price currency="TWD">450</price>
<category>技術</category>
<description>詳細介紹網頁開發的各種技術和最佳實踐。</description>
</book>
</bookstore>`;
    
    setInput(exampleXML);
  };

  const getStats = () => {
    if (!input.trim()) return null;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      
      const errorNode = doc.querySelector('parsererror');
      if (errorNode) return null;

      const stats = {
        characters: input.length,
        lines: input.split('\n').length,
        size: new Blob([input]).size,
        elements: doc.getElementsByTagName('*').length,
        attributes: 0,
        textNodes: 0
      };

      // Count attributes and text nodes
      const walker = doc.createTreeWalker(
        doc,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        null
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          stats.attributes += (node as Element).attributes.length;
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          stats.textNodes++;
        }
      }

      return stats;
    } catch {
      return null;
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">XML格式化工具</h1>
              <p className="text-black">格式化、壓縮和驗證XML數據</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">操作:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'format' | 'minify' | 'validate')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="format">格式化</option>
                    <option value="minify">壓縮</option>
                    <option value="validate">驗證</option>
                  </select>
                </div>

                {mode === 'format' && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-black">縮排:</label>
                    <select
                      value={indent}
                      onChange={(e) => setIndent(Number(e.target.value))}
                      className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value={2}>2空格</option>
                      <option value={4}>4空格</option>
                      <option value={8}>8空格</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={handleExample}
                  className="text-sm bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
                >
                  載入範例
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入XML
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-80 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
                    placeholder="請輸入XML數據..."
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出結果
                  </label>
                  <textarea
                    value={output}
                    readOnly
                    className="bg-white text-black w-full h-80 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono"
                    placeholder="結果將顯示在這裡..."
                  />
                </div>
              </div>

              {/* Status */}
              {(isValid !== null || error) && (
                <div className="mt-4 p-3 rounded-md">
                  {isValid === true && (
                    <div className="bg-green-50 border border-green-200 text-green-700">
                      ✓ XML處理成功
                    </div>
                  )}
                  {isValid === false && (
                    <div className="bg-red-50 border border-red-200 text-red-700">
                      ✗ 錯誤: {error}
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              {stats && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-black mb-2">統計信息</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm text-gray-600">
                    <div>字符數: <span className="font-mono">{stats.characters}</span></div>
                    <div>行數: <span className="font-mono">{stats.lines}</span></div>
                    <div>大小: <span className="font-mono">{stats.size} bytes</span></div>
                    <div>元素: <span className="font-mono">{stats.elements}</span></div>
                    <div>屬性: <span className="font-mono">{stats.attributes}</span></div>
                    <div>文本節點: <span className="font-mono">{stats.textNodes}</span></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleProcess}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  {mode === 'format' ? '格式化' : mode === 'minify' ? '壓縮' : '驗證'}
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
                <p><strong>XML格式化:</strong> 將壓縮的XML數據格式化為易讀的格式。</p>
                <p><strong>XML壓縮:</strong> 移除空白字符和換行，減少文件大小。</p>
                <p><strong>XML驗證:</strong> 檢查XML語法是否正確，是否為結構良好的文檔。</p>
                <p><strong>XML特性:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>標籤必須成對出現</li>
                  <li>標籤名稱區分大小寫</li>
                  <li>屬性值必須用引號包圍</li>
                  <li>必須有根元素</li>
                </ul>
                <p><strong>應用:</strong> 配置文件、數據交換、Web服務、CTF中的XML數據分析等。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}