"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HillTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");

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
								希爾密碼工具
							</h1>
							<p className="text-black">
								基於線性代數的多字母替換密碼
							</p>
						</div>

						{/* Coming Soon Notice */}
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
							<div className="text-center">
								<div className="text-6xl mb-4">📐</div>
								<h2 className="text-2xl font-bold text-yellow-800 mb-2">
									此功能即將推出
								</h2>
								<p className="text-yellow-700 mb-4">
									我們正在開發完整的希爾密碼實現，包括矩陣運算和模運算
								</p>
								<div className="text-sm text-yellow-600">
									預計功能：
									<ul className="list-disc list-inside mt-2 space-y-1">
										<li>支持2×2、3×3等不同大小的密鑰矩陣</li>
										<li>自動計算矩陣的模逆</li>
										<li>可逆性檢查和錯誤提示</li>
										<li>矩陣運算過程的詳細顯示</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Placeholder Interface */}
						<div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200 p-6 mb-6 opacity-50">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-gray-500 mb-2">
										輸入 (明文/密文)
									</label>
									<textarea
										value={input}
										onChange={(e) => setInput(e.target.value)}
										disabled
										className="bg-gray-50 text-gray-400 w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-not-allowed"
										placeholder="功能開發中..."
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-gray-500 mb-2">
										輸出 (密文/明文)
									</label>
									<textarea
										value={output}
										readOnly
										disabled
										className="bg-gray-50 text-gray-400 w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-not-allowed"
										placeholder="結果將顯示在這裡..."
									/>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3 mt-6">
								<button
									disabled
									className="bg-gray-400 text-white px-6 py-2 rounded-md cursor-not-allowed"
								>
									加密/解密
								</button>
								<button
									onClick={handleClear}
									disabled
									className="border border-gray-300 text-gray-400 px-6 py-2 rounded-md cursor-not-allowed"
								>
									清空
								</button>
								<button
									onClick={handleCopy}
									disabled
									className="border border-gray-300 text-gray-400 px-6 py-2 rounded-md cursor-not-allowed"
								>
									複製結果
								</button>
							</div>
						</div>

						{/* Information */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								希爾密碼簡介
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>發明者:</strong>{" "}
									由數學家Lester S. Hill於1929年發明的多字母替換密碼。
								</p>
								<p>
									<strong>原理:</strong>{" "}
									使用矩陣乘法對字母塊進行線性變換，基於模26的算術運算。
								</p>
								<p>
									<strong>安全性:</strong>{" "}
									相比單字母替換密碼更安全，但容易受到已知明文攻擊。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>數學原理:</strong>
									</p>
									<div className="text-xs mt-2 font-mono">
										<div>加密：C = K × P (mod 26)</div>
										<div>解密：P = K⁻¹ × C (mod 26)</div>
										<div>其中K是密鑰矩陣，P是明文向量，C是密文向量</div>
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