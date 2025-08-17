"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RunKeyTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key, setKey] = useState("THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	const encryptRunKey = (text: string, key: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey) return text;
		if (cleanKey.length < cleanText.length) {
			return "密鑰長度不足，至少需要 " + cleanText.length + " 個字母";
		}

		let result = '';
		
		for (let i = 0; i < cleanText.length; i++) {
			const textChar = cleanText[i];
			const keyChar = cleanKey[i];
			
			const textValue = textChar.charCodeAt(0) - 65; // A=0, B=1, etc.
			const keyValue = keyChar.charCodeAt(0) - 65;
			
			const encryptedValue = (textValue + keyValue) % 26;
			result += String.fromCharCode(encryptedValue + 65);
		}
		
		return result;
	};

	const decryptRunKey = (text: string, key: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey) return text;
		if (cleanKey.length < cleanText.length) {
			return "密鑰長度不足，至少需要 " + cleanText.length + " 個字母";
		}

		let result = '';
		
		for (let i = 0; i < cleanText.length; i++) {
			const textChar = cleanText[i];
			const keyChar = cleanKey[i];
			
			const textValue = textChar.charCodeAt(0) - 65; // A=0, B=1, etc.
			const keyValue = keyChar.charCodeAt(0) - 65;
			
			const decryptedValue = (textValue - keyValue + 26) % 26;
			result += String.fromCharCode(decryptedValue + 65);
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
				const result = encryptRunKey(input, key);
				setOutput(result);
			} else {
				const result = decryptRunKey(input, key);
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

	const cleanInputLength = input.replace(/[^A-Za-z]/g, '').length;
	const cleanKeyLength = key.replace(/[^A-Za-z]/g, '').length;

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						{/* Header */}
						<div className="text-center mb-8 bg-white p-4 rounded-lg">
							<h1 className="text-3xl font-bold text-black mb-4">
								流密鑰密碼工具
							</h1>
							<p className="text-black">
								使用長密鑰文本的維吉尼亞密碼變體，密鑰不重複使用
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
									流密鑰 (長度: {cleanKeyLength})
								</label>
								<textarea
									value={key}
									onChange={(e) => setKey(e.target.value)}
									className="bg-white text-black w-full h-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
									placeholder="THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG"
								/>
								<p className="text-xs text-gray-500 mt-1">
									密鑰應該是長文本，不重複使用
								</p>
								{cleanInputLength > 0 && (
									<div className={`text-xs mt-1 ${cleanKeyLength >= cleanInputLength ? 'text-green-600' : 'text-red-600'}`}>
										輸入文字長度: {cleanInputLength}, 
										{cleanKeyLength >= cleanInputLength ? ' 密鑰長度足夠' : ` 還需要 ${cleanInputLength - cleanKeyLength} 個字母`}
									</div>
								)}
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "encrypt" ? "明文" : "密文"}) - 長度: {cleanInputLength}
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
								流密鑰密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									類似維吉尼亞密碼，但使用長密鑰文本且不重複使用密鑰。
								</p>
								<p>
									<strong>安全性:</strong>{" "}
									當密鑰是真正隨機且與明文等長時，這就是一次性密碼本，理論上不可破解。
								</p>
								<p>
									<strong>要求:</strong>{" "}
									密鑰長度必須大於等於明文長度，且每個密鑰只能使用一次。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong> 明文"HELLO"，密鑰"WORLD"
									</p>
									<div className="font-mono text-xs mt-2">
										<div>H(7) + W(22) = D(3) mod 26</div>
										<div>E(4) + O(14) = S(18) mod 26</div>
										<div>L(11) + R(17) = C(2) mod 26</div>
										<div>L(11) + L(11) = W(22) mod 26</div>
										<div>O(14) + D(3) = R(17) mod 26</div>
										<div>結果: DSCWR</div>
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