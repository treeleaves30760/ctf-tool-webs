"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HandyCodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	// HandyCode uses a specific mapping table
	const handyCodeMap: { [key: string]: string } = {
		'A': '1', 'B': '2', 'C': '3', 'D': '4', 'E': '5', 'F': '6', 'G': '7', 'H': '8', 'I': '9', 'J': '10',
		'K': '11', 'L': '12', 'M': '13', 'N': '14', 'O': '15', 'P': '16', 'Q': '17', 'R': '18', 'S': '19', 'T': '20',
		'U': '21', 'V': '22', 'W': '23', 'X': '24', 'Y': '25', 'Z': '26',
		' ': '0'
	};

	const reverseHandyCodeMap = Object.fromEntries(
		Object.entries(handyCodeMap).map(([key, value]) => [value, key])
	);

	const handyCodeEncode = (text: string) => {
		return text.toUpperCase().split('').map(char => {
			return handyCodeMap[char] || char;
		}).join(' ');
	};

	const handyCodeDecode = (text: string) => {
		return text.split(' ').map(code => {
			return reverseHandyCodeMap[code.trim()] || code;
		}).join('');
	};

	const handleConvert = () => {
		try {
			if (!input) {
				setOutput("請輸入文字");
				return;
			}

			if (mode === "encode") {
				const result = handyCodeEncode(input);
				setOutput(result);
			} else {
				const result = handyCodeDecode(input);
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
								HandyCode工具
							</h1>
							<p className="text-black">
								簡單的字母到數字映射編碼方式
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
										輸入 ({mode === "encode" ? "原始文本" : "HandyCode數字"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文本..."
												: "請輸入要解碼的數字序列..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "HandyCode數字" : "原始文本"})
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

						{/* Mapping Table */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-semibold text-black mb-4">編碼對照表</h3>
							<div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm font-mono">
								{Object.entries(handyCodeMap).slice(0, -1).map(([letter, code]) => (
									<div key={letter} className="flex justify-between bg-gray-50 p-2 rounded">
										<span className="font-bold">{letter}</span>
										<span>→</span>
										<span>{code}</span>
									</div>
								))}
							</div>
							<div className="mt-4 text-sm text-gray-600">
								空格 = 0
							</div>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								HandyCode說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									將字母按字母表順序映射為對應的數字(A=1, B=2, ..., Z=26)。
								</p>
								<p>
									<strong>格式:</strong>{" "}
									每個字母對應一個數字，數字之間用空格分隔，空格字符用0表示。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									最簡單的字母數字替換編碼，易於手工編解碼。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>原文: "HELLO WORLD"</div>
										<div>編碼: "8 5 12 12 15 0 23 15 18 12 4"</div>
										<div>H=8, E=5, L=12, 空格=0, W=23, O=15, R=18, D=4</div>
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