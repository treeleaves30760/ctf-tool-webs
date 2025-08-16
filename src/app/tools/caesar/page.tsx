"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CaesarTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [shift, setShift] = useState(3);
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
	const [preserveCase, setPreserveCase] = useState(true);
	const [allPossible, setAllPossible] = useState("");

	const caesarCipher = (
		text: string,
		shift: number,
		encrypt: boolean = true
	) => {
		const actualShift = encrypt ? shift : -shift;
		return text.replace(/[a-zA-Z]/g, (char) => {
			const start = char >= "a" ? 97 : 65;
			const code = char.charCodeAt(0);
			const shifted = (((code - start + actualShift) % 26) + 26) % 26;
			return String.fromCharCode(start + shifted);
		});
	};

	const handleConvert = () => {
		try {
			const result = caesarCipher(input, shift, mode === "encrypt");
			setOutput(result);
		} catch (error) {
			setOutput("轉換出錯: " + (error as Error).message);
		}
	};

	const generateAllPossible = () => {
		if (!input) return;

		let results = "";
		for (let i = 0; i < 26; i++) {
			const result = caesarCipher(input, i, false);
			results += `偏移量 ${i.toString().padStart(2, "0")}: ${result}\n`;
		}
		setAllPossible(results);
	};

	const handleClear = () => {
		setInput("");
		setOutput("");
		setAllPossible("");
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(output);
	};

	const handleCopyAll = () => {
		navigator.clipboard.writeText(allPossible);
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
								凱薩密碼工具
							</h1>
							<p className="text-black">
								經典的字母替換密碼，通過固定的字母偏移進行加密
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
										偏移量:
									</label>
									<input
										type="number"
										value={shift}
										onChange={(e) => setShift(Number(e.target.value))}
										min="0"
										max="25"
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm w-20 focus:ring-teal-500 focus:border-teal-500"
									/>
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="preserveCase"
										checked={preserveCase}
										onChange={(e) => setPreserveCase(e.target.checked)}
										className="bg-white text-teal-600 focus:ring-teal-500"
									/>
									<label
										htmlFor="preserveCase"
										className="text-sm font-medium text-black"
									>
										保持大小寫
									</label>
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
									onClick={generateAllPossible}
									disabled={!input}
									className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									暴力破解
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

						{/* Brute Force Results */}
						{allPossible && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-black">
										所有可能的解密結果
									</h3>
									<button
										onClick={handleCopyAll}
										className="text-sm border border-gray-300 text-black px-4 py-1 rounded-md hover:bg-gray-50 transition-colors"
									>
										複製全部
									</button>
								</div>
								<pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
									{allPossible}
								</pre>
							</div>
						)}

						{/* Information */}
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-yellow-900 mb-3">
								凱薩密碼說明
							</h3>
							<div className="text-yellow-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									凱薩密碼是一種簡單的字母替換密碼，通過將字母按照固定偏移量進行移位。
								</p>
								<p>
									<strong>歷史:</strong>{" "}
									據說凱薩大帝使用偏移量為3的密碼來保護軍事通訊。
								</p>
								<p>
									<strong>破解:</strong>{" "}
									由於只有25種可能的偏移量，可以通過暴力破解輕鬆解密。
								</p>
								<div className="bg-yellow-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<p className="text-sm">明文: HELLO</p>
									<p className="text-sm">偏移3: KHOOR</p>
									<p className="text-sm">偏移13(ROT13): URYYB</p>
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
