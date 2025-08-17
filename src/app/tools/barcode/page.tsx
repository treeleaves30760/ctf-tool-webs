"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BarcodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");
	const [barcodeType, setBarcodeType] = useState<"code128" | "code39" | "ean13" | "binary">("code128");
	const [binaryOutput, setBinaryOutput] = useState("");

	// Code39 mapping
	const code39Map: Record<string, string> = {
		'0': '101001101101', '1': '110100101101', '2': '101100101101', '3': '110110010101',
		'4': '101001101101', '5': '110100110101', '6': '101100110101', '7': '101001011101',
		'8': '110100101011', '9': '101100101011', 'A': '110101001101', 'B': '101101001101',
		'C': '110110100101', 'D': '101011001101', 'E': '110101100101', 'F': '101101100101',
		'G': '101010011101', 'H': '110101001011', 'I': '101101001011', 'J': '101011001011',
		'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
		'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
		'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
		'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
		'-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101'
	};

	// Simple EAN13 check digit calculation
	const calculateEAN13CheckDigit = (digits: string): string => {
		const nums = digits.split('').map(d => parseInt(d));
		let sum = 0;
		for (let i = 0; i < 12; i++) {
			sum += i % 2 === 0 ? nums[i] : nums[i] * 3;
		}
		return ((10 - (sum % 10)) % 10).toString();
	};

	// Code128 simplified encoding
	const encodeCode128 = (text: string): string => {
		// This is a simplified version - real Code128 is much more complex
		let result = "11010010000"; // Start B
		let checksum = 104; // Start B value
		
		for (let i = 0; i < text.length; i++) {
			const char = text.charCodeAt(i);
			const value = char - 32; // ASCII to Code128 value
			checksum += value * (i + 1);
			
			// Simplified pattern generation
			const pattern = ((value * 11) % 255).toString(2).padStart(11, '0');
			result += pattern;
		}
		
		// Add checksum and stop
		const checksumPattern = (checksum % 103).toString(2).padStart(11, '0');
		result += checksumPattern + "1100011101011"; // Stop
		
		return result;
	};

	const encodeCode39 = (text: string): string => {
		const cleaned = text.toUpperCase().replace(/[^A-Z0-9\-\. ]/g, '');
		let result = code39Map['*']; // Start character
		
		for (const char of cleaned) {
			if (code39Map[char]) {
				result += '0' + code39Map[char]; // Inter-character gap
			}
		}
		
		result += '0' + code39Map['*']; // Stop character
		return result;
	};

	const encodeEAN13 = (text: string): string => {
		const digits = text.replace(/\D/g, '');
		if (digits.length < 12) {
			return "EAN13需要12位數字";
		}
		
		const barcode = digits.substring(0, 12);
		const checkDigit = calculateEAN13CheckDigit(barcode);
		const fullCode = barcode + checkDigit;
		
		// EAN13 encoding patterns (simplified)
		const leftOdd = ['0001101', '0011001', '0010011', '0111101', '0100011'];
		const leftEven = ['0100111', '0110011', '0011011', '0100001', '0011101'];
		const right = ['1110010', '1100110', '1101100', '1000010', '1011100'];
		
		let result = '101'; // Start
		
		// First digit determines pattern for left side
		const firstDigit = parseInt(fullCode[0]);
		const pattern = '000000'; // Simplified - all odd patterns
		
		// Left side (6 digits)
		for (let i = 1; i <= 6; i++) {
			const digit = parseInt(fullCode[i]);
			result += leftOdd[digit % 5] || '0001101';
		}
		
		result += '01010'; // Center
		
		// Right side (6 digits)
		for (let i = 7; i <= 12; i++) {
			const digit = parseInt(fullCode[i]);
			result += right[digit % 5] || '1110010';
		}
		
		result += '101'; // End
		
		return `完整條碼: ${fullCode}\n二進制: ${result}`;
	};

	const generateBinaryBarcode = (text: string): string => {
		// Simple binary encoding for text
		return text.split('').map(char => 
			char.charCodeAt(0).toString(2).padStart(8, '0')
		).join('');
	};

	const decodeBinary = (binary: string): string => {
		const chunks = binary.match(/.{1,8}/g) || [];
		return chunks.map(chunk => {
			const decimal = parseInt(chunk, 2);
			return isNaN(decimal) ? '?' : String.fromCharCode(decimal);
		}).join('');
	};

	const decodeCode39 = (binary: string): string => {
		const reverseMap: Record<string, string> = {};
		Object.entries(code39Map).forEach(([char, pattern]) => {
			reverseMap[pattern] = char;
		});
		
		// Try to find patterns in the binary
		let result = "解碼結果: ";
		const patterns = binary.split('0');
		
		for (const pattern of patterns) {
			if (pattern.length > 10) {
				if (reverseMap[pattern]) {
					result += reverseMap[pattern];
				}
			}
		}
		
		return result || "無法解碼";
	};

	const handleEncode = () => {
		try {
			let result = "";
			
			switch (barcodeType) {
				case "code128":
					result = encodeCode128(input);
					setBinaryOutput(result);
					setOutput(`Code128編碼完成\n二進制長度: ${result.length} 位`);
					break;
					
				case "code39":
					result = encodeCode39(input);
					setBinaryOutput(result);
					setOutput(`Code39編碼完成\n原文: ${input.toUpperCase()}\n二進制長度: ${result.length} 位`);
					break;
					
				case "ean13":
					result = encodeEAN13(input);
					setOutput(result);
					break;
					
				case "binary":
					result = generateBinaryBarcode(input);
					setBinaryOutput(result);
					setOutput(`文字轉二進制完成\n二進制: ${result}`);
					break;
			}
		} catch (error) {
			setOutput("編碼出錯: " + (error as Error).message);
		}
	};

	const handleDecode = () => {
		try {
			let result = "";
			
			switch (barcodeType) {
				case "code39":
					result = decodeCode39(input);
					setOutput(result);
					break;
					
				case "binary":
					result = decodeBinary(input);
					setOutput(`二進制解碼結果: ${result}`);
					break;
					
				default:
					setOutput("該條碼類型暫不支援解碼");
			}
		} catch (error) {
			setOutput("解碼出錯: " + (error as Error).message);
		}
	};

	const handleConvert = () => {
		if (mode === "encode") {
			handleEncode();
		} else {
			handleDecode();
		}
	};

	const handleClear = () => {
		setInput("");
		setOutput("");
		setBinaryOutput("");
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(output);
	};

	const handleCopyBinary = () => {
		navigator.clipboard.writeText(binaryOutput);
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
								條碼工具
							</h1>
							<p className="text-black">
								生成和解析常見條碼格式的工具
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

								<div className="flex items-center space-x-2">
									<label className="text-sm font-medium text-black">
										條碼類型:
									</label>
									<select
										value={barcodeType}
										onChange={(e) =>
											setBarcodeType(e.target.value as any)
										}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value="code128">Code 128</option>
										<option value="code39">Code 39</option>
										<option value="ean13">EAN-13</option>
										<option value="binary">二進制</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "encode" ? "文字/數字" : "二進制/條碼"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "encode"
												? "請輸入要編碼的文字或數字..."
												: "請輸入要解碼的二進制或條碼數據..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸出 ({mode === "encode" ? "條碼信息" : "解碼結果"})
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

						{/* Binary Output */}
						{binaryOutput && (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-black">
										二進制條碼數據
									</h3>
									<button
										onClick={handleCopyBinary}
										className="text-sm border border-gray-300 text-black px-4 py-1 rounded-md hover:bg-gray-50 transition-colors"
									>
										複製二進制
									</button>
								</div>
								<div className="bg-gray-50 p-4 rounded-md">
									<code className="text-sm font-mono break-all">
										{binaryOutput}
									</code>
								</div>
								<p className="text-sm text-gray-600 mt-2">
									長度: {binaryOutput.length} 位
								</p>
							</div>
						)}

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								條碼格式說明
							</h3>
							<div className="text-blue-800 space-y-3">
								<div>
									<p><strong>Code 128:</strong> 高密度一維條碼，支援完整ASCII字符集</p>
									<p><strong>Code 39:</strong> 字母數字條碼，支援A-Z、0-9和部分符號</p>
									<p><strong>EAN-13:</strong> 歐洲商品條碼，13位數字標準</p>
									<p><strong>二進制:</strong> 將文字轉換為二進制表示</p>
								</div>
								
								<div>
									<p><strong>CTF應用:</strong></p>
									<ul className="list-disc ml-6 mt-1 space-y-1">
										<li>隱藏在圖片中的條碼信息</li>
										<li>二進制數據的視覺化表示</li>
										<li>商品編號中隱藏的訊息</li>
										<li>條碼校驗位的計算驗證</li>
									</ul>
								</div>

								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>使用提示:</strong> 
										在CTF中條碼常用於隱藏文字信息，可以嘗試將圖片中的條碼轉換為二進制再解碼。
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