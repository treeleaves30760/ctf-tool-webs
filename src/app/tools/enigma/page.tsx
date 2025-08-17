"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EnigmaTool() {
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
								恩尼格瑪密碼機工具
							</h1>
							<p className="text-black">
								二戰德軍使用的著名轉子密碼機模擬器
							</p>
						</div>

						{/* Coming Soon Notice */}
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
							<div className="text-center">
								<div className="text-6xl mb-4">🔧</div>
								<h2 className="text-2xl font-bold text-yellow-800 mb-2">
									此功能即將推出
								</h2>
								<p className="text-yellow-700 mb-4">
									我們正在開發完整的恩尼格瑪密碼機模擬器，包括多種型號和配置選項
								</p>
								<div className="text-sm text-yellow-600">
									預計功能：
									<ul className="list-disc list-inside mt-2 space-y-1">
										<li>多種恩尼格瑪機型號支持（I, II, III, M3, M4等）</li>
										<li>可配置的轉子、反射器和插線板設置</li>
										<li>歷史準確的加密/解密流程</li>
										<li>轉子位置和環設置的完整控制</li>
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
								恩尼格瑪密碼機簡介
							</h3>
							<div className="text-blue-800 space-y-2">
								<p>
									<strong>歷史:</strong>{" "}
									恩尼格瑪機是二戰期間德軍使用的電機械轉子密碼機，被認為是不可破解的。
								</p>
								<p>
									<strong>原理:</strong>{" "}
									使用多個轉子和反射器進行復雜的字母替換，每次輸入後轉子位置改變。
								</p>
								<p>
									<strong>破解:</strong>{" "}
									最終被英國布萊切利園的密碼學家（包括圖靈）成功破解，對戰爭進程產生重大影響。
								</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>主要組件:</strong>
									</p>
									<div className="text-xs mt-2">
										<div>• 鍵盤：26個字母輸入</div>
										<div>• 燈板：顯示加密結果</div>
										<div>• 插線板：額外的字母交換</div>
										<div>• 轉子：核心加密組件</div>
										<div>• 反射器：信號反射組件</div>
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