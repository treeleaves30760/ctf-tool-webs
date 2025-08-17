'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PasswordTool() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [customChars, setCustomChars] = useState('');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const similarChars = 'il1Lo0O';

  const generateCharSet = () => {
    let charset = '';
    
    if (customChars.trim()) {
      return customChars;
    }
    
    if (includeUppercase) charset += uppercaseChars;
    if (includeLowercase) charset += lowercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSymbols) charset += symbolChars;
    
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    return charset;
  };

  const generatePassword = (charset: string, passwordLength: number): string => {
    if (charset.length === 0) {
      throw new Error('至少需要選擇一種字符類型');
    }
    
    let password = '';
    
    // Ensure at least one character from each selected type
    if (!customChars.trim()) {
      if (includeUppercase) {
        const filtered = excludeSimilar ? 
          uppercaseChars.split('').filter(char => !similarChars.includes(char)) : 
          uppercaseChars.split('');
        password += filtered[Math.floor(Math.random() * filtered.length)];
      }
      if (includeLowercase) {
        const filtered = excludeSimilar ? 
          lowercaseChars.split('').filter(char => !similarChars.includes(char)) : 
          lowercaseChars.split('');
        password += filtered[Math.floor(Math.random() * filtered.length)];
      }
      if (includeNumbers) {
        const filtered = excludeSimilar ? 
          numberChars.split('').filter(char => !similarChars.includes(char)) : 
          numberChars.split('');
        password += filtered[Math.floor(Math.random() * filtered.length)];
      }
      if (includeSymbols) {
        password += symbolChars[Math.floor(Math.random() * symbolChars.length)];
      }
    }
    
    // Fill the rest randomly
    while (password.length < passwordLength) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const calculateStrength = (password: string): { score: number; text: string; color: string } => {
    let score = 0;
    
    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character types
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Diversity
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) score += 1;
    
    if (score <= 3) return { score, text: '弱', color: 'text-red-600' };
    if (score <= 5) return { score, text: '中等', color: 'text-yellow-600' };
    if (score <= 7) return { score, text: '強', color: 'text-green-600' };
    return { score, text: '很強', color: 'text-green-700' };
  };

  const handleGenerate = () => {
    try {
      const charset = generateCharSet();
      const newPasswords = [];
      
      for (let i = 0; i < count; i++) {
        newPasswords.push(generatePassword(charset, length));
      }
      
      setPasswords(newPasswords);
    } catch (error) {
      setPasswords(['錯誤: ' + (error as Error).message]);
    }
  };

  const handleCopy = (password: string) => {
    navigator.clipboard.writeText(password);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(passwords.join('\n'));
  };

  const getCharsetInfo = () => {
    const charset = generateCharSet();
    return {
      chars: charset,
      length: charset.length,
      entropy: Math.log2(Math.pow(charset.length, length))
    };
  };

  const charsetInfo = getCharsetInfo();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">密碼產生器</h1>
              <p className="text-black">產生安全可靠的隨機密碼</p>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">密碼設定</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Length and Count */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      密碼長度: {length}
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="128"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>4</span>
                      <span>128</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      產生數量
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Character Options */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-black">大寫字母 (A-Z)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-black">小寫字母 (a-z)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-black">數字 (0-9)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-black">特殊符號 (!@#$%^&*)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={excludeSimilar}
                      onChange={(e) => setExcludeSimilar(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-black">排除相似字符 (il1Lo0O)</span>
                  </label>
                </div>
              </div>

              {/* Custom Characters */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-black mb-2">
                  自定義字符集 (留空使用上述設定)
                </label>
                <input
                  type="text"
                  value={customChars}
                  onChange={(e) => setCustomChars(e.target.value)}
                  className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                  placeholder="例如: abcd1234!@#$"
                />
              </div>

              {/* Charset Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>字符集大小: <span className="font-mono">{charsetInfo.length}</span></div>
                  <div>熵值: <span className="font-mono">{charsetInfo.entropy.toFixed(1)} bits</span></div>
                  <div className="break-all">可用字符: <span className="font-mono">{charsetInfo.chars}</span></div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-6">
                <button
                  onClick={handleGenerate}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  產生密碼
                </button>
              </div>
            </div>

            {/* Generated Passwords */}
            {passwords.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-black">產生的密碼</h3>
                  <button
                    onClick={handleCopyAll}
                    className="text-sm border border-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    複製全部
                  </button>
                </div>
                
                <div className="space-y-3">
                  {passwords.map((password, index) => {
                    const strength = calculateStrength(password);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="flex-1">
                          <div className="font-mono text-sm text-black break-all">{password}</div>
                          <div className="flex items-center space-x-4 mt-1 text-xs">
                            <span className="text-gray-500">長度: {password.length}</span>
                            <span className={`font-medium ${strength.color}`}>強度: {strength.text}</span>
                            <span className="text-gray-500">分數: {strength.score}/8</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(password)}
                          className="ml-3 text-sm border border-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          複製
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>安全建議:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>使用至少12個字符的密碼</li>
                  <li>混合使用大小寫字母、數字和特殊符號</li>
                  <li>避免使用個人信息或常見詞語</li>
                  <li>為每個服務使用唯一密碼</li>
                  <li>定期更換重要帳戶密碼</li>
                </ul>
                <p><strong>熵值:</strong> 表示密碼的隨機性，值越高越安全。</p>
                <p><strong>應用:</strong> 帳戶安全、CTF比賽、安全測試等。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}