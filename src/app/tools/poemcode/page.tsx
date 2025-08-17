"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PoemCodeTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-8 bg-white p-4 rounded-lg">
							<h1 className="text-3xl font-bold text-black mb-4">詩詞密碼工具</h1>
							<p className="text-black">基於詩詞文本的傳統密碼編碼方法</p>
						</div>
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
							<div className="text-center">
								<div className="text-6xl mb-4">📝</div>
								<h2 className="text-2xl font-bold text-yellow-800 mb-2">此功能即將推出</h2>
								<p className="text-yellow-700 mb-4">我們正在開發基於詩詞的多種密碼編碼方法</p>
								<div className="text-sm text-yellow-600">
									預計功能：
									<ul className="list-disc list-inside mt-2 space-y-1">
										<li>古詩詞藏頭密碼編碼</li>
										<li>詩句字符位置編碼</li>
										<li>韻律密碼系統</li>
										<li>多種中文古典密碼變體</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">詩詞密碼簡介</h3>
							<div className="text-blue-800 space-y-2">
								<p><strong>歷史:</strong> 中國古代常用的隱語密碼，通過詩詞韻文傳遞秘密信息。</p>
								<p><strong>方法:</strong> 包括藏頭詩、字符位置編碼、韻律編碼等多種形式。</p>
								<p><strong>特點:</strong> 表面看是普通詩文，實際暗藏密碼信息，隱蔽性極強。</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm"><strong>常見類型:</strong></p>
									<div className="text-xs mt-2">
										<div>• 藏頭詩：每句首字連讀成密碼</div>
										<div>• 藏尾詩：每句末字連讀成密碼</div>
										<div>• 字位密碼：特定位置字符組成密碼</div>
										<div>• 韻律密碼：利用平仄韻律編碼</div>
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