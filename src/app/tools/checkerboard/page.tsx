"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckerboardTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
	const [keyword, setKeyword] = useState("KEYWORD");
	const [checkerNumbers, setCheckerNumbers] = useState("2 6");
	const [boardDisplay, setBoardDisplay] = useState("");

	// Create straddling checkerboard
	const createCheckerboard = (keyword: string, numbers: string) => {
		const [num1, num2] = numbers.split(/\s+/).map(n => parseInt(n)).filter(n => !isNaN(n) && n >= 0 && n <= 9);
		if (!num1 || !num2 || num1 === num2) {
			throw new Error("請輸入兩個不同的數字 (0-9)");
		}

		// Create alphabet without J (traditional)
		const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
		const used = new Set<string>();
		let keywordLetters = "";
		
		// Get unique letters from keyword
		for (const char of keyword.toUpperCase()) {
			if (char >= 'A' && char <= 'Z' && !used.has(char) && char !== 'J') {
				keywordLetters += char;
				used.add(char);
			}
		}
		
		// Add remaining letters
		for (const char of alphabet) {
			if (!used.has(char)) {
				keywordLetters += char;
			}
		}

		// Create the checkerboard
		const board: Record<string, string> = {};
		const reverseBoard: Record<string, string> = {};
		
		// First row: most common letters get single digits
		let letterIndex = 0;
		for (let i = 0; i < 10; i++) {
			if (i !== num1 && i !== num2 && letterIndex < keywordLetters.length) {
				const letter = keywordLetters[letterIndex];
				board[letter] = i.toString();
				reverseBoard[i.toString()] = letter;
				letterIndex++;
			}
		}
		
		// Second and third rows: remaining letters get two digits
		for (let row of [num1, num2]) {
			for (let col = 0; col < 10; col++) {
				if (letterIndex < keywordLetters.length) {
					const letter = keywordLetters[letterIndex];
					const code = row.toString() + col.toString();
					board[letter] = code;
					reverseBoard[code] = letter;
					letterIndex++;
				}
			}
		}
		
		// J maps to I
		board['J'] = board['I'];
		
		return { board, reverseBoard, num1, num2 };
	};

	const checkerboardEncrypt = (text: string): string => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
		const { board } = createCheckerboard(keyword, checkerNumbers);
		
		let result = "";
		for (const char of cleanText) {
			if (board[char]) {
				result += board[char];
			}
		}
		
		return result;
	};

	const checkerboardDecrypt = (text: string): string => {
		const { reverseBoard, num1, num2 } = createCheckerboard(keyword, checkerNumbers);
		let result = "";
		let i = 0;
		
		while (i < text.length) {
			const digit = text[i];
			
			// Check if it's a two-digit code
			if ((parseInt(digit) === num1 || parseInt(digit) === num2) && i + 1 < text.length) {
				const twoDigit = text.substring(i, i + 2);
				if (reverseBoard[twoDigit]) {
					result += reverseBoard[twoDigit];
					i += 2;
					continue;
				}
			}
			
			// Single digit
			if (reverseBoard[digit]) {
				result += reverseBoard[digit];
			}
			i++;
		}
		
		return result;
	};

	const generateBoardDisplay = () => {
		try {
			const { board, num1, num2 } = createCheckerboard(keyword, checkerNumbers);
			
			let display = "棋盤密碼表:\n\n";
			display += "   0 1 2 3 4 5 6 7 8 9\n";
			display += "   ";
			
			// First row
			for (let i = 0; i < 10; i++) {
				let found = false;
				for (const [letter, code] of Object.entries(board)) {
					if (code === i.toString() && letter !== 'J') {
						display += letter + " ";
						found = true;
						break;
					}
				}
				if (!found) {
					display += "  ";
				}
			}
			display += "\n";
			
			// Second row
			display += `${num1}  `;
			for (let i = 0; i < 10; i++) {
				const code = num1.toString() + i.toString();
				let found = false;
				for (const [letter, letterCode] of Object.entries(board)) {
					if (letterCode === code && letter !== 'J') {
						display += letter + " ";
						found = true;
						break;
					}
				}
				if (!found) {
					display += "  ";
				}
			}
			display += "\n";
			
			// Third row
			display += `${num2}  `;
			for (let i = 0; i < 10; i++) {
				const code = num2.toString() + i.toString();
				let found = false;
				for (const [letter, letterCode] of Object.entries(board)) {
					if (letterCode === code && letter !== 'J') {
						display += letter + " ";
						found = true;
						break;
					}
				}
				if (!found) {
					display += "  ";
				}
			}
			
			setBoardDisplay(display);
		} catch (error) {
			setBoardDisplay("生成棋盤失敗: " + (error as Error).message);
		}
	};

	const handleConvert = () => {
		try {
			if (!keyword.trim()) {
				setOutput("請輸入關鍵字");
				return;
			}

			if (mode === "encrypt") {
				const result = checkerboardEncrypt(input);
				setOutput(result);
			} else {
				const result = checkerboardDecrypt(input);
				setOutput(result);
			}
		} catch (error) {
			setOutput("轉換出錯: " + (error as Error).message);
		}
	};

	const handleClear = () => {
		setInput("");
		setOutput("");
		setBoardDisplay("");
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(output);
	};

	const handleCopyBoard = () => {
		navigator.clipboard.writeText(boardDisplay);
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						{/* Header */}
						<div className="text-center mb-8 bg-white p-4 rounded-lg">
							<h1 className="text-3xl font-bold text-black mb-4">
								棋盤密碼工具
							</h1>
							<p className="text-black">
								使用跨欄棋盤的可變長度數字替換密碼
							</p>
						</div>

						{/* Controls */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<div className="flex flex-wrap gap-4 mb-6">
								<div className="flex items-center space-x-2">
									<label className="text-sm font-medium text-black">
										模式:
									</label>
									<select
										value={mode}
										onChange={(e) =>
											setMode(e.target.value as "encrypt" | "decrypt")
										}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value="encrypt">加密</option>
										<option value="decrypt">解密</option>
									</select>
								</div>

								<div className="flex items-center space-x-2">
									<label className="text-sm font-medium text-black">
										關鍵字:
									</label>
									<input
										type="text"
										value={keyword}
										onChange={(e) => setKeyword(e.target.value)}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
										placeholder="KEYWORD"
									/>
								</div>

								<div className="flex items-center space-x-2">
									<label className="text-sm font-medium text-black">
										空位數字:
									</label>
									<input
										type="text"
										value={checkerNumbers}
										onChange={(e) => setCheckerNumbers(e.target.value)}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500 w-24"
										placeholder="2 6"
									/>
								</div>

								<button
									onClick={generateBoardDisplay}
									className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
								>
									顯示棋盤
								</button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "encrypt" ? "明文" : "密文"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encrypt"
												? "請輸入要加密的文字..."
												: "請輸入要解密的數字..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encrypt" ? "密文" : "明文"})
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
									{mode === "encrypt" ? "加密" : "解密"}
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

						{/* Checkerboard Display */}
						{boardDisplay && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-black">
										棋盤密碼表
									</h3>
									<button
										onClick={handleCopyBoard}
										className="text-sm border border-gray-300 text-black px-4 py-1 rounded-md hover:bg-gray-50 transition-colors"
									>
										複製棋盤
									</button>
								</div>
								<pre className="bg-gray-50 p-4 rounded-md text-sm font-mono">
									{boardDisplay}
								</pre>
							</div>
						)}

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								棋盤密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									使用跨欄棋盤將字母替換為可變長度的數字，常用字母用單個數字。
								</p>
								<p>
									<strong>結構:</strong>{" "}
									第一行放置8個常用字母(單個數字)，空位用於標記雙數字編碼。
								</p>
								<p>
									<strong>優點:</strong>{" "}
									可變長度編碼使頻率分析更困難，常用字母短編碼提高效率。
								</p>
								<p>
									<strong>歷史:</strong>{" "}
									廣泛用於電報通信和間諜活動中。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<p className="text-sm">關鍵字: KEYWORD, 空位: 2 6</p>
									<p className="text-sm">E=0, T=1, A=3... (單數字)</p>
									<p className="text-sm">B=20, C=21... (雙數字)</p>
									<p className="text-sm">明文: HELLO → 密文: 801383</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}