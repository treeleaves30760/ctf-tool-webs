"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PigpenTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	// Pigpen cipher symbol mappings
	const pigpenMap: { [key: string]: string } = {
		'A': '⌞', 'B': '⌟', 'C': '⌜',
		'D': '⌊', 'E': '⌊⌊', 'F': '⌊⌈',
		'G': '⌈', 'H': '⌈⌈', 'I': '⌉',
		'J': '◣', 'K': '◤', 'L': '◥',
		'M': '◢', 'N': '◉', 'O': '◎',
		'P': '⋄', 'Q': '⋄', 'R': '⋄',
		'S': '⟐', 'T': '⟐', 'U': '⟐',
		'V': '◈', 'W': '◈', 'X': '◈',
		'Y': '⬫', 'Z': '⬫'
	};

	// Simplified visual representation for display
	const pigpenSymbols: { [key: string]: string } = {
		'A': '⌞', 'B': '⌟', 'C': '⌜',
		'D': '⌊', 'E': '⌈', 'F': '⌉',
		'G': '◣', 'H': '◤', 'I': '◥',
		'J': '◢', 'K': '◇', 'L': '◈',
		'M': '⟡', 'N': '⟢', 'O': '⟣',
		'P': '⬢', 'Q': '⬡', 'R': '⬠',
		'S': '⭘', 'T': '⭗', 'U': '⭖',
		'V': '◆', 'W': '◇', 'X': '◈',
		'Y': '⬟', 'Z': '⬠'
	};

	const reverseMap = Object.fromEntries(
		Object.entries(pigpenSymbols).map(([key, value]) => [value, key])
	);

	const encryptPigpen = (text: string) => {
		return text.toUpperCase().split('').map(char => {
			if (char >= 'A' && char <= 'Z') {
				return pigpenSymbols[char] || char;
			}
			return char === ' ' ? ' ' : '';
		}).join('');
	};

	const decryptPigpen = (text: string) => {
		return text.split('').map(char => {
			return reverseMap[char] || (char === ' ' ? ' ' : '');
		}).join('').replace(/\s+/g, ' ').trim();
	};

	const handleConvert = () => {
		try {
			if (!input) {
				setOutput("請輸入文字");
				return;
			}

			if (mode === "encrypt") {
				const result = encryptPigpen(input);
				setOutput(result);
			} else {
				const result = decryptPigpen(input);
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
								豬圈密碼工具
							</h1>
							<p className="text-black">
								共濟會使用的符號密碼，也稱為石匠密碼或自由石匠密碼
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
												: "請輸入要解密的符號..."
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
										style={{ fontSize: mode === "encrypt" ? "16px" : "14px" }}
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

						{/* Symbol Reference */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-semibold text-black mb-4">符號對照表</h3>
							<div className="grid grid-cols-6 md:grid-cols-13 gap-2 text-center text-sm">
								{Object.entries(pigpenSymbols).map(([letter, symbol]) => (
									<div key={letter} className="flex flex-col items-center p-2 border border-gray-200 rounded">
										<div className="font-mono text-lg" style={{ fontSize: "18px" }}>{symbol}</div>
										<div className="text-xs text-gray-600 mt-1">{letter}</div>
									</div>
								))}
							</div>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								豬圈密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									使用基於網格和X形狀的符號系統來替換字母。
								</p>
								<p>
									<strong>歷史:</strong>{" "}
									由共濟會會員廣泛使用，因此也被稱為共濟會密碼或石匠密碼。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									視覺化的符號密碼，每個字母對應一個獨特的符號形狀。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>網格結構:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>9宮格: A B C | D E F | G H I</div>
										<div>X形:   J K | L M | N O P Q</div>
										<div>點號: R S T U | V W X Y Z</div>
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