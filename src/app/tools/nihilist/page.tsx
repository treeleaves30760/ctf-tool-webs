"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NihilistTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
	const [keyword, setKeyword] = useState("KEYWORD");
	const [keyPhrase, setKeyPhrase] = useState("SECRET");
	const [polybius, setPolybius] = useState("");

	// Create Polybius square from keyword
	const createPolybiusSquare = (keyword: string): { square: string[][], mapping: Record<string, string> } => {
		const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // J=I in traditional Polybius
		const used = new Set<string>();
		let square: string[][] = Array(5).fill(null).map(() => Array(5).fill(""));
		const mapping: Record<string, string> = {};
		
		// Add keyword letters first
		let row = 0, col = 0;
		for (const char of keyword.toUpperCase()) {
			if (char >= 'A' && char <= 'Z' && !used.has(char) && char !== 'J') {
				square[row][col] = char;
				mapping[char] = `${row + 1}${col + 1}`;
				used.add(char);
				col++;
				if (col === 5) {
					col = 0;
					row++;
				}
			}
		}
		
		// Add remaining letters
		for (const char of alphabet) {
			if (!used.has(char)) {
				square[row][col] = char;
				mapping[char] = `${row + 1}${col + 1}`;
				used.add(char);
				col++;
				if (col === 5) {
					col = 0;
					row++;
				}
			}
		}
		
		// J maps to same as I
		mapping['J'] = mapping['I'];
		
		return { square, mapping };
	};

	const createReverseMapping = (mapping: Record<string, string>): Record<string, string> => {
		const reverse: Record<string, string> = {};
		Object.entries(mapping).forEach(([letter, coord]) => {
			reverse[coord] = letter;
		});
		return reverse;
	};

	const generateKeyNumbers = (text: string, keyPhrase: string): number[] => {
		const { mapping } = createPolybiusSquare(keyword);
		const cleanKey = keyPhrase.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
		const keyNumbers: number[] = [];
		
		for (let i = 0; i < text.length; i++) {
			const keyChar = cleanKey[i % cleanKey.length];
			const coord = mapping[keyChar];
			if (coord) {
				keyNumbers.push(parseInt(coord));
			}
		}
		
		return keyNumbers;
	};

	const nihilistEncrypt = (text: string): string => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
		const { mapping } = createPolybiusSquare(keyword);
		const keyNumbers = generateKeyNumbers(cleanText, keyPhrase);
		
		const result: string[] = [];
		
		for (let i = 0; i < cleanText.length; i++) {
			const char = cleanText[i];
			const coord = mapping[char];
			if (coord && keyNumbers[i]) {
				const textNum = parseInt(coord);
				const keyNum = keyNumbers[i];
				const encrypted = textNum + keyNum;
				result.push(encrypted.toString());
			}
		}
		
		return result.join(" ");
	};

	const nihilistDecrypt = (text: string): string => {
		const numbers = text.split(/\s+/).filter(n => n.trim()).map(n => parseInt(n));
		const { mapping } = createPolybiusSquare(keyword);
		const reverseMapping = createReverseMapping(mapping);
		const keyNumbers = generateKeyNumbers("A".repeat(numbers.length), keyPhrase);
		
		const result: string[] = [];
		
		for (let i = 0; i < numbers.length; i++) {
			if (keyNumbers[i]) {
				const encrypted = numbers[i];
				const keyNum = keyNumbers[i];
				const decrypted = encrypted - keyNum;
				const coord = decrypted.toString();
				const letter = reverseMapping[coord];
				if (letter) {
					result.push(letter);
				}
			}
		}
		
		return result.join("");
	};

	const generatePolybiusDisplay = () => {
		const { square } = createPolybiusSquare(keyword);
		let display = "   1 2 3 4 5\n";
		for (let i = 0; i < 5; i++) {
			display += `${i + 1}  ${square[i].join(" ")}\n`;
		}
		setPolybius(display);
	};

	const handleConvert = () => {
		try {
			if (!keyword.trim() || !keyPhrase.trim()) {
				setOutput("請輸入關鍵字和密鑰短語");
				return;
			}

			if (mode === "encrypt") {
				const result = nihilistEncrypt(input);
				setOutput(result);
			} else {
				const result = nihilistDecrypt(input);
				setOutput(result);
			}
		} catch (error) {
			setOutput("轉換出錯: " + (error as Error).message);
		}
	};

	const handleClear = () => {
		setInput("");
		setOutput("");
		setPolybius("");
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(output);
	};

	const handleCopyPolybius = () => {
		navigator.clipboard.writeText(polybius);
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
								虛無主義密碼工具
							</h1>
							<p className="text-black">
								結合波利比奧斯方格和數字加法的複合密碼系統
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
										方格關鍵字:
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
										密鑰短語:
									</label>
									<input
										type="text"
										value={keyPhrase}
										onChange={(e) => setKeyPhrase(e.target.value)}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
										placeholder="SECRET"
									/>
								</div>

								<button
									onClick={generatePolybiusDisplay}
									className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
								>
									顯示方格
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
												: "請輸入要解密的數字 (以空格分隔)..."
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

						{/* Polybius Square Display */}
						{polybius && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-black">
										波利比奧斯方格 (關鍵字: {keyword})
									</h3>
									<button
										onClick={handleCopyPolybius}
										className="text-sm border border-gray-300 text-black px-4 py-1 rounded-md hover:bg-gray-50 transition-colors"
									>
										複製方格
									</button>
								</div>
								<pre className="bg-gray-50 p-4 rounded-md text-sm font-mono">
									{polybius}
								</pre>
							</div>
						)}

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								虛無主義密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>加密步驟:</strong>
								</p>
								<ol className="list-decimal ml-6 space-y-1">
									<li>使用關鍵字建立5×5波利比奧斯方格</li>
									<li>將明文字母轉換為座標數字</li>
									<li>將密鑰短語字母也轉換為座標數字</li>
									<li>將對應位置的數字相加得到密文</li>
								</ol>
								<p>
									<strong>特點:</strong>{" "}
									結合了替換密碼和加法密碼，提供雙重保護。
								</p>
								<p>
									<strong>安全性:</strong>{" "}
									比簡單的波利比奧斯方格更安全，需要知道兩個關鍵字。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<p className="text-sm">明文: HELLO</p>
									<p className="text-sm">H=23, E=15, L=31, L=31, O=34</p>
									<p className="text-sm">密鑰: SECRET (重複) = 44, 15, 13, 42, 15</p>
									<p className="text-sm">密文: 67 30 44 73 49</p>
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