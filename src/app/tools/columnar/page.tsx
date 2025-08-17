"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ColumnarTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key, setKey] = useState("SECRET");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	const encryptColumnar = (text: string, key: string) => {
		const cleanText = text.replace(/[^A-Z]/gi, '').toUpperCase();
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey) return text;

		// Create column order based on alphabetical sorting of key
		const keyOrder = cleanKey.split('').map((char, index) => ({ char, index }))
			.sort((a, b) => a.char.localeCompare(b.char))
			.map((item, newIndex) => ({ ...item, newIndex }))
			.sort((a, b) => a.index - b.index)
			.map(item => item.newIndex);

		const cols = cleanKey.length;
		const rows = Math.ceil(cleanText.length / cols);
		
		// Fill grid row by row
		const grid: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));
		for (let i = 0; i < cleanText.length; i++) {
			const row = Math.floor(i / cols);
			const col = i % cols;
			grid[row][col] = cleanText[i];
		}

		// Read columns in order
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

	const decryptColumnar = (text: string, key: string) => {
		const cleanText = text.replace(/[^A-Z]/gi, '').toUpperCase();
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey) return text;

		const keyOrder = cleanKey.split('').map((char, index) => ({ char, index }))
			.sort((a, b) => a.char.localeCompare(b.char))
			.map((item, newIndex) => ({ ...item, newIndex }))
			.sort((a, b) => a.index - b.index)
			.map(item => item.newIndex);

		const cols = cleanKey.length;
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

		// Reconstruct text row by row
		let result = '';
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				if (row < columns[col].length) {
					result += columns[col][row];
				}
			}
		}

		return result;
	};

	const handleConvert = () => {
		try {
			if (!input || !key) {
				setOutput("請輸入文字和密鑰");
				return;
			}

			if (mode === "encrypt") {
				const result = encryptColumnar(input, key);
				setOutput(result);
			} else {
				const result = decryptColumnar(input, key);
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
								列轉置密碼工具
							</h1>
							<p className="text-black">
								經典的列轉置密碼，按密鑰字母順序重排列
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

							<div className="mb-6">
								<label className="block text-sm font-medium text-black mb-2">
									密鑰
								</label>
								<input
									type="text"
									value={key}
									onChange={(e) => setKey(e.target.value)}
									className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
									placeholder="SECRET"
								/>
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
								列轉置密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									將明文按行填入網格，然後按密鑰字母的字典順序讀取列。
								</p>
								<p>
									<strong>步驟:</strong>{" "}
									1. 將文字按行填入網格；2. 按密鑰字母順序對列編號；3. 按編號順序讀取列。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									純轉置密碼，字母頻率不變，但改變了字母位置關係。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong> 密鑰"SECRET"，明文"HELLO WORLD"
									</p>
									<div className="font-mono text-xs mt-2">
										<div>S E C R E T</div>
										<div>5 2 1 4 3 6</div>
										<div>H E L L O W</div>
										<div>O R L D</div>
										<div>讀取順序：C(1) E(2) E(3) R(4) S(5) T(6)</div>
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