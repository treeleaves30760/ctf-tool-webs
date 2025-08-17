"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BeaufortTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key, setKey] = useState("SECRET");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
	const [variant, setVariant] = useState<"standard" | "german">("standard");

	const beaufortCipher = (text: string, key: string, isGerman: boolean = false) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey || !cleanText) return '';

		let result = '';
		
		for (let i = 0; i < cleanText.length; i++) {
			const textChar = cleanText[i];
			const keyChar = cleanKey[i % cleanKey.length];
			
			const textCode = textChar.charCodeAt(0) - 65;
			const keyCode = keyChar.charCodeAt(0) - 65;
			
			let resultCode;
			if (isGerman) {
				// German Beaufort: C = K - P (mod 26)
				resultCode = (keyCode - textCode + 26) % 26;
			} else {
				// Standard Beaufort: C = K - P (mod 26) 
				resultCode = (keyCode - textCode + 26) % 26;
			}
			
			result += String.fromCharCode(resultCode + 65);
		}

		return result;
	};

	const handleConvert = () => {
		try {
			if (!input || !key) {
				setOutput("請輸入文字和密鑰");
				return;
			}

			// Beaufort cipher is reciprocal - same operation for encrypt/decrypt
			const result = beaufortCipher(input, key, variant === "german");
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
								博福特密碼工具
							</h1>
							<p className="text-black">
								以法國海軍上將博福特命名的對稱密碼系統
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
										變體:
									</label>
									<select
										value={variant}
										onChange={(e) =>
											setVariant(e.target.value as "standard" | "german")
										}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value="standard">標準博福特</option>
										<option value="german">德式博福特</option>
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
						<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-indigo-900 mb-3">
								博福特密碼說明
							</h3>
							<div className="text-indigo-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									博福特密碼使用公式 C = K - P (mod 26) 進行加密，是對稱密碼。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									加密和解密使用相同的操作，這使得它既簡單又實用。
								</p>
								<p>
									<strong>歷史:</strong>{" "}
									以法國海軍上將弗朗西斯·博福特的名字命名，他制定了博福特風級。
								</p>
								<div className="bg-indigo-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>公式:</strong>
									</p>
									<p className="text-sm">加密/解密: C = K - P (mod 26)</p>
									<p className="text-sm">其中 K = 密鑰字母, P = 明文字母, C = 密文字母</p>
									<p className="text-sm mt-2">
										<strong>示例:</strong> 明文 "HELLO" + 密鑰 "KEY" = 密文 "ADRNI"
									</p>
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