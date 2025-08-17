"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function KeywordTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [keyword, setKeyword] = useState("SECRET");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	const createKeywordAlphabet = (keyword: string) => {
		const cleanKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
		const uniqueChars = [...new Set(cleanKeyword)];
		
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const remaining = alphabet.split('').filter(c => !uniqueChars.includes(c));
		
		return [...uniqueChars, ...remaining].join('');
	};

	const encryptKeyword = (text: string, keyword: string) => {
		const normalAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const keywordAlphabet = createKeywordAlphabet(keyword);
		
		return text.toUpperCase().split('').map(char => {
			const index = normalAlphabet.indexOf(char);
			return index !== -1 ? keywordAlphabet[index] : char;
		}).join('');
	};

	const decryptKeyword = (text: string, keyword: string) => {
		const normalAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const keywordAlphabet = createKeywordAlphabet(keyword);
		
		return text.toUpperCase().split('').map(char => {
			const index = keywordAlphabet.indexOf(char);
			return index !== -1 ? normalAlphabet[index] : char;
		}).join('');
	};

	const handleConvert = () => {
		try {
			if (!input || !keyword) {
				setOutput("請輸入文字和關鍵字");
				return;
			}

			if (mode === "encrypt") {
				const result = encryptKeyword(input, keyword);
				setOutput(result);
			} else {
				const result = decryptKeyword(input, keyword);
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

	const normalAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const keywordAlphabet = keyword ? createKeywordAlphabet(keyword) : normalAlphabet;

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						{/* Header */}
						<div className="text-center mb-8 bg-white p-4 rounded-lg">
							<h1 className="text-3xl font-bold text-black mb-4">
								關鍵字密碼工具
							</h1>
							<p className="text-black">
								使用關鍵字生成替換字母表的單字母替換密碼
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
									關鍵字
								</label>
								<input
									type="text"
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
									placeholder="SECRET"
								/>
							</div>

							{/* Alphabet Display */}
							<div className="mb-6 bg-gray-50 p-4 rounded-lg">
								<h4 className="text-sm font-medium text-black mb-2">替換字母表:</h4>
								<div className="font-mono text-xs space-y-1">
									<div className="text-gray-600">
										原始: {normalAlphabet.split('').join(' ')}
									</div>
									<div className="text-black">
										替換: {keywordAlphabet.split('').join(' ')}
									</div>
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
								關鍵字密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									使用關鍵字生成替換字母表，每個明文字母對應一個固定的密文字母。
								</p>
								<p>
									<strong>步驟:</strong>{" "}
									1. 將關鍵字去重後放在字母表開頭；2. 剩餘字母按順序排列；3. 建立明文與密文的對應關係。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									比凱撒密碼更安全，但仍是單字母替換，可以通過頻率分析破解。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong> 關鍵字"SECRET"
									</p>
									<div className="font-mono text-xs mt-2">
										<div>原始: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</div>
										<div>替換: S E C R T A B D F G H I J K L M N O P U Q V W X Y Z</div>
										<div className="mt-1">A→S, B→E, C→C, D→R, E→T...</div>
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