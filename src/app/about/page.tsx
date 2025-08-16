import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						{/* Header */}
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-4">
								關於 CTF 線上工具
							</h1>
							<p className="text-gray-600">專業的CTF競賽工具平台</p>
						</div>

						{/* Content */}
						<div className="space-y-8">
							{/* Introduction */}
							<section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									專案介紹
								</h2>
								<div className="text-gray-700 space-y-4">
									<p>
										CTF線上工具是一個專為CTF競賽和網路安全學習者設計的綜合性工具平台。
										我們致力於提供最全面、最實用的線上編解碼和密碼學工具。
									</p>
									<p>
										本平台整合了50多種常用編碼工具、20多種古典密碼學演算法，以及10多種實用的雜項工具，
										涵蓋了CTF競賽中最常見的題型和解題需求。
									</p>
								</div>
							</section>

							{/* Features */}
							<section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									功能特色
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h3 className="text-lg font-semibold text-teal-600 mb-2">
											🔐 編碼工具
										</h3>
										<ul className="text-gray-700 space-y-1">
											<li>• Base家族編碼 (Base64, Base32, Base16等)</li>
											<li>• URL、HTML、JavaScript編碼</li>
											<li>• 進制轉換工具</li>
											<li>• 雜湊計算 (MD5, SHA系列)</li>
											<li>• 對稱加密 (AES, DES, RC4)</li>
										</ul>
									</div>
									<div>
										<h3 className="text-lg font-semibold text-teal-600 mb-2">
											🔢 密碼學演算法
										</h3>
										<ul className="text-gray-700 space-y-1">
											<li>• 古典密碼 (凱薩、維吉尼亞等)</li>
											<li>• 替換密碼 (仿射、柵欄等)</li>
											<li>• 特殊編碼 (摩斯、敲擊碼)</li>
											<li>• 現代密碼分析工具</li>
											<li>• 自動化破解功能</li>
										</ul>
									</div>
								</div>
							</section>

							{/* Open Source */}
							<section className="bg-teal-50 border border-teal-200 rounded-lg p-6">
								<h2 className="text-2xl font-semibold text-teal-900 mb-4">
									開源專案
								</h2>
								<div className="text-teal-800 space-y-4">
									<p>
										本專案完全開源，遵循 MIT 許可證。我們歡迎社群貢獻，包括：
									</p>
									<ul className="list-disc ml-6 space-y-1">
										<li>新工具的新增和現有工具的改進</li>
										<li>介面優化和使用者體驗提升</li>
										<li>效能優化和程式碼重構</li>
										<li>文檔完善和多語言支援</li>
										<li>Bug修復和安全性增強</li>
									</ul>
									<div className="mt-4 p-4 bg-teal-100 rounded-lg">
										<p className="font-semibold mb-2">參與貢獻：</p>
										<p className="text-sm">
											造訪我們的 GitHub 儲存庫，提交 Issue 或 Pull Request。
											讓我們一起為CTF社群建設更好的工具平台！
										</p>
									</div>
								</div>
							</section>

							{/* Contact */}
							<section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<h2 className="text-2xl font-semibold text-gray-900 mb-4">
									聯繫我們
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">
											意見回饋
										</h3>
										<p className="text-gray-700 mb-2">
											如果您在使用過程中遇到問題，或有功能建議，歡迎聯繫我們：
										</p>
										<ul className="text-gray-700 space-y-1">
											<li>📧 Email: treeleaves30760@gmail.com</li>
											<li>
												🐙 GitHub:{" "}
												<a
													href="https://github.com/treeleaves30760/ctf-tool-webs"
													target="_blank"
													rel="noopener noreferrer"
												>
													https://github.com/treeleaves30760/ctf-tool-webs
												</a>
											</li>
										</ul>
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">
											支持專案
										</h3>
										<p className="text-gray-700 mb-2">
											如果這個專案對您有幫助，您可以通過以下方式支持我們：
										</p>
										<ul className="text-gray-700 space-y-1">
											<li>⭐ 給專案點個星星</li>
											<li>🔗 分享給更多朋友</li>
											<li>💡 提出改進建議</li>
											<li>🤝 參與專案開發</li>
										</ul>
									</div>
								</div>
							</section>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
