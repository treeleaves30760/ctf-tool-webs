"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ADFGXTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key, setKey] = useState("PHQGIUMEAYLNOFDXKRCVSTZWB");
	const [transKey, setTransKey] = useState("SECRET");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	const defaultSquare = [
		['P', 'H', 'Q', 'G', 'I'],
		['U', 'M', 'E', 'A', 'Y'],
		['L', 'N', 'O', 'F', 'D'],
		['X', 'K', 'R', 'C', 'V'],
		['S', 'T', 'Z', 'W', 'B']
	];

	const adfgxLabels = ['A', 'D', 'F', 'G', 'X'];

	const createSquareFromKey = (key: string) => {
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		const uniqueChars = [...new Set(cleanKey)];
		
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.replace(/J/g, '');
		const remaining = alphabet.split('').filter(c => !uniqueChars.includes(c));
		
		const fullKey = [...uniqueChars, ...remaining].slice(0, 25);
		
		const square = [];
		for (let i = 0; i < 5; i++) {
			square.push(fullKey.slice(i * 5, (i + 1) * 5));
		}
		return square;
	};

	const encryptADFGX = (text: string, square: string[][], transKey: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
		
		// Step 1: Convert to ADFGX coordinates
		let coordinates = '';
		for (const char of cleanText) {
			for (let row = 0; row < 5; row++) {
				for (let col = 0; col < 5; col++) {
					if (square[row][col] === char) {
						coordinates += adfgxLabels[row] + adfgxLabels[col];
						break;
					}
				}
			}
		}

		// Step 2: Columnar transposition
		const cleanTransKey = transKey.toUpperCase().replace(/[^A-Z]/g, '');
		const keyOrder = cleanTransKey.split('').map((char, index) => ({ char, index }))
			.sort((a, b) => a.char.localeCompare(b.char))
			.map((item, newIndex) => ({ ...item, newIndex }))
			.sort((a, b) => a.index - b.index)
			.map(item => item.newIndex);

		const cols = cleanTransKey.length;
		const rows = Math.ceil(coordinates.length / cols);
		
		// Fill grid
		const grid: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));
		for (let i = 0; i < coordinates.length; i++) {
			const row = Math.floor(i / cols);
			const col = i % cols;
			grid[row][col] = coordinates[i];
		}

		// Read by column order
		let result = '';
		for (let order = 0; order < cols; order++) {
			const colIndex = keyOrder.indexOf(order);
			for (let row = 0; row < rows; row++) {
				if (grid[row][colIndex]) {
					result += grid[row][colIndex];
				}
			}
		}

		return result;
	};

	const decryptADFGX = (text: string, square: string[][], transKey: string) => {
		const cleanText = text.toUpperCase().replace(/[^ADFGX]/g, '');
		const cleanTransKey = transKey.toUpperCase().replace(/[^A-Z]/g, '');
		
		const keyOrder = cleanTransKey.split('').map((char, index) => ({ char, index }))
			.sort((a, b) => a.char.localeCompare(b.char))
			.map((item, newIndex) => ({ ...item, newIndex }))
			.sort((a, b) => a.index - b.index)
			.map(item => item.newIndex);

		const cols = cleanTransKey.length;
		const rows = Math.ceil(cleanText.length / cols);
		
		// Calculate column lengths
		const colLengths = Array(cols).fill(Math.floor(cleanText.length / cols));
		for (let i = 0; i < cleanText.length % cols; i++) {
			const colIndex = keyOrder.indexOf(i);
			colLengths[colIndex]++;
		}

		// Fill columns by order
		const columns: string[] = Array(cols).fill('');
		let textIndex = 0;
		for (let order = 0; order < cols; order++) {
			const colIndex = keyOrder.indexOf(order);
			columns[colIndex] = cleanText.substr(textIndex, colLengths[colIndex]);
			textIndex += colLengths[colIndex];
		}

		// Reconstruct coordinates
		let coordinates = '';
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				if (row < columns[col].length) {
					coordinates += columns[col][row];
				}
			}
		}

		// Convert coordinates back to letters
		let result = '';
		for (let i = 0; i < coordinates.length; i += 2) {
			if (i + 1 < coordinates.length) {
				const row = adfgxLabels.indexOf(coordinates[i]);
				const col = adfgxLabels.indexOf(coordinates[i + 1]);
				if (row !== -1 && col !== -1) {
					result += square[row][col];
				}
			}
		}

		return result;
	};

	const handleConvert = () => {
		try {
			if (!input || !transKey) {
				setOutput("請輸入文字和轉置密鑰");
				return;
			}

			const square = key ? createSquareFromKey(key) : defaultSquare;
			
			if (mode === "encrypt") {
				const result = encryptADFGX(input, square, transKey);
				setOutput(result);
			} else {
				const result = decryptADFGX(input, square, transKey);
				setOutput(result);
			}
		} catch (error) {
			setOutput("轉換出錯: " + (error as Error).message);
		}
	};

	const handleClear = () => {
		setInput("");
		setOutput("");
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
							<h1 className="text-3xl font-bold text-black mb-4">
								ADFGX密碼工具
							</h1>
							<p className="text-black">
								德國在第一次世界大戰中使用的密碼系統，結合了替換和轉置
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
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										方陣密鑰 (25個字母，不含J)
									</label>
									<input
										type="text"
										value={key}
										onChange={(e) => setKey(e.target.value)}
										className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
										placeholder="PHQGIUMEAYLNOFDXKRCVSTZWB"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-black mb-2">
										轉置密鑰
									</label>
									<input
										type="text"
										value={transKey}
										onChange={(e) => setTransKey(e.target.value)}
										className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
										placeholder="SECRET"
									/>
								</div>
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
												: "請輸入要解密的密文..."
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

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								ADFGX密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									ADFGX密碼結合了5×5方陣替換和列轉置兩個步驟。
								</p>
								<p>
									<strong>步驟:</strong>{" "}
									1. 使用5×5方陣將字母轉換為ADFGX坐標；2. 使用轉置密鑰進行列轉置。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									只產生A、D、F、G、X五個字母，這些字母在摩斯電碼中不易混淆。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例方陣:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>　 A D F G X</div>
										<div>A P H Q G I</div>
										<div>D U M E A Y</div>
										<div>F L N O F D</div>
										<div>G X K R C V</div>
										<div>X S T Z W B</div>
									</div>
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