'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BookTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [bookText, setBookText] = useState('');
  const [format, setFormat] = useState<'page-line-word' | 'line-word' | 'word'>('page-line-word');

  const encodeBookCipher = (text: string, book: string): string => {
    const words = book.toLowerCase().split(/\s+/);
    const textWords = text.toLowerCase().split(/\s+/);
    const result = [];

    for (const word of textWords) {
      const index = words.findIndex(w => w.replace(/[^\w]/g, '') === word.replace(/[^\w]/g, ''));
      if (index !== -1) {
        switch (format) {
          case 'word':
            result.push((index + 1).toString());
            break;
          case 'line-word':
            // Simplified: assume 10 words per line
            const line = Math.floor(index / 10) + 1;
            const wordInLine = (index % 10) + 1;
            result.push(`${line}-${wordInLine}`);
            break;
          case 'page-line-word':
            // Simplified: assume 100 words per page, 10 words per line
            const page = Math.floor(index / 100) + 1;
            const lineInPage = Math.floor((index % 100) / 10) + 1;
            const wordInPageLine = (index % 10) + 1;
            result.push(`${page}-${lineInPage}-${wordInPageLine}`);
            break;
        }
      } else {
        result.push(`[${word}]`); // Mark unfound words
      }
    }

    return result.join(' ');
  };

  const decodeBookCipher = (cipher: string, book: string): string => {
    const words = book.toLowerCase().split(/\s+/);
    const indices = cipher.split(/\s+/);
    const result = [];

    for (const index of indices) {
      if (index.startsWith('[') && index.endsWith(']')) {
        // Unfound word, return as is
        result.push(index.slice(1, -1));
        continue;
      }

      let wordIndex = 0;
      switch (format) {
        case 'word':
          wordIndex = parseInt(index) - 1;
          break;
        case 'line-word':
          const [line, wordInLine] = index.split('-').map(Number);
          wordIndex = (line - 1) * 10 + (wordInLine - 1);
          break;
        case 'page-line-word':
          const [page, lineInPage, wordInPageLine] = index.split('-').map(Number);
          wordIndex = (page - 1) * 100 + (lineInPage - 1) * 10 + (wordInPageLine - 1);
          break;
      }

      if (wordIndex >= 0 && wordIndex < words.length) {
        result.push(words[wordIndex].replace(/[^\w]/g, ''));
      } else {
        result.push(`[${index}]`); // Mark invalid indices
      }
    }

    return result.join(' ');
  };

  const handleConvert = () => {
    try {
      if (!bookText.trim()) {
        const output = mode === 'encode' ? setCiphertext : setPlaintext;
        output('請輸入書本內容');
        return;
      }

      if (mode === 'encode') {
        if (!plaintext.trim()) {
          setCiphertext('請輸入要編碼的明文');
          return;
        }
        const result = encodeBookCipher(plaintext, bookText);
        setCiphertext(result);
      } else {
        if (!ciphertext.trim()) {
          setPlaintext('請輸入要解碼的密文');
          return;
        }
        const result = decodeBookCipher(ciphertext, bookText);
        setPlaintext(result);
      }
    } catch (error) {
      const output = mode === 'encode' ? setCiphertext : setPlaintext;
      output('轉換出錯: ' + (error as Error).message);
    }
  };

  const handleClear = () => {
    setPlaintext('');
    setCiphertext('');
    setBookText('');
  };

  const handleCopy = () => {
    const textToCopy = mode === 'encode' ? ciphertext : plaintext;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleExampleBook = () => {
    setBookText(`The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. It is commonly used for testing typewriters, computer keyboards, and printers. The phrase has been around since at least the late 19th century. Many variations exist, including "Pack my box with five dozen liquor jugs" and "The five boxing wizards jump quickly."`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">書本密碼工具</h1>
              <p className="text-black">使用書籍內容作為密鑰的傳統密碼系統</p>
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
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">格式:</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'page-line-word' | 'line-word' | 'word')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="word">詞序號</option>
                    <option value="line-word">行-詞</option>
                    <option value="page-line-word">頁-行-詞</option>
                  </select>
                </div>

                <button
                  onClick={handleExampleBook}
                  className="text-sm bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
                >
                  載入範例書本
                </button>
              </div>

              <div className="space-y-6">
                {/* Book Text */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    書本內容 (作為密鑰)
                  </label>
                  <textarea
                    value={bookText}
                    onChange={(e) => setBookText(e.target.value)}
                    className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="請輸入書本內容，作為密碼本..."
                  />
                </div>

                {/* Plaintext */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    明文
                  </label>
                  <textarea
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="請輸入明文..."
                    readOnly={mode === 'decode'}
                  />
                </div>

                {/* Ciphertext */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    密文 (位置索引)
                  </label>
                  <textarea
                    value={ciphertext}
                    onChange={(e) => setCiphertext(e.target.value)}
                    className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                    placeholder="密文將顯示在這裡..."
                    readOnly={mode === 'encode'}
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
                  disabled={mode === 'encode' ? !ciphertext : !plaintext}
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
                <p><strong>書本密碼:</strong> 使用共同的書籍作為密鑰的傳統密碼系統。</p>
                <p><strong>編碼過程:</strong> 將明文中的每個詞在書中的位置記錄下來。</p>
                <p><strong>格式說明:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>詞序號:</strong> 簡單的詞索引，如 "3 15 27"</li>
                  <li><strong>行-詞:</strong> 行號和詞號，如 "2-5 3-1"</li>
                  <li><strong>頁-行-詞:</strong> 頁號、行號和詞號，如 "1-2-5 1-3-1"</li>
                </ul>
                <p><strong>安全性:</strong> 需要雙方擁有相同版本的書籍。</p>
                <p><strong>應用:</strong> 歷史密碼學、CTF古典密碼挑戰。</p>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> 此工具使用簡化的實現，實際書本密碼可能有不同的格式。
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