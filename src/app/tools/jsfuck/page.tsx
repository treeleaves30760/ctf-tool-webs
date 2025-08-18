"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function JSFuckTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	// JSFuck mapping for basic characters using only []()!+
	const jsFuckMap: { [key: string]: string } = {
		false: "![]",
		true: "!![]",
		undefined: "[][[]]",
		NaN: "+[![]]",
		Infinity: "+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])",
		"0": "+[]",
		"1": "+!+[]",
		"2": "!+[]+!+[]",
		"3": "!+[]+!+[]+!+[]",
		"4": "!+[]+!+[]+!+[]+!+[]",
		"5": "!+[]+!+[]+!+[]+!+[]+!+[]",
		"6": "!+[]+!+[]+!+[]+!+[]+!+[]+!+[]",
		"7": "!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]",
		"8": "!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]",
		"9": "!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]",
		a: "(![]+[])[+!+[]]",
		b: "({}+[])[+!+[]]",
		c: "({}+[])[!+[]+!+[]+!+[]+!+[]+!+[]]",
		d: "([][[]]+[])[+!+[]]",
		e: "(!![]+[])[!+[]+!+[]+!+[]]",
		f: "(![]+[])[+[]]",
		g: "(+(!+[]+!+[]+[+!+[]]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+!+[]]]",
		h: "(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]]))[(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+!+[]]]",
		i: "([][[]]+[])[!+[]+!+[]+!+[]+!+[]+!+[]]",
		j: "({}+[])[!+[]+!+[]+!+[]]",
		l: "(![]+[])[!+[]+!+[]]",
		n: "([][[]]+[])[+!+[]]",
		o: "({}+[])[+!+[]]",
		r: "(!![]+[])[+!+[]]",
		s: "(![]+[])[!+[]+!+[]+!+[]]",
		t: "(!![]+[])[+[]]",
		u: "([][[]]+[])[!+[]+!+[]]",
		y: "(+(!+[]+!+[]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]]))[(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+!+[]]]",
	};

	const jsFuckEncode = (text: string) => {
		// This is a simplified JSFuck encoder
		let result = "";

		for (const char of text.toLowerCase()) {
			if (jsFuckMap[char]) {
				result += jsFuckMap[char] + "+";
			} else if (char === " ") {
				result += "(![]+[])[+!+[]]+";
			} else {
				// For characters not in map, create a complex expression
				const charCode = char.charCodeAt(0);
				let numExpr = jsFuckMap[charCode.toString()];
				if (!numExpr) {
					// Build number from scratch
					if (charCode < 10) {
						numExpr = "!+[]".repeat(charCode);
					} else {
						numExpr = `(${jsFuckMap["1"]}${jsFuckMap["0"]})`;
					}
				}
				result += `([]+[])[(!![]+[])[+[]]+(![]+[])[+!+[]]+(+(!+[]+!+[]+[+!+[]]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+!+[]]]+(!![]+[])[+[]]]((+${numExpr})[(!![]+[])[+[]]+(![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+[]])[+!+[]]+`;
			}
		}

		// Remove trailing +
		result = result.replace(/\+$/, "");

		// Wrap in execution context
		return `[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]((![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+(![]+[])[!+[]+!+[]+!+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+((!![]+[])[+[]]+(!![]+[])[+!+[]]+((!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+(+(!+[]+!+[]+!+[]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+!+[]]]+(!![]+[])[+!+[]]+([][[]]+[])[+!+[]]+([][[]]+[])[+!+[]]+([][[]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[+!+[]]+([][[]]+[])[+[]])[(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+!+[]]]+([][[]]+[])[+[]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]])()(${result})()`;
	};

	const jsFuckDecode = (text: string) => {
		try {
			// This is a very simplified decoder - actual JSFuck decoding requires JavaScript evaluation
			if (
				!text.includes("[][(![]+[])") &&
				!text.includes("![]") &&
				!text.includes("+!![]")
			) {
				return "不是有效的JSFuck格式";
			}

			// Try to identify patterns
			let decoded = "";

			// Look for simple patterns
			if (text.includes("(![]+[])[+[]]")) decoded += "f";
			if (text.includes("(!![]+[])[+[]]")) decoded += "t";
			if (text.includes("(![]+[])[+!+[]]")) decoded += "a";
			if (text.includes("(!![]+[])[+!+[]]")) decoded += "r";
			if (text.includes("(![]+[])[!+[]+!+[]]")) decoded += "l";
			if (text.includes("(!![]+[])[!+[]+!+[]+!+[]]")) decoded += "e";

			if (decoded) {
				return `簡化解碼結果: ${decoded}\n\n注意：這是非常簡化的解碼，完整解碼需要JavaScript引擎執行`;
			}

			return "無法解析JSFuck內容，需要完整的JavaScript執行環境進行解碼";
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
				const result = jsFuckEncode(input);
				setOutput(result);
			} else {
				const result = jsFuckDecode(input);
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
							<h1 className="text-3xl font-bold text-black mb-4">JSFuck工具</h1>
							<p className="text-black">
								使用6個字符 []()!+ 編碼JavaScript代碼
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

							<div className="grid grid-cols-1 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "encode" ? "JavaScript代碼" : "JSFuck文本"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文本或代碼..."
												: "請輸入要解碼的JSFuck文本..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "JSFuck文本" : "JavaScript代碼"})
									</label>
									<textarea
										value={output}
										readOnly
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono text-xs"
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
							<h3 className="text-lg font-semibold text-black mb-4">
								JSFuck基礎構造
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
								<div className="space-y-2">
									<div className="bg-gray-50 p-2 rounded">
										<span className="text-gray-600">false:</span> ![]
									</div>
									<div className="bg-gray-50 p-2 rounded">
										<span className="text-gray-600">true:</span> !![]
									</div>
									<div className="bg-gray-50 p-2 rounded">
										<span className="text-gray-600">0:</span> +[]
									</div>
									<div className="bg-gray-50 p-2 rounded">
										<span className="text-gray-600">1:</span> +!+[]
									</div>
								</div>
								<div className="space-y-2">
									<div className="bg-gray-50 p-2 rounded">
										<span className="text-gray-600">&quot;f&quot;:</span>{" "}
										(![]+[])[+[]]
									</div>
									<div className="bg-gray-50 p-2 rounded">
										<span className="text-gray-600">&quot;a&quot;:</span>{" "}
										(![]+[])[+!+[]]
									</div>
									<div className="bg-gray-50 p-2 rounded">
										<span className="text-gray-600">&quot;l&quot;:</span>{" "}
										(![]+[])[!+[]+!+[]]
									</div>
									<div className="bg-gray-50 p-2 rounded">
										<span className="text-gray-600">&quot;s&quot;:</span>{" "}
										(![]+[])[!+[]+!+[]+!+[]]
									</div>
								</div>
							</div>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								JSFuck說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong> 僅使用6個字符 [ ] ( ) ! +
									來編寫和執行JavaScript代碼。
								</p>
								<p>
									<strong>核心技巧:</strong>{" "}
									利用JavaScript的類型轉換特性，從基礎值構造所有字符和函數。
								</p>
								<p>
									<strong>限制:</strong>{" "}
									編碼後的代碼極其冗長，一個簡單的alert()可能需要數千個字符。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>構造原理:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>[] == false, ![] == true</div>
										<div>
											[] + [] == &quot;&quot;, ![] + [] == &quot;false&quot;
										</div>
										<div>通過索引和運算獲取字符串中的單個字符</div>
										<div>最終構造Function構造器來執行代碼</div>
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
