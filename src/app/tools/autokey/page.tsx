"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AutokeyTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key, setKey] = useState("SECRET");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	const vigenereCipher = (text: string, key: string, encrypt: boolean = true) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey) return '';

		let result = '';
		let keyIndex = 0;

		for (const char of cleanText) {
			if (char >= 'A' && char <= 'Z') {
				const textCode = char.charCodeAt(0) - 65;
				const keyCode = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
				
				let resultCode;
				if (encrypt) {
					resultCode = (textCode + keyCode) % 26;
				} else {
					resultCode = (textCode - keyCode + 26) % 26;
				}
				
				result += String.fromCharCode(resultCode + 65);
				keyIndex++;
			}
		}

		return result;
	};

	const autokeyEncrypt = (text: string, key: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey || !cleanText) return '';

		// Create extended key: original key + plaintext
		const extendedKey = (cleanKey + cleanText).slice(0, cleanText.length);
		
		return vigenereCipher(cleanText, extendedKey, true);
	};

	const autokeyDecrypt = (text: string, key: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey || !cleanText) return '';

		let result = '';
		let currentKey = cleanKey;

		for (let i = 0; i < cleanText.length; i++) {
			const cipherChar = cleanText[i];
			const keyChar = currentKey[i % currentKey.length];
			
			const cipherCode = cipherChar.charCodeAt(0) - 65;
			const keyCode = keyChar.charCodeAt(0) - 65;
			
			const plainCode = (cipherCode - keyCode + 26) % 26;
			const plainChar = String.fromCharCode(plainCode + 65);
			
			result += plainChar;
			
			// Add decrypted character to key for next iteration
			if (i >= cleanKey.length - 1) {
				currentKey += plainChar;
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

			let result;
			if (mode === "encrypt") {
				result = autokeyEncrypt(input, key);
			} else {
				result = autokeyDecrypt(input, key);
			}
			setOutput(result);
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
								自動密鑰密碼工具
							</h1>
							<p className="text-black">
								維吉尼亞密碼的改進版本，使用明文本身作為密鑰的一部分
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
										密鑰:
									</label>
									<input
										type="text"
										value={key}
										onChange={(e) => setKey(e.target.value)}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
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
						<div className="bg-green-50 border border-green-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-green-900 mb-3">
								自動密鑰密碼說明
							</h3>
							<div className="text-green-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									自動密鑰密碼是維吉尼亞密碼的改進版本，使用明文本身來擴展密鑰。
								</p>
								<p>
									<strong>優勢:</strong>{" "}
									相比維吉尼亞密碼，不會重複使用密鑰，更難被頻率分析破解。
								</p>
								<p>
									<strong>密鑰擴展:</strong>{" "}
									密鑰 = 原始密鑰 + 明文，使每個字母都有不同的加密方式。
								</p>
								<div className="bg-green-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<p className="text-sm">明文: ATTACKATDAWN</p>
									<p className="text-sm">原始密鑰: SECRET</p>
									<p className="text-sm">擴展密鑰: SECRETATTACK</p>
									<p className="text-sm">密文: SWJSWDUWASGO</p>
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