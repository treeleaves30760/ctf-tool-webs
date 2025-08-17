"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function XXEncodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");
	const [filename, setFilename] = useState("file.txt");

	const xxCharset = "+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	const xxEncode = (data: string, filename: string) => {
		const bytes = new TextEncoder().encode(data);
		let result = `begin 644 ${filename}\n`;
		
		for (let i = 0; i < bytes.length; i += 45) {
			const chunk = bytes.slice(i, i + 45);
			const lineLength = chunk.length;
			
			// Encode line length using xxencode charset
			let line = xxCharset[lineLength];
			
			// Encode data in groups of 3 bytes
			for (let j = 0; j < chunk.length; j += 3) {
				const byte1 = chunk[j] || 0;
				const byte2 = chunk[j + 1] || 0;
				const byte3 = chunk[j + 2] || 0;
				
				const combined = (byte1 << 16) | (byte2 << 8) | byte3;
				
				line += xxCharset[(combined >> 18) & 0x3F];
				line += xxCharset[(combined >> 12) & 0x3F];
				line += xxCharset[(combined >> 6) & 0x3F];
				line += xxCharset[combined & 0x3F];
			}
			
			result += line + '\n';
		}
		
		result += '+-\nend\n';
		return result;
	};

	const xxDecode = (data: string) => {
		try {
			const lines = data.split('\n');
			let result = new Uint8Array(0);
			let inData = false;
			
			for (const line of lines) {
				if (line.startsWith('begin ')) {
					inData = true;
					continue;
				}
				if (line === 'end' || line === '+-') {
					break;
				}
				if (!inData || line.length === 0) {
					continue;
				}
				
				const lineLength = xxCharset.indexOf(line[0]);
				if (lineLength < 0) continue;
				
				const decodedLine = new Uint8Array(lineLength);
				let outIndex = 0;
				
				for (let i = 1; i < line.length && outIndex < lineLength; i += 4) {
					const char1 = xxCharset.indexOf(line[i]);
					const char2 = xxCharset.indexOf(line[i + 1]);
					const char3 = xxCharset.indexOf(line[i + 2]);
					const char4 = xxCharset.indexOf(line[i + 3]);
					
					if (char1 < 0 || char2 < 0 || char3 < 0 || char4 < 0) continue;
					
					const combined = (char1 << 18) | (char2 << 12) | (char3 << 6) | char4;
					
					if (outIndex < lineLength) decodedLine[outIndex++] = (combined >> 16) & 0xFF;
					if (outIndex < lineLength) decodedLine[outIndex++] = (combined >> 8) & 0xFF;
					if (outIndex < lineLength) decodedLine[outIndex++] = combined & 0xFF;
				}
				
				const newResult = new Uint8Array(result.length + decodedLine.length);
				newResult.set(result);
				newResult.set(decodedLine, result.length);
				result = newResult;
			}
			
			return new TextDecoder().decode(result);
		} catch (error) {
			throw new Error('XXDecode解碼失敗: ' + (error as Error).message);
		}
	};

	const handleConvert = () => {
		try {
			if (!input) {
				setOutput("請輸入文字");
				return;
			}

			if (mode === "encode") {
				const result = xxEncode(input, filename);
				setOutput(result);
			} else {
				const result = xxDecode(input);
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
								XXEncode工具
							</h1>
							<p className="text-black">
								UUEncode的改進版本，使用更安全的字符集避免傳輸問題
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
								{mode === "encode" && (
									<div className="flex items-center space-x-2">
										<label className="text-sm font-medium text-black">
											文件名:
										</label>
										<input
											type="text"
											value={filename}
											onChange={(e) => setFilename(e.target.value)}
											className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
											placeholder="file.txt"
										/>
									</div>
								)}
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "encode" ? "原始文本" : "XXEncode文本"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文本..."
												: "請輸入要解碼的XXEncode文本..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "XXEncode文本" : "原始文本"})
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

						{/* Character Set Display */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-semibold text-black mb-4">XXEncode字符集</h3>
							<div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
								{xxCharset}
							</div>
							<p className="text-xs text-gray-600 mt-2">
								64個字符：+ - 數字0-9 大寫字母A-Z 小寫字母a-z
							</p>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								XXEncode說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									UUEncode的改進版本，使用更安全的字符集避免傳輸過程中的字符轉換問題。
								</p>
								<p>
									<strong>優勢:</strong>{" "}
									避免使用容易被誤解的字符（如空格、引號等），提高傳輸可靠性。
								</p>
								<p>
									<strong>用途:</strong>{" "}
									主要用於Usenet新聞組和早期電子郵件系統的二進制文件傳輸。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>與UUEncode的區別:</strong>
									</p>
									<div className="text-xs mt-2">
										<div>• 使用64個安全字符而非ASCII 32-95範圍</div>
										<div>• 避免空格、引號等問題字符</div>
										<div>• 結束標記為"+-"而非空格加反引號</div>
										<div>• 更適合通過各種網絡協議傳輸</div>
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