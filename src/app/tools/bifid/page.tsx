"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BifidTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key, setKey] = useState("PLAYFIREXAMBL");
	const [period, setPeriod] = useState(5);
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	const createSquareFromKey = (key: string) => {
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
		const uniqueChars = [...new Set(cleanKey)];
		
		const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // No J
		const remaining = alphabet.split('').filter(c => !uniqueChars.includes(c));
		
		const fullKey = [...uniqueChars, ...remaining].slice(0, 25);
		
		const square = [];
		for (let i = 0; i < 5; i++) {
			square.push(fullKey.slice(i * 5, (i + 1) * 5));
		}
		return square;
	};

	const bifidEncrypt = (text: string, square: string[][], period: number) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
		
		let result = '';
		
		for (let start = 0; start < cleanText.length; start += period) {
			const block = cleanText.slice(start, start + period);
			const rows: number[] = [];
			const cols: number[] = [];
			
			// Get coordinates for each character
			for (const char of block) {
				for (let r = 0; r < 5; r++) {
					for (let c = 0; c < 5; c++) {
						if (square[r][c] === char) {
							rows.push(r);
							cols.push(c);
							break;
						}
					}
				}
			}
			
			// Combine rows and columns
			const combined = [...rows, ...cols];
			
			// Convert back to characters
			for (let i = 0; i < combined.length; i += 2) {
				if (i + 1 < combined.length) {
					result += square[combined[i]][combined[i + 1]];
				}
			}
		}
		
		return result;
	};

	const bifidDecrypt = (text: string, square: string[][], period: number) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
		
		let result = '';
		
		for (let start = 0; start < cleanText.length; start += period) {
			const block = cleanText.slice(start, start + period);
			const coordinates: number[] = [];
			
			// Get coordinates for each character
			for (const char of block) {
				for (let r = 0; r < 5; r++) {
					for (let c = 0; c < 5; c++) {
						if (square[r][c] === char) {
							coordinates.push(r, c);
							break;
						}
					}
				}
			}
			
			// Split coordinates back into rows and columns
			const mid = coordinates.length / 2;
			const rows = coordinates.slice(0, mid);
			const cols = coordinates.slice(mid);
			
			// Convert back to characters
			for (let i = 0; i < rows.length; i++) {
				result += square[rows[i]][cols[i]];
			}
		}
		
		return result;
	};

	const handleConvert = () => {
		try {
			if (!input) {
				setOutput("請輸入文字");
				return;
			}

			const square = createSquareFromKey(key);
			
			if (mode === "encrypt") {
				const result = bifidEncrypt(input, square, period);
				setOutput(result);
			} else {
				const result = bifidDecrypt(input, square, period);
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
								雙密碼工具
							</h1>
							<p className="text-black">
								使用5×5方陣的分組替換密碼，將字母轉換為坐標後重新組合
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
										週期:
									</label>
									<input
										type="number"
										value={period}
										onChange={(e) => setPeriod(Number(e.target.value))}
										min="1"
										max="20"
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm w-20 focus:ring-teal-500 focus:border-teal-500"
									/>
								</div>

								<div className="flex items-center space-x-2">
									<label className="text-sm font-medium text-black">
										密鑰:
									</label>
									<input
										type="text"
										value={key}
										onChange={(e) => setKey(e.target.value)}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
										placeholder="PLAYFIREXAMBL"
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
						<div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-purple-900 mb-3">
								雙密碼說明
							</h3>
							<div className="text-purple-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									雙密碼使用5×5方陣，將每個字母轉換為行列坐標，然後重新組合。
								</p>
								<p>
									<strong>步驟:</strong>{" "}
									1. 將明文按週期分組；2. 轉換為坐標；3. 重新排列坐標；4. 轉回字母。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									週期長度影響安全性，較短的週期更容易被破解。
								</p>
								<div className="bg-purple-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<p className="text-sm">明文: HELLO (週期5)</p>
									<p className="text-sm">坐標: (2,2)(1,0)(2,1)(2,1)(3,2)</p>
									<p className="text-sm">重組: 22122 01132</p>
									<p className="text-sm">密文: OCMPW</p>
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