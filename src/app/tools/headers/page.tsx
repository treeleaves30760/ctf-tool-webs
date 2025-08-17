"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HeadersTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [url, setUrl] = useState("https://example.com");

	const analyzeHeaders = (headerText: string) => {
		const lines = headerText.split('\n').filter(line => line.trim());
		const analysis: string[] = [];
		const headers: { [key: string]: string } = {};
		
		// Parse headers
		lines.forEach(line => {
			const colonIndex = line.indexOf(':');
			if (colonIndex > 0) {
				const key = line.substring(0, colonIndex).trim().toLowerCase();
				const value = line.substring(colonIndex + 1).trim();
				headers[key] = value;
			}
		});

		analysis.push("=== HTTP標頭分析結果 ===\n");
		
		// Security headers analysis
		const securityHeaders = {
			'content-security-policy': 'CSP保護',
			'x-frame-options': '點擊劫持保護',
			'x-content-type-options': 'MIME類型保護',
			'strict-transport-security': 'HTTPS強制',
			'x-xss-protection': 'XSS保護',
			'referrer-policy': '引用策略'
		};

		analysis.push("🔒 安全標頭檢查:");
		Object.entries(securityHeaders).forEach(([header, desc]) => {
			if (headers[header]) {
				analysis.push(`✅ ${desc}: ${headers[header]}`);
			} else {
				analysis.push(`❌ 缺少 ${desc} (${header})`);
			}
		});

		analysis.push("\n📊 服務器信息:");
		if (headers['server']) {
			analysis.push(`服務器: ${headers['server']}`);
		}
		if (headers['x-powered-by']) {
			analysis.push(`技術棧: ${headers['x-powered-by']}`);
		}
		if (headers['content-type']) {
			analysis.push(`內容類型: ${headers['content-type']}`);
		}
		if (headers['content-length']) {
			analysis.push(`內容長度: ${headers['content-length']} bytes`);
		}

		analysis.push("\n🍪 Cookie相關:");
		if (headers['set-cookie']) {
			analysis.push(`設置Cookie: ${headers['set-cookie']}`);
		}
		if (headers['cookie']) {
			analysis.push(`發送Cookie: ${headers['cookie']}`);
		}

		analysis.push("\n📱 其他重要標頭:");
		Object.entries(headers).forEach(([key, value]) => {
			if (!securityHeaders[key] && !['server', 'x-powered-by', 'content-type', 'content-length', 'set-cookie', 'cookie'].includes(key)) {
				analysis.push(`${key}: ${value}`);
			}
		});

		return analysis.join('\n');
	};

	const generateCurlCommand = (url: string, headers?: string) => {
		let cmd = `curl -I "${url}"`;
		
		if (headers) {
			const lines = headers.split('\n').filter(line => line.trim() && line.includes(':'));
			lines.forEach(line => {
				const colonIndex = line.indexOf(':');
				if (colonIndex > 0) {
					const key = line.substring(0, colonIndex).trim();
					const value = line.substring(colonIndex + 1).trim();
					cmd += ` \\\n  -H "${key}: ${value}"`;
				}
			});
		}
		
		return cmd;
	};

	const generateCommonHeaders = () => {
		return `Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Authorization: Bearer YOUR_TOKEN_HERE
X-Requested-With: XMLHttpRequest
Origin: https://example.com
Referer: https://example.com/page`;
	};

	const handleAnalyze = () => {
		if (!input.trim()) {
			setOutput("請輸入HTTP標頭內容");
			return;
		}
		
		const result = analyzeHeaders(input);
		setOutput(result);
	};

	const handleGenerateCurl = () => {
		const result = generateCurlCommand(url, input);
		setOutput(result);
	};

	const handleGenerateHeaders = () => {
		const headers = generateCommonHeaders();
		setInput(headers);
		setOutput("已生成常用HTTP標頭模板");
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
								HTTP標頭分析工具
							</h1>
							<p className="text-black">
								分析HTTP響應標頭，檢查安全配置和生成cURL命令
							</p>
						</div>

						{/* Controls */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<div className="mb-6">
								<label className="block text-sm font-medium text-black mb-2">
									URL (用於生成cURL命令)
								</label>
								<input
									type="text"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
									placeholder="https://example.com"
								/>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										HTTP標頭內容
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600 font-mono"
										placeholder="Content-Type: application/json&#10;Server: nginx/1.18.0&#10;X-Frame-Options: DENY&#10;..."
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										分析結果
									</label>
									<textarea
										value={output}
										readOnly
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono"
										placeholder="分析結果將顯示在這裡..."
									/>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3 mt-6">
								<button
									onClick={handleAnalyze}
									className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
								>
									分析標頭
								</button>
								<button
									onClick={handleGenerateCurl}
									className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
								>
									生成cURL
								</button>
								<button
									onClick={handleGenerateHeaders}
									className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
								>
									生成模板
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
								HTTP標頭工具說明
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>功能:</strong>{" "}
									分析HTTP響應標頭，檢查安全配置，生成cURL命令。
								</p>
								<p>
									<strong>安全檢查:</strong>{" "}
									自動檢查CSP、HSTS、X-Frame-Options等重要安全標頭。
								</p>
								<p>
									<strong>用途:</strong>{" "}
									Web安全測試、API調試、滲透測試等場景。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>重要安全標頭:</strong>
									</p>
									<div className="text-xs mt-2">
										<div>• Content-Security-Policy: 防止XSS攻擊</div>
										<div>• X-Frame-Options: 防止點擊劫持</div>
										<div>• Strict-Transport-Security: 強制HTTPS</div>
										<div>• X-Content-Type-Options: 防止MIME嗅探</div>
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