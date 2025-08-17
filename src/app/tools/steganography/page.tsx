"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SteganographyTool() {
	const [mode, setMode] = useState<"analyze" | "extract" | "encode">("analyze");
	const [file, setFile] = useState<File | null>(null);
	const [message, setMessage] = useState("");
	const [output, setOutput] = useState("");
	const [imagePreview, setImagePreview] = useState<string>("");
	const [analysisResults, setAnalysisResults] = useState<any>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			
			// Create preview for images
			if (selectedFile.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					setImagePreview(e.target?.result as string);
				};
				reader.readAsDataURL(selectedFile);
			} else {
				setImagePreview("");
			}
		}
	};

	const analyzeFile = async () => {
		if (!file) {
			setOutput("請選擇一個檔案");
			return;
		}

		try {
			const arrayBuffer = await file.arrayBuffer();
			const bytes = new Uint8Array(arrayBuffer);
			
			// Basic file analysis
			const analysis = {
				filename: file.name,
				size: file.size,
				type: file.type,
				lastModified: new Date(file.lastModified).toLocaleString(),
				entropy: calculateEntropy(bytes),
				header: Array.from(bytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' '),
				trailer: Array.from(bytes.slice(-16)).map(b => b.toString(16).padStart(2, '0')).join(' '),
				suspiciousPatterns: findSuspiciousPatterns(bytes),
				textStrings: extractTextStrings(bytes)
			};

			setAnalysisResults(analysis);
			
			let output = `檔案分析結果:\n\n`;
			output += `檔名: ${analysis.filename}\n`;
			output += `大小: ${analysis.size} bytes\n`;
			output += `類型: ${analysis.type}\n`;
			output += `修改時間: ${analysis.lastModified}\n`;
			output += `熵值: ${analysis.entropy.toFixed(3)} (0-8, 越高越隨機)\n\n`;
			output += `檔案開頭: ${analysis.header}\n`;
			output += `檔案結尾: ${analysis.trailer}\n\n`;
			
			if (analysis.suspiciousPatterns.length > 0) {
				output += `可疑模式:\n${analysis.suspiciousPatterns.join('\n')}\n\n`;
			}
			
			if (analysis.textStrings.length > 0) {
				output += `發現的文字串 (前10個):\n${analysis.textStrings.slice(0, 10).join('\n')}\n`;
			}

			setOutput(output);
		} catch (error) {
			setOutput("分析檔案時出錯: " + (error as Error).message);
		}
	};

	const calculateEntropy = (bytes: Uint8Array): number => {
		const frequencies = new Array(256).fill(0);
		for (const byte of bytes) {
			frequencies[byte]++;
		}
		
		let entropy = 0;
		const length = bytes.length;
		for (const freq of frequencies) {
			if (freq > 0) {
				const probability = freq / length;
				entropy -= probability * Math.log2(probability);
			}
		}
		
		return entropy;
	};

	const findSuspiciousPatterns = (bytes: Uint8Array): string[] => {
		const patterns = [];
		
		// Look for embedded files
		const signatures = [
			{ name: 'PNG', pattern: [0x89, 0x50, 0x4E, 0x47] },
			{ name: 'JPEG', pattern: [0xFF, 0xD8, 0xFF] },
			{ name: 'GIF', pattern: [0x47, 0x49, 0x46] },
			{ name: 'ZIP', pattern: [0x50, 0x4B, 0x03, 0x04] },
			{ name: 'PDF', pattern: [0x25, 0x50, 0x44, 0x46] },
			{ name: 'RAR', pattern: [0x52, 0x61, 0x72, 0x21] }
		];
		
		for (const sig of signatures) {
			for (let i = 1; i <= bytes.length - sig.pattern.length; i++) {
				let match = true;
				for (let j = 0; j < sig.pattern.length; j++) {
					if (bytes[i + j] !== sig.pattern[j]) {
						match = false;
						break;
					}
				}
				if (match) {
					patterns.push(`${sig.name} 檔案標頭在位置 ${i}`);
				}
			}
		}
		
		// Look for repeated patterns
		const patternMap = new Map<string, number>();
		for (let i = 0; i < bytes.length - 4; i++) {
			const pattern = Array.from(bytes.slice(i, i + 4)).join(',');
			patternMap.set(pattern, (patternMap.get(pattern) || 0) + 1);
		}
		
		for (const [pattern, count] of patternMap) {
			if (count > 100) {
				patterns.push(`重複模式 [${pattern}] 出現 ${count} 次`);
			}
		}
		
		return patterns;
	};

	const extractTextStrings = (bytes: Uint8Array): string[] => {
		const strings = [];
		let currentString = "";
		
		for (const byte of bytes) {
			if (byte >= 32 && byte <= 126) { // Printable ASCII
				currentString += String.fromCharCode(byte);
			} else {
				if (currentString.length >= 4) {
					strings.push(currentString);
				}
				currentString = "";
			}
		}
		
		if (currentString.length >= 4) {
			strings.push(currentString);
		}
		
		return strings.filter((s, i, arr) => arr.indexOf(s) === i); // Remove duplicates
	};

	const extractLSB = async () => {
		if (!file || !file.type.startsWith('image/')) {
			setOutput("請選擇一個圖片檔案");
			return;
		}

		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			const img = new Image();
			
			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx?.drawImage(img, 0, 0);
				
				const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
				if (!imageData) return;
				
				let binaryString = "";
				const data = imageData.data;
				
				// Extract LSB from red channel
				for (let i = 0; i < data.length; i += 4) {
					binaryString += (data[i] & 1).toString();
				}
				
				// Try to convert binary to text
				let extractedText = "";
				for (let i = 0; i < binaryString.length - 8; i += 8) {
					const byte = binaryString.substr(i, 8);
					const char = String.fromCharCode(parseInt(byte, 2));
					if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
						extractedText += char;
					} else {
						break; // Stop at first non-printable character
					}
				}
				
				let output = `LSB提取結果:\n\n`;
				output += `圖片尺寸: ${img.width}x${img.height}\n`;
				output += `總像素: ${img.width * img.height}\n`;
				output += `提取的二進制位數: ${binaryString.length}\n\n`;
				output += `二進制 (前100位): ${binaryString.substring(0, 100)}...\n\n`;
				
				if (extractedText.length > 0) {
					output += `提取的文字: ${extractedText.substring(0, 500)}`;
					if (extractedText.length > 500) output += "...";
				} else {
					output += `未發現可讀文字`;
				}
				
				setOutput(output);
			};
			
			img.src = imagePreview;
		} catch (error) {
			setOutput("LSB提取時出錯: " + (error as Error).message);
		}
	};

	const embedLSB = async () => {
		if (!file || !file.type.startsWith('image/')) {
			setOutput("請選擇一個圖片檔案");
			return;
		}
		
		if (!message) {
			setOutput("請輸入要隱藏的訊息");
			return;
		}

		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			const img = new Image();
			
			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx?.drawImage(img, 0, 0);
				
				const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
				if (!imageData) return;
				
				// Convert message to binary
				let binaryMessage = "";
				for (const char of message) {
					binaryMessage += char.charCodeAt(0).toString(2).padStart(8, '0');
				}
				binaryMessage += "1111111111111110"; // End marker
				
				const data = imageData.data;
				let messageIndex = 0;
				
				// Embed message in LSB of red channel
				for (let i = 0; i < data.length && messageIndex < binaryMessage.length; i += 4) {
					const bit = parseInt(binaryMessage[messageIndex]);
					data[i] = (data[i] & 0xFE) | bit; // Clear LSB and set new bit
					messageIndex++;
				}
				
				ctx?.putImageData(imageData, 0, 0);
				
				// Convert to download link
				const dataURL = canvas.toDataURL('image/png');
				const link = document.createElement('a');
				link.download = 'steganography_output.png';
				link.href = dataURL;
				
				setOutput(`LSB嵌入完成!\n\n訊息長度: ${message.length} 字符\n二進制長度: ${binaryMessage.length} 位\n使用像素: ${messageIndex}\n\n點擊下載按鈕取得結果圖片`);
				
				// Auto download
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			};
			
			img.src = imagePreview;
		} catch (error) {
			setOutput("LSB嵌入時出錯: " + (error as Error).message);
		}
	};

	const handleProcess = () => {
		switch (mode) {
			case "analyze":
				analyzeFile();
				break;
			case "extract":
				extractLSB();
				break;
			case "encode":
				embedLSB();
				break;
		}
	};

	const handleClear = () => {
		setFile(null);
		setMessage("");
		setOutput("");
		setImagePreview("");
		setAnalysisResults(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
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
								隱寫術工具
							</h1>
							<p className="text-black">
								圖片隱寫分析、LSB提取和嵌入工具
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
											setMode(e.target.value as "analyze" | "extract" | "encode")
										}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value="analyze">檔案分析</option>
										<option value="extract">LSB提取</option>
										<option value="encode">LSB嵌入</option>
									</select>
								</div>
							</div>

							{/* File Upload */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-black mb-2">
									選擇檔案
								</label>
								<input
									ref={fileInputRef}
									type="file"
									onChange={handleFileSelect}
									accept={mode === "extract" || mode === "encode" ? "image/*" : "*"}
									className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
								/>
								{file && (
									<p className="text-sm text-gray-600 mt-2">
										已選擇: {file.name} ({(file.size / 1024).toFixed(1)} KB)
									</p>
								)}
							</div>

							{/* Message Input for Encoding */}
							{mode === "encode" && (
								<div className="mb-6">
									<label className="block text-sm font-medium text-black mb-2">
										要隱藏的訊息
									</label>
									<textarea
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										className="bg-white text-black w-full h-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder="請輸入要隱藏在圖片中的訊息..."
									/>
								</div>
							)}

							{/* Image Preview */}
							{imagePreview && (
								<div className="mb-6">
									<label className="block text-sm font-medium text-black mb-2">
										圖片預覽
									</label>
									<img
										src={imagePreview}
										alt="Preview"
										className="max-w-full max-h-64 border border-gray-300 rounded-md"
									/>
								</div>
							)}

							{/* Output */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-black mb-2">
									分析結果
								</label>
								<textarea
									value={output}
									readOnly
									className="bg-white text-black w-full h-64 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono"
									placeholder="結果將顯示在這裡..."
								/>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3">
								<button
									onClick={handleProcess}
									disabled={!file || (mode === "encode" && !message)}
									className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{mode === "analyze" ? "分析檔案" : mode === "extract" ? "提取訊息" : "嵌入訊息"}
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
								隱寫術工具說明
							</h3>
							<div className="text-blue-800 space-y-3">
								<div>
									<p><strong>檔案分析:</strong> 檢查檔案結構、熵值、嵌入檔案和可疑模式</p>
									<p><strong>LSB提取:</strong> 從圖片的最低有效位提取隱藏的二進制數據</p>
									<p><strong>LSB嵌入:</strong> 將文字訊息嵌入到圖片的最低有效位中</p>
								</div>
								
								<div>
									<p><strong>CTF應用場景:</strong></p>
									<ul className="list-disc ml-6 mt-1 space-y-1">
										<li>圖片中隱藏的flag或提示</li>
										<li>檔案尾部附加的隱藏內容</li>
										<li>多個檔案合併的痕跡檢測</li>
										<li>像素級別的訊息隱藏</li>
									</ul>
								</div>

								<div>
									<p><strong>分析技巧:</strong></p>
									<ul className="list-disc ml-6 mt-1 space-y-1">
										<li>檢查檔案熵值異常（正常圖片熵值通常在7-8之間）</li>
										<li>尋找檔案中的異常檔案標頭</li>
										<li>分析重複模式和可讀文字串</li>
										<li>嘗試不同的提取方法和位平面</li>
									</ul>
								</div>

								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>注意:</strong> 
										此工具僅支援基本的LSB隱寫術，實際CTF中可能需要更複雜的方法如DCT域隱寫、多通道分析等。
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