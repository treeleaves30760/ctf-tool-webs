'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function JSONTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify' | 'validate'>('format');
  const [indent, setIndent] = useState<number>(2);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const formatJSON = (jsonString: string, indentSize: number): string => {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indentSize);
  };

  const minifyJSON = (jsonString: string): string => {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  };

  const validateJSON = (jsonString: string): { valid: boolean; error?: string } => {
    try {
      JSON.parse(jsonString);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  };

  const handleProcess = () => {
    try {
      setError('');
      setIsValid(null);

      if (!input.trim()) {
        setOutput('請輸入JSON數據');
        return;
      }

      switch (mode) {
        case 'format':
          const formatted = formatJSON(input, indent);
          setOutput(formatted);
          setIsValid(true);
          break;

        case 'minify':
          const minified = minifyJSON(input);
          setOutput(minified);
          setIsValid(true);
          break;

        case 'validate':
          const validation = validateJSON(input);
          setIsValid(validation.valid);
          if (validation.valid) {
            setOutput('✓ JSON格式正確');
          } else {
            setError(validation.error || '未知錯誤');
            setOutput('✗ JSON格式錯誤');
          }
          break;
      }
    } catch (error) {
      setError('處理JSON時出錯: ' + (error as Error).message);
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
    const exampleJSON = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      },
      "hobbies": ["reading", "swimming", "coding"],
      "isActive": true,
      "balance": 1234.56,
      "lastLogin": null
    };
    
    setInput(JSON.stringify(exampleJSON));
  };

  const getStats = () => {
    if (!input.trim()) return null;

    try {
      const parsed = JSON.parse(input);
      const stats = {
        characters: input.length,
        lines: input.split('\n').length,
        size: new Blob([input]).size,
        keys: 0,
        arrays: 0,
        objects: 0
      };

      const countElements = (obj: any) => {
        if (Array.isArray(obj)) {
          stats.arrays++;
          obj.forEach(item => countElements(item));
        } else if (obj && typeof obj === 'object') {
          stats.objects++;
          stats.keys += Object.keys(obj).length;
          Object.values(obj).forEach(value => countElements(value));
        }
      };

      countElements(parsed);
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
              <h1 className="text-3xl font-bold text-black mb-4">JSON格式化工具</h1>
              <p className="text-black">格式化、壓縮和驗證JSON數據</p>
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
                    輸入JSON
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-80 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
                    placeholder="請輸入JSON數據..."
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
                      ✓ JSON處理成功
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
                    <div>對象: <span className="font-mono">{stats.objects}</span></div>
                    <div>數組: <span className="font-mono">{stats.arrays}</span></div>
                    <div>鍵值: <span className="font-mono">{stats.keys}</span></div>
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
                <p><strong>JSON格式化:</strong> 將壓縮的JSON數據格式化為易讀的格式。</p>
                <p><strong>JSON壓縮:</strong> 移除空白字符，減少文件大小。</p>
                <p><strong>JSON驗證:</strong> 檢查JSON語法是否正確。</p>
                <p><strong>統計信息:</strong> 顯示JSON結構的詳細統計數據。</p>
                <p><strong>應用:</strong> API開發、配置文件編輯、CTF中的JSON數據分析等。</p>
                <p className="text-sm mt-3">
                  <strong>快捷鍵:</strong> Ctrl+A全選, Ctrl+C複製, Ctrl+V貼上
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