"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function URLTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");
	const [encoding, setEncoding] = useState<"standard" | "component" | "form">(
		"standard"
	);

	const handleConvert = () => {
		try {
			if (mode === "encode") {
				switch (encoding) {
					case "standard":
						setOutput(encodeURI(input));
						break;
					case "component":
						setOutput(encodeURIComponent(input));
						break;
					case "form":
						setOutput(
							input.replace(/ /g, "+").replace(/[^A-Za-z0-9+]/g, (char) => {
								return (
									"%" +
									char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")
								);
							})
						);
						break;
				}
			} else {
				// Decode - try different methods
				let decoded = input;

				// Handle form encoding (+ to space)
				if (encoding === "form") {
					decoded = decoded.replace(/\+/g, " ");
				}

				// Try standard URI decoding
				try {
					decoded = decodeURIComponent(decoded);
				} catch {
					// If that fails, try manual hex decoding
					decoded = decoded.replace(/%([0-9A-Fa-f]{2})/g, (match, hex) => {
						return String.fromCharCode(parseInt(hex, 16));
					});
				}

				setOutput(decoded);
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

	const examples = {
		encode: {
			standard: "Hello World! 你好世界",
			component: "user@example.com?name=张三&age=25",
			form: "search query with spaces",
		},
		decode: {
			standard: "Hello%20World!%20%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C",
			component: "user%40example.com%3Fname%3D%E5%BC%A0%E4%B8%89%26age%3D25",
			form: "search+query+with+spaces",
		},
	};

	const loadExample = () => {
		setInput(examples[mode][encoding]);
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
								URL編碼工具
							</h1>
							<p className="text-black">支援標準URL編碼、組件編碼和表單編碼</p>
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

								<div className="flex items-center space-x-2">
									<label className="text-sm font-medium text-black">
										編碼類型:
									</label>
									<select
										value={encoding}
										onChange={(e) =>
											setEncoding(
												e.target.value as "standard" | "component" | "form"
											)
										}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value="standard">標準URL編碼</option>
										<option value="component">組件編碼</option>
										<option value="form">表單編碼</option>
									</select>
								</div>

								<button
									onClick={loadExample}
									className="text-sm border border-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
								>
									載入示例
								</button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "encode" ? "原始文字" : "編碼文字"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文字..."
												: "請輸入要解碼的URL編碼文字..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "編碼結果" : "解碼結果"})
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

						{/* Character Reference */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-semibold text-black mb-4">
								常見字元編碼對照
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
								{[
									{ char: "空格", encoded: "%20" },
									{ char: "!", encoded: "%21" },
									{ char: '"', encoded: "%22" },
									{ char: "#", encoded: "%23" },
									{ char: "$", encoded: "%24" },
									{ char: "%", encoded: "%25" },
									{ char: "&", encoded: "%26" },
									{ char: "'", encoded: "%27" },
									{ char: "(", encoded: "%28" },
									{ char: ")", encoded: "%29" },
									{ char: "+", encoded: "%2B" },
									{ char: ",", encoded: "%2C" },
									{ char: "/", encoded: "%2F" },
									{ char: ":", encoded: "%3A" },
									{ char: ";", encoded: "%3B" },
									{ char: "=", encoded: "%3D" },
									{ char: "?", encoded: "%3F" },
									{ char: "@", encoded: "%40" },
									{ char: "[", encoded: "%5B" },
									{ char: "]", encoded: "%5D" },
								].map(({ char, encoded }) => (
									<div key={char} className="bg-gray-50 p-2 rounded text-sm">
										<div className="font-medium text-black">{char}</div>
										<div className="text-teal-600 font-mono">{encoded}</div>
									</div>
								))}
							</div>
						</div>

						{/* Information */}
						<div className="bg-green-50 border border-green-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-green-900 mb-3">
								URL編碼說明
							</h3>
							<div className="text-green-800 space-y-3">
								<div>
									<p>
										<strong>編碼類型區別:</strong>
									</p>
									<ul className="list-disc ml-6 mt-1 space-y-1">
										<li>
											<strong>標準URL編碼 (encodeURI):</strong>{" "}
											保留URL中的保留字元（如 :/?#[]@）
										</li>
										<li>
											<strong>組件編碼 (encodeURIComponent):</strong>{" "}
											編碼所有非字母數字字元，用於URL參數
										</li>
										<li>
											<strong>表單編碼:</strong> 類似組件編碼，但將空格轉換為 +
											號
										</li>
									</ul>
								</div>

								<div>
									<p>
										<strong>使用場景:</strong>
									</p>
									<ul className="list-disc ml-6 mt-1 space-y-1">
										<li>URL路徑編碼：使用標準URL編碼</li>
										<li>查詢參數編碼：使用組件編碼</li>
										<li>表單資料提交：使用表單編碼</li>
									</ul>
								</div>

								<div className="bg-green-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<p className="text-sm">
										<strong>原文:</strong> Hello World! 你好
									</p>
									<p className="text-sm">
										<strong>標準編碼:</strong>{" "}
										Hello%20World!%20%E4%BD%A0%E5%A5%BD
									</p>
									<p className="text-sm">
										<strong>組件編碼:</strong>{" "}
										Hello%20World!%20%E4%BD%A0%E5%A5%BD
									</p>
									<p className="text-sm">
										<strong>表單編碼:</strong> Hello+World%21+%E4%BD%A0%E5%A5%BD
									</p>
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
