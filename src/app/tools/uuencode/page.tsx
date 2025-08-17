"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function UUEncodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");
	const [filename, setFilename] = useState("file.txt");

	const uuEncode = (data: string, filename: string) => {
		const bytes = new TextEncoder().encode(data);
		let result = `begin 644 ${filename}\n`;
		
		for (let i = 0; i < bytes.length; i += 45) {
			const chunk = bytes.slice(i, i + 45);
			const lineLength = chunk.length;
			
			// Encode line length
			let line = String.fromCharCode(lineLength + 32);
			
			// Encode data in groups of 3 bytes
			for (let j = 0; j < chunk.length; j += 3) {
				const byte1 = chunk[j] || 0;
				const byte2 = chunk[j + 1] || 0;
				const byte3 = chunk[j + 2] || 0;
				
				const combined = (byte1 << 16) | (byte2 << 8) | byte3;
				
				line += String.fromCharCode(((combined >> 18) & 0x3F) + 32);
				line += String.fromCharCode(((combined >> 12) & 0x3F) + 32);
				line += String.fromCharCode(((combined >> 6) & 0x3F) + 32);
				line += String.fromCharCode((combined & 0x3F) + 32);
			}
			
			result += line + '\n';
		}
		
		result += '`\nend\n';
		return result;
	};

	const uuDecode = (data: string) => {
		try {
			const lines = data.split('\n');
			let result = new Uint8Array(0);
			let inData = false;
			
			for (const line of lines) {
				if (line.startsWith('begin ')) {
					inData = true;
					continue;
				}
				if (line === 'end' || line === '`') {
					break;
				}
				if (!inData || line.length === 0) {
					continue;
				}
				
				const lineLength = line.charCodeAt(0) - 32;
				if (lineLength === 0) continue;
				
				const decodedLine = new Uint8Array(lineLength);
				let outIndex = 0;
				
				for (let i = 1; i < line.length && outIndex < lineLength; i += 4) {
					const char1 = (line.charCodeAt(i) - 32) & 0x3F;
					const char2 = (line.charCodeAt(i + 1) - 32) & 0x3F;
					const char3 = (line.charCodeAt(i + 2) - 32) & 0x3F;
					const char4 = (line.charCodeAt(i + 3) - 32) & 0x3F;
					
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
			throw new Error('UUDecode解碼失敗: ' + (error as Error).message);
		}
	};

	const handleConvert = () => {
		try {
			if (!input) {
				setOutput("請輸入文字");
				return;
			}

			if (mode === "encode") {
				const result = uuEncode(input, filename);
				setOutput(result);
			} else {
				const result = uuDecode(input);
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
								UUEncode工具
							</h1>
							<p className="text-black">
								Unix-to-Unix編碼，將二進制文件轉換為ASCII文本傳輸
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
										輸入 ({mode === "encode" ? "原始文本" : "UUEncode文本"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文本..."
												: "請輸入要解碼的UUEncode文本..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "UUEncode文本" : "原始文本"})
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
								UUEncode說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									將二進制數據轉換為ASCII字符，用於在文本協議上傳輸文件。
								</p>
								<p>
									<strong>格式:</strong>{" "}
									以"begin"開頭，包含權限和文件名，以"end"結尾。
								</p>
								<p>
									<strong>歷史:</strong>{" "}
									早期Unix系統用於通過UUCP協議傳輸文件的標準方法。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>格式示例:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>begin 644 hello.txt</div>
										<div>+2&5L;&\@=V]R;&0@</div>
										<div>`</div>
										<div>end</div>
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