"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PunycodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	// Simple Punycode implementation
	const punycodeEncode = (text: string) => {
		try {
			// Use browser's built-in URL API for punycode
			const url = new URL(`http://${text}.com`);
			const encoded = url.hostname.replace('.com', '');
			return encoded;
		} catch {
			// Fallback: manual implementation for non-domain strings
			let result = '';
			let hasNonASCII = false;
			
			// Check for non-ASCII characters
			for (const char of text) {
				if (char.charCodeAt(0) > 127) {
					hasNonASCII = true;
					break;
				}
			}
			
			if (!hasNonASCII) {
				return text; // No encoding needed for pure ASCII
			}
			
			// Extract ASCII characters first
			const ascii = text.split('').filter(c => c.charCodeAt(0) <= 127).join('');
			result = ascii;
			
			if (ascii.length > 0) {
				result += '-';
			}
			
			// Add 'xn--' prefix for internationalized domains
			result = 'xn--' + result;
			
			// Simplified encoding (actual Punycode is much more complex)
			const nonASCII = text.split('').filter(c => c.charCodeAt(0) > 127);
			for (const char of nonASCII) {
				result += char.charCodeAt(0).toString(36);
			}
			
			return result;
		}
	};

	const punycodeDecode = (text: string) => {
		try {
			// Handle domain format
			if (text.includes('.')) {
				const url = new URL(`http://${text}`);
				return url.hostname;
			}
			
			// Handle xn-- format
			if (text.startsWith('xn--')) {
				// Remove xn-- prefix
				let encoded = text.substring(4);
				
				// Find the delimiter
				const delimiterIndex = encoded.lastIndexOf('-');
				let ascii = '';
				let encodedPart = encoded;
				
				if (delimiterIndex > 0) {
					ascii = encoded.substring(0, delimiterIndex);
					encodedPart = encoded.substring(delimiterIndex + 1);
				}
				
				// Decode the non-ASCII part (simplified)
				let result = ascii;
				const codes = encodedPart.match(/.{1,2}/g) || [];
				for (const code of codes) {
					const charCode = parseInt(code, 36);
					if (charCode > 127) {
						result += String.fromCharCode(charCode);
					}
				}
				
				return result;
			}
			
			return text; // Return as-is if not encoded
		} catch (error) {
			return "解碼失敗: " + (error as Error).message;
		}
	};

	const handleConvert = () => {
		try {
			if (!input) {
				setOutput("請輸入文字或域名");
				return;
			}

			if (mode === "encode") {
				const result = punycodeEncode(input);
				setOutput(result);
			} else {
				const result = punycodeDecode(input);
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
								Punycode工具
							</h1>
							<p className="text-black">
								國際化域名編碼，將Unicode字符轉換為ASCII兼容格式
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
										輸入 ({mode === "encode" ? "Unicode文本/域名" : "Punycode"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入包含Unicode字符的文本或域名..."
												: "請輸入要解碼的Punycode..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "Punycode" : "Unicode文本"})
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

						{/* Examples */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-semibold text-black mb-4">示例</h3>
							<div className="space-y-3 text-sm">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h4 className="font-medium text-black mb-2">中文域名</h4>
										<div className="bg-gray-50 p-3 rounded font-mono text-xs">
											<div>原文: 中国.com</div>
											<div>編碼: xn--fiq228c.com</div>
										</div>
									</div>
									<div>
										<h4 className="font-medium text-black mb-2">日文域名</h4>
										<div className="bg-gray-50 p-3 rounded font-mono text-xs">
											<div>原文: 日本.jp</div>
											<div>編碼: xn--wgbl6a.jp</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								Punycode說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									將Unicode字符編碼為ASCII兼容的格式，用於國際化域名系統(IDN)。
								</p>
								<p>
									<strong>格式:</strong>{" "}
									以"xn--"開頭，後跟編碼後的ASCII字符串。
								</p>
								<p>
									<strong>用途:</strong>{" "}
									允許使用非英文字符作為域名，如中文、日文、阿拉伯文等。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>編碼規則:</strong>
									</p>
									<div className="text-xs mt-2">
										<div>1. 提取ASCII字符作為基礎部分</div>
										<div>2. 如果有ASCII字符，添加分隔符"-"</div>
										<div>3. 編碼非ASCII字符並追加</div>
										<div>4. 添加"xn--"前綴標識</div>
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