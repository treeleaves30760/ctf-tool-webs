"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AAEncodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");

	const aaEncode = (text: string) => {
		// AAEncode mapping table
		const mapping: { [key: string]: string } = {
			' ': '(ﾟДﾟ)[ﾟoﾟ]',
			'!': '(ﾟДﾟ)[ﾟεﾟ]',
			'"': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟoﾟ]',
			'#': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟoﾟ]',
			'$': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟДﾟ][ﾟoﾟ]',
			'%': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟДﾟ][ﾟoﾟ]',
			'&': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟДﾟ][ﾟεﾟ]',
			"'": '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟДﾟ][ﾟΘﾟ]',
			'(': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟΘﾟ]',
			')': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟΘﾟ]',
			'*': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟoﾟ]',
			'+': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟεﾟ]',
			',': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟΘﾟ]',
			'-': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟεﾟ]',
			'.': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟΘﾟ] +(ﾟΘﾟ)[ﾟoﾟ]',
			'/': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟΘﾟ] +(ﾟΘﾟ)[ﾟεﾟ]',
			'0': '(ﾟДﾟ)[ﾟoﾟ] +(ﾟΘﾟ)[ﾟΘﾟ] +(ﾟΘﾟ)[ﾟΘﾟ]',
			'1': '(ﾟДﾟ)[ﾟεﾟ]',
			'2': '(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'3': '(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'4': '(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'5': '(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'a': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟoﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'b': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟoﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'c': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟoﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'd': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟoﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'e': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟoﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]',
			'f': '(ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟoﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ] +(ﾟДﾟ)[ﾟεﾟ]'
		};

		let result = '';
		for (const char of text) {
			if (mapping[char]) {
				result += mapping[char] + ' ';
			} else {
				// For characters not in mapping, convert to unicode expression
				const charCode = char.charCodeAt(0);
				result += `(ﾟДﾟ)[ﾟoﾟ]+(ﾟДﾟ)[ﾟεﾟ]+(${charCode}) `;
			}
		}
		
		return `ﾟωﾟﾉ= /｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/ ['_']; o=(ﾟｰﾟ)  =_=3; c=(ﾟΘﾟ) =(ﾟｰﾟ)-(ﾟｰﾟ); (ﾟДﾟ) =(ﾟΘﾟ)= (o^_^o)/ (o^_^o);(ﾟДﾟ)={ﾟΘﾟ: '_' ,ﾟωﾟﾉ : ((ﾟωﾟﾉ==3) +'_') [ﾟΘﾟ] ,ﾟｰﾟﾉ :(ﾟωﾟﾉ+ '_')[o^_^o -(ﾟΘﾟ)] ,ﾟДﾟﾉ:((ﾟｰﾟ==3) +'_')[ﾟｰﾟ] }; (ﾟДﾟ) [ﾟΘﾟ] =((ﾟωﾟﾉ==3) +'_') [c^_^o];(ﾟДﾟ) ['c'] = ((ﾟДﾟ)+'_') [ (ﾟｰﾟ)+(ﾟｰﾟ)-(ﾟΘﾟ) ];(ﾟДﾟ) ['o'] = ((ﾟДﾟ)+'_') [ﾟΘﾟ];(ﾟoﾟ)=(ﾟДﾟ) ['c']+(ﾟДﾟ) ['o']+(ﾟωﾟﾉ +'_')[ﾟΘﾟ]+ ((ﾟωﾟﾉ==3) +'_') [ﾟｰﾟ] + ((ﾟДﾟ) +'_') [(ﾟｰﾟ)+(ﾟｰﾟ)]+ ((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+((ﾟｰﾟ==3) +'_') [(ﾟｰﾟ) - (ﾟΘﾟ)]+(ﾟДﾟ) ['c']+((ﾟДﾟ)+'_') [(ﾟｰﾟ)+(ﾟｰﾟ)]+ (ﾟДﾟ) ['o']+((ﾟｰﾟ==3) +'_') [ﾟΘﾟ];(ﾟДﾟ) ['_'] = (o^_^o) [ﾟoﾟ] [ﾟoﾟ];(ﾟεﾟ)=((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+ (ﾟДﾟ) .ﾟДﾟﾉ+((ﾟДﾟ)+'_') [(ﾟｰﾟ) + (ﾟｰﾟ)]+((ﾟｰﾟ==3) +'_') [o^_^o -ﾟΘﾟ]+((ﾟｰﾟ==3) +'_') [ﾟΘﾟ]+ (ﾟωﾟﾉ +'_') [ﾟΘﾟ]; (ﾟｰﾟ)+=(ﾟΘﾟ); (ﾟДﾟ)[ﾟεﾟ]='\\\\'; (ﾟДﾟ).ﾟΘﾟﾉ=(ﾟДﾟ+ ﾟｰﾟ)[o^_^o -(ﾟΘﾟ)];(oﾟｰﾟo)=(ﾟωﾟﾉ +'_')[c^_^o];(ﾟДﾟ) [ﾟoﾟ]='\"';(ﾟДﾟ) ['_'] ( (ﾟДﾟ) ['_'] (ﾟεﾟ+(ﾟДﾟ)[ﾟoﾟ]+ ${result.trim()}+(ﾟДﾟ)[ﾟoﾟ] ) (ﾟΘﾟ) ) ('_');`;
	};

	const aaDecode = (text: string) => {
		try {
			// This is a simplified decoder - actual AAEncode decoding requires JavaScript evaluation
			// For security reasons, we'll provide a basic pattern match approach
			if (!text.includes('ﾟωﾟﾉ= /｀ｍ´）ﾉ ~┻━┻')) {
				return "不是有效的AAEncode格式";
			}
			
			// Extract the main payload between quotes
			const match = text.match(/\+(.*?)\+\(ﾟДﾟ\)\[ﾟoﾟ\]/);
			if (!match) {
				return "無法解析AAEncode內容";
			}
			
			// This is a simplified approximation - real decoding would require full JS evaluation
			let payload = match[1];
			
			// Basic pattern replacements
			const reverseMappings: { [key: string]: string } = {
				'(ﾟДﾟ)[ﾟoﾟ]': ' ',
				'(ﾟДﾟ)[ﾟεﾟ]': '1',
			};
			
			for (const [encoded, decoded] of Object.entries(reverseMappings)) {
				payload = payload.replace(new RegExp(encoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), decoded);
			}
			
			return "簡化解碼結果: " + payload.substring(0, 100) + (payload.length > 100 ? '...' : '') + 
				   "\n\n注意：完整解碼需要JavaScript引擎執行，此處僅顯示部分內容";
			
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
				const result = aaEncode(input);
				setOutput(result);
			} else {
				const result = aaDecode(input);
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
								AAEncode工具
							</h1>
							<p className="text-black">
								將JavaScript代碼編碼為只包含日文字符的形式
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
										輸入 ({mode === "encode" ? "JavaScript代碼" : "AAEncode文本"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的JavaScript代碼..."
												: "請輸入要解碼的AAEncode文本..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "AAEncode文本" : "JavaScript代碼"})
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
								AAEncode說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>原理:</strong>{" "}
									使用日文字符和特殊符號將JavaScript代碼編碼為看似亂碼的形式。
								</p>
								<p>
									<strong>特點:</strong>{" "}
									編碼後的代碼仍然是有效的JavaScript，可以直接在瀏覽器中執行。
								</p>
								<p>
									<strong>用途:</strong>{" "}
									常用於代碼混淆、繞過安全檢測等場景，在CTF競賽中經常出現。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例字符映射:</strong>
									</p>
									<div className="font-mono text-xs mt-2">
										<div>a → (ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟoﾟ] +(ﾟДﾟ)[ﾟεﾟ]</div>
										<div>1 → (ﾟДﾟ)[ﾟεﾟ]</div>
										<div>( → (ﾟДﾟ)[ﾟoﾟ] +(o)[ﾟΘﾟ]</div>
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