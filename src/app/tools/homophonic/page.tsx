"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomophonicTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
	const [key, setKey] = useState("");
	const [customMapping, setCustomMapping] = useState("");
	const [autoMapping, setAutoMapping] = useState("");

	// Default homophone mapping - each letter can have multiple substitutes
	const defaultHomophones: Record<string, string[]> = {
		A: ["12", "45", "78"],
		B: ["23", "56"],
		C: ["34", "67"],
		D: ["89", "01"],
		E: ["90", "13", "46", "79"], // Most common letter gets more options
		F: ["24", "57"],
		G: ["35", "68"],
		H: ["80", "14"],
		I: ["25", "58", "91"],
		J: ["36"],
		K: ["69"],
		L: ["81", "15"],
		M: ["26", "59"],
		N: ["37", "70", "92"],
		O: ["82", "16", "49"],
		P: ["27", "60"],
		Q: ["38"],
		R: ["71", "93", "17"],
		S: ["83", "28", "61"],
		T: ["39", "72", "94", "18"], // Common letter gets more options
		U: ["84", "29"],
		V: ["62"],
		W: ["95", "30"],
		X: ["73"],
		Y: ["85", "31"],
		Z: ["96"]
	};

	const createReverseMapping = (homophones: Record<string, string[]>) => {
		const reverse: Record<string, string> = {};
		Object.entries(homophones).forEach(([letter, codes]) => {
			codes.forEach(code => {
				reverse[code] = letter;
			});
		});
		return reverse;
	};

	const parseCustomMapping = (mappingText: string): Record<string, string[]> | null => {
		try {
			const mapping: Record<string, string[]> = {};
			const lines = mappingText.trim().split('\n');
			
			for (const line of lines) {
				if (!line.trim()) continue;
				const [letter, codesStr] = line.split(':');
				if (!letter || !codesStr) continue;
				
				const codes = codesStr.split(',').map(c => c.trim()).filter(c => c);
				mapping[letter.trim().toUpperCase()] = codes;
			}
			
			return Object.keys(mapping).length > 0 ? mapping : null;
		} catch {
			return null;
		}
	};

	const homophonicEncrypt = (text: string, homophones: Record<string, string[]>): string => {
		return text.toUpperCase().split('').map(char => {
			if (homophones[char]) {
				const options = homophones[char];
				const randomIndex = Math.floor(Math.random() * options.length);
				return options[randomIndex];
			}
			return char; // Keep non-alphabetic characters as is
		}).join(' ');
	};

	const homophonicDecrypt = (text: string, homophones: Record<string, string[]>): string => {
		const reverseMapping = createReverseMapping(homophones);
		const codes = text.split(/\s+/).filter(code => code.trim());
		
		return codes.map(code => {
			return reverseMapping[code] || code;
		}).join('');
	};

	const generateAutoMapping = () => {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const numbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
		const shuffled = [...numbers].sort(() => Math.random() - 0.5);
		
		let mapping = "";
		let index = 0;
		
		// English letter frequencies (approximate)
		const frequencies = {
			E: 4, T: 4, A: 3, O: 3, I: 3, N: 3, S: 3, H: 2, R: 2,
			D: 2, L: 2, U: 2, C: 2, M: 2, W: 2, F: 2, G: 2, Y: 2,
			P: 2, B: 1, V: 1, K: 1, J: 1, X: 1, Q: 1, Z: 1
		};
		
		for (const letter of alphabet) {
			const count = frequencies[letter as keyof typeof frequencies] || 1;
			const codes = shuffled.slice(index, index + count);
			mapping += `${letter}: ${codes.join(', ')}\n`;
			index += count;
		}
		
		setAutoMapping(mapping);
	};

	const handleConvert = () => {
		try {
			let homophones = defaultHomophones;
			
			if (customMapping.trim()) {
				const parsed = parseCustomMapping(customMapping);
				if (parsed) {
					homophones = parsed;
				} else {
					setOutput("自定義映射格式錯誤");
					return;
				}
			}

			if (mode === "encrypt") {
				const result = homophonicEncrypt(input, homophones);
				setOutput(result);
			} else {
				const result = homophonicDecrypt(input, homophones);
				setOutput(result);
			}
		} catch (error) {
			setOutput("轉換出錯: " + (error as Error).message);
		}
	};

	const handleClear = () => {
		setInput("");
		setOutput("");
		setCustomMapping("");
		setAutoMapping("");
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(output);
	};

	const handleCopyMapping = () => {
		navigator.clipboard.writeText(autoMapping);
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
								同音替換密碼工具
							</h1>
							<p className="text-black">
								每個字母可對應多個符號，增加破解難度的替換密碼
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

								<button
									onClick={generateAutoMapping}
									className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
								>
									生成隨機映射
								</button>
							</div>

							{/* Custom Mapping */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-black mb-2">
									自定義映射 (格式: A: 12, 34, 56)
								</label>
								<textarea
									value={customMapping}
									onChange={(e) => setCustomMapping(e.target.value)}
									className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
									placeholder="留空使用預設映射，或輸入自定義映射..."
								/>
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
												: "請輸入要解密的密文 (以空格分隔)..."
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

						{/* Auto Generated Mapping */}
						{autoMapping && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-black">
										隨機生成的映射
									</h3>
									<button
										onClick={handleCopyMapping}
										className="text-sm border border-gray-300 text-black px-4 py-1 rounded-md hover:bg-gray-50 transition-colors"
									>
										複製映射
									</button>
								</div>
								<pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
									{autoMapping}
								</pre>
							</div>
						)}

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								同音替換密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									每個字母可以對應多個不同的符號或數字，使頻率分析變得困難。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									常見字母(如E、T、A)有更多的替換選項，模糊頻率特徵。
								</p>
								<p>
									<strong>安全性:</strong>{" "}
									比簡單替換密碼更安全，但仍可通過模式分析破解。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例映射:</strong>
									</p>
									<p className="text-sm">A: 12, 45, 78</p>
									<p className="text-sm">E: 90, 13, 46, 79 (更多選項)</p>
									<p className="text-sm">明文: HELLO → 密文: 80 90 81 81 82 (隨機選擇)</p>
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