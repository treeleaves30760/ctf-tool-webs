'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BrainfuckTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'execute' | 'encode' | 'decode'>('execute');
  const [programInput, setProgramInput] = useState('');

  const executeBrainfuck = (code: string, input: string): string => {
    const memory = new Array(30000).fill(0);
    let pointer = 0;
    let codePointer = 0;
    let inputPointer = 0;
    let output = '';
    const stack: number[] = [];
    const maxSteps = 100000; // Prevent infinite loops
    let steps = 0;

    while (codePointer < code.length && steps < maxSteps) {
      steps++;
      const command = code[codePointer];

      switch (command) {
        case '>':
          pointer = (pointer + 1) % 30000;
          break;
        case '<':
          pointer = (pointer - 1 + 30000) % 30000;
          break;
        case '+':
          memory[pointer] = (memory[pointer] + 1) % 256;
          break;
        case '-':
          memory[pointer] = (memory[pointer] - 1 + 256) % 256;
          break;
        case '.':
          output += String.fromCharCode(memory[pointer]);
          break;
        case ',':
          if (inputPointer < input.length) {
            memory[pointer] = input.charCodeAt(inputPointer);
            inputPointer++;
          } else {
            memory[pointer] = 0;
          }
          break;
        case '[':
          if (memory[pointer] === 0) {
            let bracketCount = 1;
            while (bracketCount > 0 && codePointer < code.length - 1) {
              codePointer++;
              if (code[codePointer] === '[') bracketCount++;
              if (code[codePointer] === ']') bracketCount--;
            }
          } else {
            stack.push(codePointer);
          }
          break;
        case ']':
          if (memory[pointer] !== 0 && stack.length > 0) {
            codePointer = stack[stack.length - 1];
          } else {
            stack.pop();
          }
          break;
      }
      codePointer++;
    }

    if (steps >= maxSteps) {
      return output + '\n[執行超時，可能存在無限循環]';
    }
    
    return output;
  };

  const textToBrainfuck = (text: string): string => {
    let result = '';
    let currentValue = 0;

    for (const char of text) {
      const targetValue = char.charCodeAt(0);
      const diff = targetValue - currentValue;

      if (diff > 0) {
        result += '+'.repeat(diff);
      } else if (diff < 0) {
        result += '-'.repeat(-diff);
      }

      result += '.';
      currentValue = targetValue;
    }

    return result;
  };

  const handleConvert = () => {
    try {
      if (mode === 'execute') {
        const result = executeBrainfuck(input, programInput);
        setOutput(result);
      } else if (mode === 'encode') {
        const result = textToBrainfuck(input);
        setOutput(result);
      } else {
        // For decode, we would execute the brainfuck code
        const result = executeBrainfuck(input, '');
        setOutput(result);
      }
    } catch (error) {
      setOutput('執行出錯: ' + (error as Error).message);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setProgramInput('');
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
              <h1 className="text-3xl font-bold text-black mb-4">Brainfuck解釋器</h1>
              <p className="text-black">Brainfuck程式語言執行器和編碼器</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">模式:</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'execute' | 'encode' | 'decode')}
                    className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="execute">執行代碼</option>
                    <option value="encode">文字轉Brainfuck</option>
                    <option value="decode">Brainfuck轉文字</option>
                  </select>
                </div>
              </div>

              {mode === 'execute' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-2">
                    程式輸入（給程式的輸入數據）
                  </label>
                  <input
                    value={programInput}
                    onChange={(e) => setProgramInput(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                    placeholder="程式執行時需要的輸入數據..."
                  />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸入 ({mode === 'encode' ? '普通文字' : 'Brainfuck代碼'})
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
                    placeholder={mode === 'encode' ? '請輸入要轉換的文字...' : '請輸入Brainfuck代碼...'}
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    輸出 ({mode === 'encode' ? 'Brainfuck代碼' : '執行結果'})
                  </label>
                  <textarea
                    value={output}
                    readOnly
                    className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono"
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
                  {mode === 'execute' ? '執行' : mode === 'encode' ? '編碼' : '解碼'}
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

            {/* Commands Reference */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">Brainfuck指令參考</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex gap-3"><span className="font-mono bg-gray-100 px-2 py-1 rounded">{'>'}</span> 指針右移</div>
                  <div className="flex gap-3"><span className="font-mono bg-gray-100 px-2 py-1 rounded">{'<'}</span> 指針左移</div>
                  <div className="flex gap-3"><span className="font-mono bg-gray-100 px-2 py-1 rounded">+</span> 當前格數值+1</div>
                  <div className="flex gap-3"><span className="font-mono bg-gray-100 px-2 py-1 rounded">-</span> 當前格數值-1</div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-3"><span className="font-mono bg-gray-100 px-2 py-1 rounded">.</span> 輸出當前格字符</div>
                  <div className="flex gap-3"><span className="font-mono bg-gray-100 px-2 py-1 rounded">,</span> 輸入字符到當前格</div>
                  <div className="flex gap-3"><span className="font-mono bg-gray-100 px-2 py-1 rounded">[</span> 如果當前格為0，跳到對應]</div>
                  <div className="flex gap-3"><span className="font-mono bg-gray-100 px-2 py-1 rounded">]</span> 如果當前格非0，跳回對應[</div>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Brainfuck:</strong> 極簡的圖靈完備程式語言，只有8個指令。</p>
                <p><strong>記憶體:</strong> 使用30000個位元組的陣列，每個位元組初始值為0。</p>
                <p><strong>指針:</strong> 從位置0開始，可以左右移動來存取不同的記憶體位置。</p>
                <p><strong>安全限制:</strong> 最多執行100000步，防止無限循環。</p>
                <p><strong>應用:</strong> 程式語言理論、極簡編程、密碼學隱寫等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> Hello World程式：++++++++++[{'>'}{'+++++++>'}{'++++++++++>'}+++{'>'}+{'<<<<'}-]{'>'}{'++'}.{'>'}{'+'}. +++++++..+++.{'>'}{'++'}.{'<<'}+++++++++++++++.{'>'}. +++.------.--------.{'>'}{'+'}. {'>'}.
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