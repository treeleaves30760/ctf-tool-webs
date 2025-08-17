"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PolybiusTool() {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-8 bg-white p-4 rounded-lg">
							<h1 className="text-3xl font-bold text-black mb-4">波利比奧斯方陣工具</h1>
							<p className="text-black">古希臘的5×5字母數字編碼系統</p>
						</div>
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
							<div className="text-center">
								<div className="text-6xl mb-4">📜</div>
								<h2 className="text-2xl font-bold text-yellow-800 mb-2">此功能即將推出</h2>
								<p className="text-yellow-700 mb-4">我們正在開發波利比奧斯方陣的完整實現</p>
								<div className="text-sm text-yellow-600">
									預計功能：
									<ul className="list-disc list-inside mt-2 space-y-1">
										<li>標準5×5方陣編碼解碼</li>
										<li>可自定義方陣字母順序</li>
										<li>支持數字坐標和字母坐標</li>
										<li>兼容不同的方陣變體</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">波利比奧斯方陣簡介</h3>
							<div className="text-blue-800 space-y-2">
								<p><strong>歷史:</strong> 由古希臘歷史學家波利比奧斯發明的字母編碼系統。</p>
								<p><strong>原理:</strong> 將字母排列在5×5網格中，用行列坐標表示每個字母。</p>
								<p><strong>應用:</strong> 常用於信號傳輸，如燈火信號、敲擊聲等。</p>
								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm"><strong>標準方陣:</strong></p>
									<div className="font-mono text-xs mt-2">
										<div>　 1 2 3 4 5</div>
										<div>1 A B C D E</div>
										<div>2 F G H I K</div>
										<div>3 L M N O P</div>
										<div>4 Q R S T U</div>
										<div>5 V W X Y Z</div>
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