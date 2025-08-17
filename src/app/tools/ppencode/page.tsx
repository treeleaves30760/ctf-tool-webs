"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PPEncodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	const ppEncode = (text: string) => {
		// PPEncode uses Perl syntax to encode text
		const chars = text.split('');
		let result = '';
		
		for (let i = 0; i < chars.length; i++) {
			const char = chars[i];
			const ascii = char.charCodeAt(0);
			
			// Convert to Perl chr() function calls
			if (ascii >= 32 && ascii <= 126) {
				result += `chr(${ascii}).`;
			} else {
				result += `chr(${ascii}).`;
			}
		}
		
		// Remove trailing dot and wrap in Perl print statement
		result = result.slice(0, -1);
		return `print ${result}`;
	};

	const ppDecode = (text: string) => {
		try {
			// Extract chr() calls
			const chrMatches = text.match(/chr\((\d+)\)/g);
			if (!chrMatches) {
				return "不是有效的PPEncode格式";
			}
			
			let decoded = '';
			chrMatches.forEach(match => {
				const num = match.match(/\d+/);
				if (num) {
					const charCode = parseInt(num[0]);
					decoded += String.fromCharCode(charCode);
				}
			});
			
			return decoded || "解碼失敗";
		} catch (error) {
			return "解碼失敗: " + (error as Error).message;
		}
	};

	const handleConvert = () => {
		try {
			if (!input) {
				setOutput("請輸入文字");
				return;
			}

			if (mode === "encode") {
				const result = ppEncode(input);
				setOutput(result);
			} else {
				const result = ppDecode(input);
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
								PPEncode工具
							</h1>
							<p className="text-black">
								將文本編碼為Perl的chr()函數調用形式
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
											setMode(e.target.value as "encode" | "decode")
										}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value="encode">編碼</option>
										<option value="decode">解碼</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "encode" ? "原始文本" : "PPEncode代碼"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文本..."
												: "請輸入要解碼的PPEncode代碼..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "PPEncode代碼" : "原始文本"})
									</label>
									<textarea
										value={output}
										readOnly
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono"
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
									{mode === "encode" ? "編碼" : "解碼"}
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
								PPEncode說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									將每個字符轉換為Perl的chr()函數調用，通過ASCII碼值重構字符。
								</p>
								<p>
									<strong>格式:</strong>{" "}
									print chr(72).chr(101).chr(108).chr(108).chr(111)
								</p>
								<p>
									<strong>用途:</strong>{" "}
									Perl代碼混淆、繞過檢測、CTF競賽等場景。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>原文: "Hello"</div>
										<div>編碼: print chr(72).chr(101).chr(108).chr(108).chr(111)</div>
										<div>H=72, e=101, l=108, l=108, o=111</div>
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