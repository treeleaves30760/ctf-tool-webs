"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function M209Tool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-8 bg-white p-4 rounded-lg">
							<h1 className="text-3xl font-bold text-black mb-4">M209密碼機工具</h1>
							<p className="text-black">美軍二戰時期使用的便攜式密碼機</p>
						</div>
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
							<div className="text-center">
								<div className="text-6xl mb-4">⚙️</div>
								<h2 className="text-2xl font-bold text-yellow-800 mb-2">此功能即將推出</h2>
								<p className="text-yellow-700 mb-4">我們正在開發M209密碼機的完整模擬器</p>
								<div className="text-sm text-yellow-600">
									預計功能：
									<ul className="list-disc list-inside mt-2 space-y-1">
										<li>6個轉輪和27個齒輪的精確模擬</li>
										<li>可配置的齒輪組合和轉輪設置</li>
										<li>歷史準確的加密流程</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">M209密碼機簡介</h3>
							<div className="text-blue-800 space-y-2">
								<p><strong>歷史:</strong> 二戰期間美軍廣泛使用的便攜式機械密碼機。</p>
								<p><strong>設計:</strong> 由Boris Hagelin設計，基於轉輪原理但與恩尼格瑪機不同。</p>
								<p><strong>特點:</strong> 體積小、重量輕，適合野戰條件下使用。</p>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}