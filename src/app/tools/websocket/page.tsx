'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Message {
  type: 'sent' | 'received' | 'info' | 'error';
  content: string;
  timestamp: Date;
}

export default function WebSocketTool() {
  const [url, setUrl] = useState('wss://echo.websocket.org/');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (type: Message['type'], content: string) => {
    const newMessage: Message = {
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connect = () => {
    if (isConnected || isConnecting) return;
    
    try {
      setIsConnecting(true);
      addMessage('info', `正在連接至: ${url}`);
      
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        addMessage('info', '連接成功！');
      };

      ws.onmessage = (event) => {
        addMessage('received', event.data);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
        addMessage('info', `連接已關閉 (代碼: ${event.code}, 原因: ${event.reason || '無'})`);
      };

      ws.onerror = (error) => {
        setIsConnected(false);
        setIsConnecting(false);
        addMessage('error', '連接錯誤: ' + error);
      };
    } catch (error) {
      setIsConnecting(false);
      addMessage('error', '連接失敗: ' + (error as Error).message);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
      addMessage('info', '手動斷開連接');
    }
  };

  const sendMessage = () => {
    if (!isConnected || !wsRef.current || !message.trim()) return;
    
    try {
      wsRef.current.send(message);
      addMessage('sent', message);
      setMessage('');
    } catch (error) {
      addMessage('error', '傳送失敗: ' + (error as Error).message);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('zh-TW', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getMessageStyle = (type: Message['type']): string => {
    switch (type) {
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'received':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'info':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMessagePrefix = (type: Message['type']): string => {
    switch (type) {
      case 'sent': return '→ 傳送: ';
      case 'received': return '← 接收: ';
      case 'info': return 'ℹ️ 資訊: ';
      case 'error': return '⚠️ 錯誤: ';
      default: return '';
    }
  };

  const loadExampleUrls = [
    'wss://echo.websocket.org/',
    'wss://ws.postman-echo.com/raw',
    'ws://localhost:8080',
    'wss://socketsbay.com/wss/v2/1/demo/'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">WebSocket測試工具</h1>
              <p className="text-black">WebSocket連結測試，傳送資料</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Connection Panel */}
              <div className="lg:col-span-1 space-y-6">
                {/* Connection Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4">連接設定</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
WebSocket URL
                      </label>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        placeholder="wss://example.com/websocket"
                        disabled={isConnected || isConnecting}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">常用範例:</div>
                      {loadExampleUrls.map((exampleUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setUrl(exampleUrl)}
                          className="block w-full text-left text-xs text-teal-600 hover:text-teal-700 truncate"
                          disabled={isConnected || isConnecting}
                        >
                          {exampleUrl}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {!isConnected ? (
                        <button
                          onClick={connect}
                          disabled={isConnecting || !url.trim()}
                          className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isConnecting ? '連接中...' : '連接'}
                        </button>
                      ) : (
                        <button
                          onClick={disconnect}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                          斷開連接
                        </button>
                      )}
                    </div>

                    <div className="text-sm">
                      狀態: 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        isConnected ? 'bg-green-100 text-green-800' : 
                        isConnecting ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {isConnected ? '已連接' : isConnecting ? '連接中' : '未連接'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4">傳送訊息</h3>
                  
                  <div className="space-y-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-white text-black w-full h-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
                      placeholder="輸入要傳送的訊息..."
                      disabled={!isConnected}
                    />
                    
                    <button
                      onClick={sendMessage}
                      disabled={!isConnected || !message.trim()}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      傳送訊息
                    </button>
                    
                    <div className="text-xs text-gray-500">
                      按 Enter 鍵可快速傳送
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[600px] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black">訊息記錄</h3>
                    <button
                      onClick={clearMessages}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      清空記錄
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        還沒有訊息記錄
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md border ${getMessageStyle(msg.type)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-xs font-medium mb-1">
                                {getMessagePrefix(msg.type)}
                                <span className="text-gray-500">{formatTime(msg.timestamp)}</span>
                              </div>
                              <div className="font-mono text-sm break-words">
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>WebSocket測試:</strong> 用於測試和除錯WebSocket連接。</p>
                <p><strong>支援的協議:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>ws://</strong> - 非加密WebSocket連接</li>
                  <li><strong>wss://</strong> - 加密WebSocket連接（建議）</li>
                </ul>
                <p><strong>功能特點:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>即時連接狀態顯示</li>
                  <li>訊息傳送和接收記錄</li>
                  <li>連接事件和錯誤訊息</li>
                  <li>清晰的時間戳記錄</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 適用於API測試、即時通訊除錯等場景。
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