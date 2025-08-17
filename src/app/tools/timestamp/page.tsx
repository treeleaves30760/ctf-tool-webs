'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mode, setMode] = useState<'toTimestamp' | 'toDate'>('toTimestamp');
  const [format, setFormat] = useState<'seconds' | 'milliseconds'>('seconds');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const parseDateTime = (dateTimeStr: string): Date => {
    // Try different date formats
    const formats = [
      dateTimeStr, // ISO format
      dateTimeStr.replace(' ', 'T'), // Convert space to T
      dateTimeStr + ':00', // Add seconds if missing
      dateTimeStr + ' 00:00:00', // Add time if missing
    ];

    for (const formatStr of formats) {
      const date = new Date(formatStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    throw new Error('無法解析日期時間格式');
  };

  const handleConvert = () => {
    try {
      if (mode === 'toTimestamp') {
        if (!dateTime.trim()) {
          setTimestamp('請輸入日期時間');
          return;
        }

        const date = parseDateTime(dateTime);
        const ts = format === 'seconds' 
          ? Math.floor(date.getTime() / 1000)
          : date.getTime();
        
        setTimestamp(ts.toString());
      } else {
        if (!timestamp.trim()) {
          setDateTime('請輸入時間戳');
          return;
        }

        const ts = parseInt(timestamp);
        if (isNaN(ts)) {
          setDateTime('無效的時間戳格式');
          return;
        }

        const date = format === 'seconds' 
          ? new Date(ts * 1000)
          : new Date(ts);

        if (isNaN(date.getTime())) {
          setDateTime('無效的時間戳值');
          return;
        }

        setDateTime(formatDate(date));
      }
    } catch (error) {
      if (mode === 'toTimestamp') {
        setTimestamp('轉換出錯: ' + (error as Error).message);
      } else {
        setDateTime('轉換出錯: ' + (error as Error).message);
      }
    }
  };

  const handleClear = () => {
    setTimestamp('');
    setDateTime('');
  };

  const handleCopy = () => {
    const textToCopy = mode === 'toTimestamp' ? timestamp : dateTime;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleCurrentTime = () => {
    const now = new Date();
    if (mode === 'toTimestamp') {
      setDateTime(formatDate(now));
      const ts = format === 'seconds' 
        ? Math.floor(now.getTime() / 1000)
        : now.getTime();
      setTimestamp(ts.toString());
    } else {
      const ts = format === 'seconds' 
        ? Math.floor(now.getTime() / 1000)
        : now.getTime();
      setTimestamp(ts.toString());
      setDateTime(formatDate(now));
    }
  };

  const getTimezoneInfo = () => {
    const now = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -now.getTimezoneOffset() / 60;
    const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
    
    return {
      timeZone,
      offset: offsetStr,
      utc: now.toISOString().replace('T', ' ').replace('Z', ' UTC')
    };
  };

  const timezoneInfo = getTimezoneInfo();

  const commonTimestamps = [
    { name: 'Unix 紀元', timestamp: 0, date: '1970-01-01 00:00:00' },
    { name: 'Y2K', timestamp: 946684800, date: '2000-01-01 00:00:00' },
    { name: '2038年問題', timestamp: 2147483647, date: '2038-01-19 03:14:07' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">時間戳轉換工具</h1>
              <p className="text-black">Unix時間戳與日期時間之間的相互轉換</p>
            </div>

            {/* Current Time Display */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">當前時間</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">本地時間:</div>
                  <div className="font-mono text-lg text-black">{formatDate(currentTime)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Unix時間戳:</div>
                  <div className="font-mono text-lg text-black">
                    {format === 'seconds' 
                      ? Math.floor(currentTime.getTime() / 1000)
                      : currentTime.getTime()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">UTC時間:</div>
                  <div className="font-mono text-black">{timezoneInfo.utc}</div>
                </div>
                <div>
                  <div className="text-gray-600">時區:</div>
                  <div className="font-mono text-black">{timezoneInfo.timeZone} (UTC{timezoneInfo.offset})</div>
                </div>
              </div>
              <button
                onClick={handleCurrentTime}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                使用當前時間
              </button>
            </div>

            {/* Converter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">轉換方向:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'toTimestamp' | 'toDate')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="toTimestamp">日期 → 時間戳</option>
                    <option value="toDate">時間戳 → 日期</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">時間戳格式:</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'seconds' | 'milliseconds')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="seconds">秒 (10位數)</option>
                    <option value="milliseconds">毫秒 (13位數)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {/* Date Time Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    日期時間 (支援多種格式)
                  </label>
                  <input
                    type="text"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
                    placeholder="例如: 2023-12-25 15:30:00 或 2023-12-25T15:30:00"
                    readOnly={mode === 'toDate'}
                  />
                </div>

                {/* Timestamp Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Unix時間戳
                  </label>
                  <input
                    type="text"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
                    placeholder={format === 'seconds' ? '例如: 1703505000' : '例如: 1703505000000'}
                    readOnly={mode === 'toTimestamp'}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleConvert}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  轉換
                </button>
                <button
                  onClick={handleClear}
                  className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  清空
                </button>
                <button
                  onClick={handleCopy}
                  disabled={mode === 'toTimestamp' ? !timestamp : !dateTime}
                  className="border border-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  複製結果
                </button>
              </div>
            </div>

            {/* Common Timestamps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">常見時間戳</h3>
              <div className="space-y-3">
                {commonTimestamps.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <div className="font-medium text-black">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-black">{item.timestamp}</div>
                      <button
                        onClick={() => {
                          setTimestamp(item.timestamp.toString());
                          setDateTime(item.date);
                        }}
                        className="text-xs text-teal-600 hover:text-teal-700 mt-1"
                      >
                        使用此值
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Unix時間戳:</strong> 從1970年1月1日00:00:00 UTC開始的秒數或毫秒數。</p>
                <p><strong>支援格式:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>ISO 8601: 2023-12-25T15:30:00</li>
                  <li>通用格式: 2023-12-25 15:30:00</li>
                  <li>簡化格式: 2023-12-25</li>
                </ul>
                <p><strong>時區處理:</strong> 輸入的日期時間會按照瀏覽器的本地時區處理。</p>
                <p><strong>應用:</strong> 日誌分析、數據庫查詢、CTF時間線分析等。</p>
                <p className="text-sm mt-3">
                  <strong>注意:</strong> 不同程式語言可能使用秒或毫秒作為時間戳單位。
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