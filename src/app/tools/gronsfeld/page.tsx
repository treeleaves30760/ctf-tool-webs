"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GronsfeldTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key, setKey] = useState("12345");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	const encryptGronsfeld = (text: string, key: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.replace(/[^0-9]/g, '');
		
		if (!cleanKey) return text;

		let result = '';
		let keyIndex = 0;
		
		for (const char of cleanText) {
			const charCode = char.charCodeAt(0) - 65; // A=0, B=1, etc.
			const keyDigit = parseInt(cleanKey[keyIndex % cleanKey.length]);
			const encryptedCharCode = (charCode + keyDigit) % 26;
			result += String.fromCharCode(encryptedCharCode + 65);
			keyIndex++;
		}
		
		return result;
	};

	const decryptGronsfeld = (text: string, key: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.replace(/[^0-9]/g, '');
		
		if (!cleanKey) return text;

		let result = '';
		let keyIndex = 0;
		
		for (const char of cleanText) {
			const charCode = char.charCodeAt(0) - 65; // A=0, B=1, etc.
			const keyDigit = parseInt(cleanKey[keyIndex % cleanKey.length]);
			const decryptedCharCode = (charCode - keyDigit + 26) % 26;
			result += String.fromCharCode(decryptedCharCode + 65);
			keyIndex++;
		}
		
		return result;
	};

	const handleConvert = () => {
		try {
			if (!input || !key) {
				setOutput("請輸入文字和數字密鑰");
				return;
			}

			if (!/^\d+$/.test(key.replace(/[^0-9]/g, ''))) {
				setOutput("密鑰必須包含數字");
				return;
			}

			if (mode === "encrypt") {
				const result = encryptGronsfeld(input, key);
				setOutput(result);
			} else {
				const result = decryptGronsfeld(input, key);
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
								格倫斯菲爾德密碼工具
							</h1>
							<p className="text-black">
								維吉尼亞密碼的變體，使用數字密鑰而非字母密鑰
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
									數字密鑰
								</label>
								<input
									type="text"
									value={key}
									onChange={(e) => setKey(e.target.value)}
									className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
									placeholder="12345"
								/>
								<p className="text-xs text-gray-500 mt-1">
									只能包含數字 0-9
								</p>
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
								格倫斯菲爾德密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									類似維吉尼亞密碼，但使用數字密鑰而非字母密鑰進行位移。
								</p>
								<p>
									<strong>步驟:</strong>{" "}
									1. 將明文字母轉換為數字(A=0,B=1...Z=25)；2. 加上對應的密鑰數字；3. 模26後轉回字母。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									比維吉尼亞密碼簡單，但密鑰空間較小，因為只使用0-9數字。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong> 密鑰"123"，明文"HELLO"
									</p>
									<div className="font-mono text-xs mt-2">
										<div>H(7) + 1 = I(8)</div>
										<div>E(4) + 2 = G(6)</div>
										<div>L(11) + 3 = O(14)</div>
										<div>L(11) + 1 = M(12)</div>
										<div>O(14) + 2 = Q(16)</div>
										<div>結果: IGOMQ</div>
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