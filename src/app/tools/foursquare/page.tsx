"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FoursquareTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key1, setKey1] = useState("EXAMPLE");
	const [key2, setKey2] = useState("KEYWORD");
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

	const getPlaintextSquare = () => {
		const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
		const square = [];
		for (let i = 0; i < 5; i++) {
			square.push(alphabet.slice(i * 5, (i + 1) * 5).split(''));
		}
		return square;
	};

	const findPosition = (char: string, square: string[][]) => {
		for (let row = 0; row < 5; row++) {
			for (let col = 0; col < 5; col++) {
				if (square[row][col] === char) {
					return { row, col };
				}
			}
		}
		return null;
	};

	const encryptFoursquare = (text: string, key1: string, key2: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
		
		// Ensure even length by adding X if necessary
		const paddedText = cleanText.length % 2 === 0 ? cleanText : cleanText + 'X';
		
		const plaintextSquare = getPlaintextSquare();
		const cipherSquare1 = createSquareFromKey(key1);
		const cipherSquare2 = createSquareFromKey(key2);
		
		let result = '';
		
		for (let i = 0; i < paddedText.length; i += 2) {
			const char1 = paddedText[i];
			const char2 = paddedText[i + 1];
			
			const pos1 = findPosition(char1, plaintextSquare);
			const pos2 = findPosition(char2, plaintextSquare);
			
			if (pos1 && pos2) {
				// Use opposite corners of the rectangle
				result += cipherSquare1[pos1.row][pos2.col];
				result += cipherSquare2[pos2.row][pos1.col];
			}
		}
		
		return result;
	};

	const decryptFoursquare = (text: string, key1: string, key2: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		
		const plaintextSquare = getPlaintextSquare();
		const cipherSquare1 = createSquareFromKey(key1);
		const cipherSquare2 = createSquareFromKey(key2);
		
		let result = '';
		
		for (let i = 0; i < cleanText.length; i += 2) {
			const char1 = cleanText[i];
			const char2 = cleanText[i + 1];
			
			const pos1 = findPosition(char1, cipherSquare1);
			const pos2 = findPosition(char2, cipherSquare2);
			
			if (pos1 && pos2) {
				// Use opposite corners of the rectangle
				result += plaintextSquare[pos1.row][pos2.col];
				result += plaintextSquare[pos2.row][pos1.col];
			}
		}
		
		return result;
	};

	const handleConvert = () => {
		try {
			if (!input || !key1 || !key2) {
				setOutput("請輸入文字和兩個密鑰");
				return;
			}

			if (mode === "encrypt") {
				const result = encryptFoursquare(input, key1, key2);
				setOutput(result);
			} else {
				const result = decryptFoursquare(input, key1, key2);
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
								四方密碼工具
							</h1>
							<p className="text-black">
								使用四個5×5方陣的替換密碼，安全性比普通替換密碼更高
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
										密鑰1 (左上方陣)
									</label>
									<input
										type="text"
										value={key1}
										onChange={(e) => setKey1(e.target.value)}
										className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
										placeholder="EXAMPLE"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-black mb-2">
										密鑰2 (右下方陣)
									</label>
									<input
										type="text"
										value={key2}
										onChange={(e) => setKey2(e.target.value)}
										className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
										placeholder="KEYWORD"
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
								四方密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									使用四個5×5方陣：兩個明文方陣(相同)和兩個密文方陣(不同)。
								</p>
								<p>
									<strong>步驟:</strong>{" "}
									1. 將明文按雙字母分組；2. 在方陣中找到字母對角位置；3. 用密文方陣對應位置的字母替換。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									雙字母替換使得頻率分析更加困難，安全性比單字母替換高。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>方陣配置:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>密文1    明文1</div>
										<div>明文2    密文2</div>
										<div className="mt-2">每個字母對在矩形的對角位置進行替換</div>
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