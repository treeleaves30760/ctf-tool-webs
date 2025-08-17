'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegexTool() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?://[\\w\\-._~:/?#[\\]@!$&\'()*+,;=%]+' },
    { name: 'IP地址', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
    { name: 'IPv6', pattern: '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}' },
    { name: '手機號碼', pattern: '1[3-9]\\d{9}' },
    { name: '身分證字號', pattern: '[A-Z][12]\\d{8}' },
    { name: '信用卡', pattern: '\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b' },
    { name: 'MAC地址', pattern: '([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})' },
    { name: '十六進制', pattern: '0x[0-9a-fA-F]+|[0-9a-fA-F]+h' },
    { name: 'Base64', pattern: '[A-Za-z0-9+/]{4}*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?' }
  ];

  const testRegex = () => {
    try {
      setError('');
      setMatches([]);
      
      if (!pattern.trim()) {
        setError('請輸入正規表達式');
        setIsValid(null);
        return;
      }

      const regex = new RegExp(pattern, flags);
      setIsValid(true);

      if (!testString.trim()) {
        return;
      }

      const foundMatches = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push(match[0]);
          if (regex.lastIndex === match.index) {
            break; // Prevent infinite loop
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push(match[0]);
        }
      }

      setMatches(foundMatches);
    } catch (err) {
      setError('無效的正規表達式: ' + (err as Error).message);
      setIsValid(false);
      setMatches([]);
    }
  };

  const handlePatternSelect = (selectedPattern: string) => {
    setPattern(selectedPattern);
  };

  const handleClear = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setIsValid(null);
    setError('');
  };

  const handleCopyMatches = () => {
    navigator.clipboard.writeText(matches.join('\n'));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">正規表達式測試工具</h1>
              <p className="text-black">測試和驗證正規表達式模式，支持常用模式快速選擇</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pattern Input */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="space-y-4">
                    {/* Pattern */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        正規表達式
                      </label>
                      <div className="flex space-x-2">
                        <span className="text-lg text-gray-500">/</span>
                        <input
                          type="text"
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          className="bg-white text-black flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                          placeholder="輸入正規表達式..."
                        />
                        <span className="text-lg text-gray-500">/</span>
                        <input
                          type="text"
                          value={flags}
                          onChange={(e) => setFlags(e.target.value)}
                          className="bg-white text-black w-16 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="flags"
                        />
                      </div>
                      {isValid !== null && (
                        <div className={`mt-2 text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {isValid ? '✓ 有效的正規表達式' : '✗ ' + error}
                        </div>
                      )}
                    </div>

                    {/* Test String */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        測試字串
                      </label>
                      <textarea
                        value={testString}
                        onChange={(e) => setTestString(e.target.value)}
                        className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                        placeholder="輸入要測試的字串..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={testRegex}
                        className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                      >
                        測試
                      </button>
                      <button
                        onClick={handleClear}
                        className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        清空
                      </button>
                      <button
                        onClick={handleCopyMatches}
                        disabled={matches.length === 0}
                        className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        複製匹配結果
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-3">匹配結果</h3>
                  {matches.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">找到 {matches.length} 個匹配項：</p>
                      <div className="bg-gray-50 rounded-md p-3 max-h-60 overflow-y-auto">
                        {matches.map((match, index) => (
                          <div key={index} className="text-sm text-black font-mono">
                            {index + 1}. "{match}"
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">沒有找到匹配項</p>
                  )}
                </div>
              </div>

              {/* Common Patterns */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-black mb-3">常用模式</h3>
                <div className="space-y-2">
                  {commonPatterns.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handlePatternSelect(item.pattern)}
                      className="w-full text-left p-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-black">{item.name}</div>
                      <div className="text-gray-600 font-mono text-xs mt-1 break-all">
                        {item.pattern}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>正規表達式:</strong> 用於匹配字串模式的強大工具。</p>
                <p><strong>常用標誌:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code>g</code> - 全域匹配，找到所有匹配項</li>
                  <li><code>i</code> - 不分大小寫</li>
                  <li><code>m</code> - 多行模式</li>
                  <li><code>s</code> - 點號匹配換行符</li>
                </ul>
                <p><strong>特殊字符:</strong> . * + ? ^ $ | [] {} () \ 需要用反斜線轉義</p>
                <p><strong>應用:</strong> 數據提取、格式驗證、CTF中的字串分析等</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}