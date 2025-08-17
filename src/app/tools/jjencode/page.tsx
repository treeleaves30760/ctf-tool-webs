"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function JJEncodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	const jjEncode = (text: string) => {
		// JJEncode uses Japanese characters to encode JavaScript
		const chars = "ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ";
		
		let result = '$=~[];$={___:++$,$$$$:(![]+"")[$],__$:++$,$_$_:(![]+"")[$],_$_:++$,$_$$:({}+"")[$],$$_$:($[$]+"")[$],_$$:++$,$$$_:(!""+"")[$],$__:++$,$_$:++$,$$__:({}+"")[$],$$_:++$,$$$:++$,$___:++$,$__$:++$};$.$_=($.$_=$+"")[$.$_$]+($._$=$.$_[$.__$])+($.$$=($.$+"")[$.__$])+((!$)+"")[$._$$]+($.__=$.$_[$.$$_])+($.$=(!""+"")[$.__$])+($._=(!""+"")[$._$_])+$.$_[$.$_$]+$.__+$._$+$.$;$.$$=$.$+(!""+"")[$._$$]+$.__+$._+$.$+$.$$;$.$=($.___)[$.$_][$.$_];$.$($.$($.$$+"\\""+$.___+$.$$_+$.__$+$.$$_+$._$_+$.$$$+"\\\\"+$.___+$.$__+$.$__+$._$_+"\\\\"+$.___+$.$$_+$.$_$+$.__$+"\\""+$.$$$$+(![]+"")[$._$$]+$.$$$$+"(\\\\"+$.___+$.$_$+$.___+$.$$$+$._$_+"\\\\"+$.___+$.$__+$.$_$+$.__+"\\\\"+$.___+$.$_$+$._$$+$.__$+"\\\\"+$.___+$.$_$+$._$$+$.$$$+"\\\\"+$.___+$.$_$+$.___+$._$_+"("+';
		
		for (let i = 0; i < text.length; i++) {
			const charCode = text.charCodeAt(i);
			if (charCode < 128) {
				result += `\\\\${charCode.toString(8)}`;
			} else {
				result += `\\\\u${charCode.toString(16).padStart(4, '0')}`;
			}
		}
		
		result += '))();"';
		
		// This is a simplified JJEncode - the actual implementation is much more complex
		return `$=~[];$={___:++$,$$$$:(![]+"")[$],__$:++$,$_$_:(![]+"")[$],_$_:++$,$_$$:({}+"")[$],$$_$:($[$]+"")[$],_$$:++$,$$$_:(!""+"")[$],$__:++$,$_$:++$,$$__:({}+"")[$],$$_:++$,$$$:++$,$___:++$,$__$:++$};$.$_=($.$_=$+"")[$.$_$]+($._$=$.$_[$.__$])+($.$$=($.$+"")[$.__$])+((!$)+"")[$._$$]+($.__=$.$_[$.$$_])+($.$=(!""+"")[$.__$])+($._=(!""+"")[$._$_])+$.$_[$.$_$]+$.__+$._$+$.$;$.$$=$.$+(!""+"")[$._$$]+$.__+$._+$.$+$.$$;$.$=($.___)[$.$_][$.$_];$.$($.$($.$$+"\\""+"${text.split('').map(c => c.charCodeAt(0).toString(8)).join('\\\\')}"+"\\""))()`;
	};

	const jjDecode = (text: string) => {
		try {
			// This is a simplified decoder - actual JJEncode decoding requires JavaScript evaluation
			if (!text.includes('$=~[]')) {
				return "不是有效的JJEncode格式";
			}
			
			// Try to extract string literals
			const stringMatches = text.match(/\\\\(\d+)/g);
			if (stringMatches) {
				let decoded = '';
				stringMatches.forEach(match => {
					const octal = match.replace(/\\\\/g, '');
					const charCode = parseInt(octal, 8);
					if (charCode > 0 && charCode < 128) {
						decoded += String.fromCharCode(charCode);
					}
				});
				
				if (decoded) {
					return "簡化解碼結果: " + decoded + "\n\n注意：完整解碼需要JavaScript引擎執行";
				}
			}
			
			return "無法解析JJEncode內容，可能需要完整的JavaScript執行環境";
			
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
				const result = jjEncode(input);
				setOutput(result);
			} else {
				const result = jjDecode(input);
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
								JJEncode工具
							</h1>
							<p className="text-black">
								將JavaScript代碼編碼為只包含日文字符和符號的形式
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
										輸入 ({mode === "encode" ? "JavaScript代碼" : "JJEncode文本"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的JavaScript代碼..."
												: "請輸入要解碼的JJEncode文本..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "JJEncode文本" : "JavaScript代碼"})
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
							<h3 className="text-lg font-semibold text-black mb-4">JJEncode字符集</h3>
							<div className="text-sm space-y-2">
								<div className="bg-gray-50 p-3 rounded font-mono">
									<div className="text-gray-600 mb-1">基礎構造字符:</div>
									<div>$ = ~ [ ] { } ( ) " ! + 空格</div>
								</div>
								<div className="bg-gray-50 p-3 rounded font-mono">
									<div className="text-gray-600 mb-1">構造變量:</div>
									<div>$, $_, $$, $__, $_$, $$_, _$, _$$, $$$$, ___</div>
								</div>
							</div>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								JJEncode說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									使用JavaScript的特性，通過符號操作構造字符串和函數調用。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									比AAEncode更簡潔，只使用基本符號，但原理類似。
								</p>
								<p>
									<strong>用途:</strong>{" "}
									代碼混淆、繞過檢測、CTF挑戰等場景。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>編碼原理:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>$ = ~[] // 構造數字-1</div>
										<div>$$ = $ + $ // 構造數字-2</div>
										<div>$_ = {} + "" // 構造字符串"[object Object]"</div>
										<div>通過索引和運算構造所需字符</div>
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