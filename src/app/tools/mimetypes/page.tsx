"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MimeTypesTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [mode, setMode] = useState<"detect" | "lookup">("detect");

	const handleDetect = () => {
		try {
			if (mode === "detect") {
				// File signature detection
				const signatures = [
					{
						pattern: /^89504E47/,
						mime: "image/png",
						ext: ".png",
						desc: "PNG圖片",
					},
					{
						pattern: /^FFD8FF/,
						mime: "image/jpeg",
						ext: ".jpg",
						desc: "JPEG圖片",
					},
					{
						pattern: /^474946/,
						mime: "image/gif",
						ext: ".gif",
						desc: "GIF圖片",
					},
					{
						pattern: /^504B0304/,
						mime: "application/zip",
						ext: ".zip",
						desc: "ZIP壓縮檔",
					},
					{
						pattern: /^504B030414/,
						mime: "application/vnd.openxmlformats-officedocument",
						ext: ".docx/.xlsx/.pptx",
						desc: "Office文檔",
					},
					{
						pattern: /^25504446/,
						mime: "application/pdf",
						ext: ".pdf",
						desc: "PDF文檔",
					},
					{
						pattern: /^D0CF11E0/,
						mime: "application/vnd.ms-office",
						ext: ".doc/.xls/.ppt",
						desc: "舊版Office文檔",
					},
					{
						pattern: /^377ABCAF271C/,
						mime: "application/x-7z-compressed",
						ext: ".7z",
						desc: "7-Zip壓縮檔",
					},
					{
						pattern: /^1F8B08/,
						mime: "application/gzip",
						ext: ".gz",
						desc: "Gzip壓縮檔",
					},
					{
						pattern: /^52617221/,
						mime: "application/x-rar-compressed",
						ext: ".rar",
						desc: "RAR壓縮檔",
					},
					{
						pattern: /^4D5A/,
						mime: "application/x-msdownload",
						ext: ".exe",
						desc: "Windows可執行檔",
					},
					{
						pattern: /^7F454C46/,
						mime: "application/x-executable",
						ext: "",
						desc: "Linux可執行檔",
					},
					{
						pattern: /^3C3F786D6C/,
						mime: "text/xml",
						ext: ".xml",
						desc: "XML文檔",
					},
					{
						pattern: /^3C68746D6C/,
						mime: "text/html",
						ext: ".html",
						desc: "HTML文檔",
					},
					{
						pattern: /^49443303/,
						mime: "audio/mpeg",
						ext: ".mp3",
						desc: "MP3音檔",
					},
					{
						pattern: /^FFFE/,
						mime: "text/plain",
						ext: ".txt",
						desc: "UTF-16 LE文字檔",
					},
					{
						pattern: /^FEFF/,
						mime: "text/plain",
						ext: ".txt",
						desc: "UTF-16 BE文字檔",
					},
					{
						pattern: /^EFBBBF/,
						mime: "text/plain",
						ext: ".txt",
						desc: "UTF-8 BOM文字檔",
					},
				];

				const hex = input.toUpperCase().replace(/[^0-9A-F]/g, "");
				const results = [];

				for (const sig of signatures) {
					if (sig.pattern.test(hex)) {
						results.push(
							`檔案類型: ${sig.desc}\nMIME類型: ${sig.mime}\n副檔名: ${sig.ext}\n文件簽名: ${sig.pattern.source}`
						);
					}
				}

				if (results.length === 0) {
					setOutput("未能識別文件類型，可能是未知格式或文件頭不完整。");
				} else {
					setOutput(results.join("\n\n"));
				}
			} else {
				// Extension to MIME type lookup
				const extensions = {
					html: "text/html",
					htm: "text/html",
					css: "text/css",
					js: "text/javascript",
					json: "application/json",
					xml: "text/xml",
					txt: "text/plain",
					pdf: "application/pdf",
					doc: "application/msword",
					docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					xls: "application/vnd.ms-excel",
					xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					ppt: "application/vnd.ms-powerpoint",
					pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
					png: "image/png",
					jpg: "image/jpeg",
					jpeg: "image/jpeg",
					gif: "image/gif",
					bmp: "image/bmp",
					svg: "image/svg+xml",
					ico: "image/x-icon",
					mp3: "audio/mpeg",
					wav: "audio/wav",
					ogg: "audio/ogg",
					mp4: "video/mp4",
					avi: "video/x-msvideo",
					mov: "video/quicktime",
					zip: "application/zip",
					rar: "application/x-rar-compressed",
					"7z": "application/x-7z-compressed",
					tar: "application/x-tar",
					gz: "application/gzip",
				};

				const ext = input
					.toLowerCase()
					.replace(".", "") as keyof typeof extensions;
				const mime = extensions[ext];

				if (mime) {
					setOutput(`副檔名: .${ext}\nMIME類型: ${mime}`);
				} else {
					setOutput("未知的副檔名，無法查詢對應的MIME類型。");
				}
			}
		} catch (error) {
			setOutput("檢測出錯: " + (error as Error).message);
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
								MIME類型檢測工具
							</h1>
							<p className="text-black">
								檢測文件類型和MIME類型，支援文件簽名識別和副檔名查詢
							</p>
						</div>

						{/* Controls */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<div className="flex flex-wrap gap-4 mb-6">
								<div className="flex items-center space-x-2">
									<label className="text-sm font-medium text-black">
										檢測模式:
									</label>
									<select
										value={mode}
										onChange={(e) =>
											setMode(e.target.value as "detect" | "lookup")
										}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value="detect">文件簽名檢測</option>
										<option value="lookup">副檔名查詢</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										輸入 ({mode === "detect" ? "十六進位文件頭" : "副檔名"})
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											mode === "detect"
												? "請輸入文件的十六進位頭部（如: 89504E47）..."
												: "請輸入副檔名（如: png, jpg, pdf）..."
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										檢測結果
									</label>
									<textarea
										value={output}
										readOnly
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600"
										placeholder="檢測結果將顯示在這裡..."
									/>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3 mt-6">
								<button
									onClick={handleDetect}
									className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
								>
									{mode === "detect" ? "檢測類型" : "查詢MIME"}
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
								使用說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>文件簽名檢測:</strong>{" "}
									通過分析文件的十六進位頭部來識別真實的文件類型。
								</p>
								<p>
									<strong>副檔名查詢:</strong> 根據副檔名查詢對應的MIME類型。
								</p>
								<p>
									<strong>應用場景:</strong>{" "}
									文件偽造檢測、網站開發、文件上傳驗證等。
								</p>
								<p className="text-sm mt-3">
									<strong>提示:</strong>{" "}
									文件簽名檢測比副檔名更可靠，因為副檔名可以被輕易修改。
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
