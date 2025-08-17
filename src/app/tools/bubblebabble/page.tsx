"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BubbleBabbleTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	const vowels = 'aeiouy';
	const consonants = 'bcdfghklmnpqrstvzx';

	const bubbleBabbleEncode = (data: string) => {
		const bytes = new TextEncoder().encode(data);
		let checksum = 1;
		let result = 'x';
		
		for (let i = 0; i < bytes.length; i += 2) {
			const byte1 = bytes[i];
			const byte2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
			
			const a = ((byte1 >> 6) & 3) + checksum;
			const b = (byte1 >> 2) & 15;
			const c = ((byte1 & 3) + (checksum / 6)) & 15;
			
			result += vowels[a % 6];
			result += consonants[b];
			result += vowels[c];
			
			if (i + 1 < bytes.length) {
				const d = (byte2 >> 4) & 15;
				const e = byte2 & 15;
				
				result += consonants[d];
				result += '-';
				result += consonants[e];
			}
			
			checksum = (checksum * 5 + byte1 * 7 + byte2) % 36;
		}
		
		result += 'x';
		return result;
	};

	const bubbleBableDecode = (babble: string) => {
		try {
			if (!babble.startsWith('x') || !babble.endsWith('x')) {
				throw new Error('BubbleBabble must start and end with x');
			}
			
			babble = babble.slice(1, -1); // Remove x from start and end
			const parts = babble.split('-');
			const bytes: number[] = [];
			let checksum = 1;
			
			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				if (part.length < 3) continue;
				
				const a = vowels.indexOf(part[0]);
				const b = consonants.indexOf(part[1]);
				const c = vowels.indexOf(part[2]);
				
				if (a === -1 || b === -1 || c === -1) {
					throw new Error('Invalid BubbleBabble character');
				}
				
				let byte1 = ((a - checksum + 6) % 6) << 6;
				byte1 |= b << 2;
				byte1 |= (c - Math.floor(checksum / 6) + 16) % 16;
				
				bytes.push(byte1 & 0xFF);
				
				if (part.length >= 6) {
					const d = consonants.indexOf(part[3]);
					const e = consonants.indexOf(part[5]);
					
					if (d === -1 || e === -1) {
						throw new Error('Invalid BubbleBabble character');
					}
					
					const byte2 = (d << 4) | e;
					bytes.push(byte2);
					
					checksum = (checksum * 5 + byte1 * 7 + byte2) % 36;
				} else {
					checksum = (checksum * 5 + byte1 * 7) % 36;
				}
			}
			
			return new TextDecoder().decode(new Uint8Array(bytes));
		} catch (error) {
			throw new Error('解碼失敗: ' + (error as Error).message);
		}
	};

	const handleConvert = () => {
		try {
			if (!input) {
				setOutput("請輸入文字");
				return;
			}

			if (mode === "encode") {
				const result = bubbleBabbleEncode(input);
				setOutput(result);
			} else {
				const result = bubbleBableDecode(input);
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
								BubbleBabble工具
							</h1>
							<p className="text-black">
								將二進制數據編碼為易於發音的偽詞形式
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
										輸入 ({mode === "encode" ? "原始文本" : "BubbleBabble文本"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文本..."
												: "請輸入要解碼的BubbleBabble文本..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "BubbleBabble文本" : "原始文本"})
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

						{/* Character Reference */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-semibold text-black mb-4">字符集</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h4 className="font-medium text-black mb-2">元音 (6個)</h4>
									<div className="font-mono text-sm bg-gray-50 p-2 rounded">
										{vowels.split('').join(' ')}
									</div>
								</div>
								<div>
									<h4 className="font-medium text-black mb-2">輔音 (17個)</h4>
									<div className="font-mono text-sm bg-gray-50 p-2 rounded">
										{consonants.split('').join(' ')}
									</div>
								</div>
							</div>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								BubbleBabble說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									將二進制數據轉換為易於發音的偽詞，常用於SSH密鑰指紋顯示。
								</p>
								<p>
									<strong>格式:</strong>{" "}
									總是以'x'開頭和結尾，中間由元音和輔音組成的音節，用'-'分隔。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									相比十六進制，更容易通過語音傳達，且包含錯誤檢測機制。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>原文: "hello"</div>
										<div>編碼: xebok-disop-gytuf-kosak-egiru-nixux</div>
										<div>音節結構: 元音-輔音-元音-輔音-輔音</div>
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