"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PortaTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [key, setKey] = useState("SECRET");
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

	// Porta cipher table - each row corresponds to a key letter pair
	const portaTable = [
		// A,B
		"NOPQRSTUVWXYZABCDEFGHIJKLM",
		// C,D  
		"OPQRSTUVWXYZABCDEFGHIJKLMN",
		// E,F
		"PQRSTUVWXYZABCDEFGHIJKLMNO",
		// G,H
		"QRSTUVWXYZABCDEFGHIJKLMNOP",
		// I,J
		"RSTUVWXYZABCDEFGHIJKLMNOPQ",
		// K,L
		"STUVWXYZABCDEFGHIJKLMNOPQR",
		// M,N
		"TUVWXYZABCDEFGHIJKLMNOPQRS",
		// O,P
		"UVWXYZABCDEFGHIJKLMNOPQRST",
		// Q,R
		"VWXYZABCDEFGHIJKLMNOPQRSTU",
		// S,T
		"WXYZABCDEFGHIJKLMNOPQRSTUV",
		// U,V
		"XYZABCDEFGHIJKLMNOPQRSTUVW",
		// W,X
		"YZABCDEFGHIJKLMNOPQRSTUVWX",
		// Y,Z
		"ZABCDEFGHIJKLMNOPQRSTUVWXY"
	];

	const getKeyIndex = (keyChar: string) => {
		const char = keyChar.toUpperCase();
		if (char >= 'A' && char <= 'B') return 0;
		if (char >= 'C' && char <= 'D') return 1;
		if (char >= 'E' && char <= 'F') return 2;
		if (char >= 'G' && char <= 'H') return 3;
		if (char >= 'I' && char <= 'J') return 4;
		if (char >= 'K' && char <= 'L') return 5;
		if (char >= 'M' && char <= 'N') return 6;
		if (char >= 'O' && char <= 'P') return 7;
		if (char >= 'Q' && char <= 'R') return 8;
		if (char >= 'S' && char <= 'T') return 9;
		if (char >= 'U' && char <= 'V') return 10;
		if (char >= 'W' && char <= 'X') return 11;
		if (char >= 'Y' && char <= 'Z') return 12;
		return 0;
	};

	const portaCipher = (text: string, key: string) => {
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
		
		if (!cleanKey) return text;

		let result = '';
		let keyIndex = 0;
		
		for (const char of cleanText) {
			const keyChar = cleanKey[keyIndex % cleanKey.length];
			const tableIndex = getKeyIndex(keyChar);
			const charIndex = char.charCodeAt(0) - 65; // A=0, B=1, etc.
			
			result += portaTable[tableIndex][charIndex];
			keyIndex++;
		}
		
		return result;
	};

	const handleConvert = () => {
		try {
			if (!input || !key) {
				setOutput("請輸入文字和密鑰");
				return;
			}

			// Porta cipher is reciprocal - same operation for encrypt and decrypt
			const result = portaCipher(input, key);
			setOutput(result);
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
								波塔密碼工具
							</h1>
							<p className="text-black">
								16世紀意大利學者波塔發明的互逆多字母替換密碼
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
								<div className="text-sm text-gray-600">
									註: 波塔密碼是互逆的，加密和解密使用相同算法
								</div>
							</div>

							<div className="mb-6">
								<label className="block text-sm font-medium text-black mb-2">
									密鑰
								</label>
								<input
									type="text"
									value={key}
									onChange={(e) => setKey(e.target.value)}
									className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
									placeholder="SECRET"
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

						{/* Porta Table Reference */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-semibold text-black mb-4">波塔密碼表 (部分)</h3>
							<div className="overflow-x-auto">
								<table className="w-full text-xs font-mono">
									<thead>
										<tr className="border-b">
											<th className="text-left p-1">密鑰</th>
											<th className="text-left p-1">替換字母表</th>
										</tr>
									</thead>
									<tbody>
										<tr className="border-b"><td className="p-1">A,B</td><td className="p-1">NOPQRSTUVWXYZABCDEFGHIJKLM</td></tr>
										<tr className="border-b"><td className="p-1">C,D</td><td className="p-1">OPQRSTUVWXYZABCDEFGHIJKLMN</td></tr>
										<tr className="border-b"><td className="p-1">E,F</td><td className="p-1">PQRSTUVWXYZABCDEFGHIJKLMNO</td></tr>
										<tr className="border-b"><td className="p-1">G,H</td><td className="p-1">QRSTUVWXYZABCDEFGHIJKLMNOP</td></tr>
										<tr className="border-b"><td className="p-1">I,J</td><td className="p-1">RSTUVWXYZABCDEFGHIJKLMNOPQ</td></tr>
										<tr className="text-gray-500"><td className="p-1">...</td><td className="p-1">...</td></tr>
									</tbody>
								</table>
							</div>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								波塔密碼說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									使用預定義的替換表，每兩個連續字母共用一個替換字母表。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									互逆性 - 加密和解密使用相同的操作，大大簡化了使用過程。
								</p>
								<p>
									<strong>歷史:</strong>{" "}
									由Giovanni Battista della Porta於1563年發明，是早期多字母替換密碼之一。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>密鑰分組:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>AB → 第1行, CD → 第2行, EF → 第3行</div>
										<div>GH → 第4行, IJ → 第5行, KL → 第6行</div>
										<div>MN → 第7行, OP → 第8行, QR → 第9行</div>
										<div>ST → 第10行, UV → 第11行, WX → 第12行, YZ → 第13行</div>
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