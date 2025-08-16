"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MorseTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");
	const [separator, setSeparator] = useState(" ");

	// Morse code mapping
	const morseCode: Record<string, string> = {
		A: ".-",
		B: "-...",
		C: "-.-.",
		D: "-..",
		E: ".",
		F: "..-.",
		G: "--.",
		H: "....",
		I: "..",
		J: ".---",
		K: "-.-",
		L: ".-..",
		M: "--",
		N: "-.",
		O: "---",
		P: ".--.",
		Q: "--.-",
		R: ".-.",
		S: "...",
		T: "-",
		U: "..-",
		V: "...-",
		W: ".--",
		X: "-..-",
		Y: "-.--",
		Z: "--..",
		"0": "-----",
		"1": ".----",
		"2": "..---",
		"3": "...--",
		"4": "....-",
		"5": ".....",
		"6": "-....",
		"7": "--...",
		"8": "---..",
		"9": "----.",
		".": ".-.-.-",
		",": "--..--",
		"?": "..--..",
		"'": ".----.",
		"!": "-.-.--",
		"/": "-..-.",
		"(": "-.--.",
		")": "-.--.-",
		"&": ".-...",
		":": "---...",
		";": "-.-.-.",
		"=": "-...-",
		"+": ".-.-.",
		"-": "-....-",
		_: "..--.-",
		'"': ".-..-.",
		$: "...-..-",
		"@": ".--.-.",
	};

	// Reverse mapping for decoding
	const reverseMorseCode: Record<string, string> = {};
	Object.entries(morseCode).forEach(([char, morse]) => {
		reverseMorseCode[morse] = char;
	});

	const encodeToMorse = (text: string): string => {
		return text
			.toUpperCase()
			.split("")
			.map((char) => {
				if (char === " ") return "/";
				return morseCode[char] || char;
			})
			.filter((code) => code !== undefined)
			.join(separator);
	};

	const decodeFromMorse = (morse: string): string => {
		// Handle different word separators
		const words = morse.split("/").map((word) => word.trim());

		return words
			.map((word) => {
				if (!word) return "";

				// Split by separator and decode each morse code
				const codes = word
					.split(separator)
					.filter((code) => code.trim() !== "");
				return codes
					.map((code) => {
						const trimmedCode = code.trim();
						return reverseMorseCode[trimmedCode] || trimmedCode;
					})
					.join("");
			})
			.join(" ");
	};

	const handleConvert = () => {
		try {
			if (mode === "encode") {
				setOutput(encodeToMorse(input));
			} else {
				setOutput(decodeFromMorse(input));
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

	const playMorse = () => {
		if (!output || mode !== "encode") return;

		const audioContext = new window.AudioContext();
		const dotDuration = 100; // ms
		const dashDuration = dotDuration * 3;
		const gapDuration = dotDuration;
		const letterGapDuration = dotDuration * 3;
		const wordGapDuration = dotDuration * 7;
		const frequency = 600; // Hz

		let currentTime = audioContext.currentTime;

		const playTone = (duration: number) => {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = frequency;
			oscillator.type = "sine";

			gainNode.gain.setValueAtTime(0.3, currentTime);

			oscillator.start(currentTime);
			oscillator.stop(currentTime + duration / 1000);

			currentTime += duration / 1000;
		};

		const addGap = (duration: number) => {
			currentTime += duration / 1000;
		};

		for (let i = 0; i < output.length; i++) {
			const char = output[i];

			if (char === ".") {
				playTone(dotDuration);
				addGap(gapDuration);
			} else if (char === "-") {
				playTone(dashDuration);
				addGap(gapDuration);
			} else if (char === separator) {
				addGap(letterGapDuration);
			} else if (char === "/") {
				addGap(wordGapDuration);
			}
		}
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
								摩斯電碼工具
							</h1>
							<p className="text-black">經典的點劃通訊編碼系統</p>
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
										分隔符:
									</label>
									<select
										value={separator}
										onChange={(e) => setSeparator(e.target.value)}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value=" ">空格</option>
										<option value="|">豎線 |</option>
										<option value=",">逗號 ,</option>
										<option value="">無分隔符</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "encode" ? "普通文字" : "摩斯電碼"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文字..."
												: "請輸入摩斯電碼... (用 / 分隔單詞)"
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "摩斯電碼" : "普通文字"})
									</label>
									<textarea
										value={output}
										readOnly
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono placeholder-gray-600"
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
									onClick={playMorse}
									disabled={!output || mode !== "encode"}
									className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									播放音訊
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

						{/* Morse Code Chart */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-semibold text-black mb-4">
								摩斯電碼對照表
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
								{Object.entries(morseCode).map(([char, morse]) => (
									<div
										key={char}
										className="flex justify-between items-center p-2 bg-gray-50 rounded"
									>
										<span className="font-semibold">{char}</span>
										<span className="font-mono text-teal-600">{morse}</span>
									</div>
								))}
							</div>
						</div>

						{/* Information */}
						<div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-amber-900 mb-3">
								摩斯電碼說明
							</h3>
							<div className="text-amber-800 space-y-2">
								<p>
									<strong>歷史:</strong>{" "}
									由塞繆爾·摩斯在1830年代發明，用於電報通訊。
								</p>
								<p>
									<strong>編碼規則:</strong>
								</p>
								<ul className="list-disc ml-6 space-y-1">
									<li>短信號（點）：·</li>
									<li>長信號（劃）：— （長度為3個點）</li>
									<li>字母間隔：3個點的長度</li>
									<li>單詞間隔：7個點的長度</li>
								</ul>
								<div className="bg-amber-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>示例:</strong>
									</p>
									<p className="text-sm font-mono">SOS: ... --- ...</p>
									<p className="text-sm font-mono">
										HELLO: .... . .-.. .-.. ---
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
