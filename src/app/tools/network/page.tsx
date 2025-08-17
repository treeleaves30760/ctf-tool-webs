"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NetworkTool() {
	const [tool, setTool] = useState<"ping" | "dns" | "port" | "ip" | "whois">("dns");
	const [target, setTarget] = useState("");
	const [output, setOutput] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// DNS Lookup simulation
	const performDNSLookup = (hostname: string) => {
		// This is a frontend simulation - real DNS would need backend
		const commonDNS = {
			"google.com": ["142.250.191.14", "2404:6800:4012:1::200e"],
			"github.com": ["140.82.112.3"],
			"cloudflare.com": ["104.16.124.96", "104.16.123.96"],
			"example.com": ["93.184.216.34"],
			"localhost": ["127.0.0.1", "::1"]
		};

		let result = `DNS查詢結果: ${hostname}\n\n`;
		
		if (commonDNS[hostname as keyof typeof commonDNS]) {
			const ips = commonDNS[hostname as keyof typeof commonDNS];
			result += `A記錄:\n`;
			ips.forEach(ip => {
				if (!ip.includes(':')) {
					result += `  ${hostname} → ${ip}\n`;
				}
			});
			
			const ipv6 = ips.filter(ip => ip.includes(':'));
			if (ipv6.length > 0) {
				result += `\nAAAA記錄:\n`;
				ipv6.forEach(ip => {
					result += `  ${hostname} → ${ip}\n`;
				});
			}
		} else {
			result += `未找到DNS記錄 (這是前端模擬)\n`;
		}

		result += `\n其他記錄類型:\n`;
		result += `MX (郵件): 請使用專門工具查詢\n`;
		result += `TXT: 請使用專門工具查詢\n`;
		result += `NS (名稱伺服器): 請使用專門工具查詢\n`;

		return result;
	};

	// IP Information analysis
	const analyzeIP = (ip: string) => {
		const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
		const match = ip.match(ipRegex);
		
		if (!match) {
			return "無效的IPv4地址格式";
		}

		const [, a, b, c, d] = match.map(Number);
		
		if (a > 255 || b > 255 || c > 255 || d > 255) {
			return "IP地址超出有效範圍";
		}

		let result = `IP地址分析: ${ip}\n\n`;
		
		// IP Class
		if (a >= 1 && a <= 126) {
			result += `類別: A類 (1.0.0.0 - 126.255.255.255)\n`;
			result += `網路位數: 8位\n`;
			result += `主機位數: 24位\n`;
		} else if (a >= 128 && a <= 191) {
			result += `類別: B類 (128.0.0.0 - 191.255.255.255)\n`;
			result += `網路位數: 16位\n`;
			result += `主機位數: 16位\n`;
		} else if (a >= 192 && a <= 223) {
			result += `類別: C類 (192.0.0.0 - 223.255.255.255)\n`;
			result += `網路位數: 24位\n`;
			result += `主機位數: 8位\n`;
		} else if (a >= 224 && a <= 239) {
			result += `類別: D類 (多播地址)\n`;
		} else {
			result += `類別: E類 (實驗用途)\n`;
		}

		// Special ranges
		if (ip === "127.0.0.1") {
			result += `特殊地址: 本地環回地址\n`;
		} else if (a === 10) {
			result += `特殊地址: 私有地址 (RFC 1918)\n`;
		} else if (a === 172 && b >= 16 && b <= 31) {
			result += `特殊地址: 私有地址 (RFC 1918)\n`;
		} else if (a === 192 && b === 168) {
			result += `特殊地址: 私有地址 (RFC 1918)\n`;
		} else if (a === 169 && b === 254) {
			result += `特殊地址: 鏈路本地地址 (APIPA)\n`;
		}

		// Binary representation
		result += `\n二進制表示:\n`;
		result += `${a.toString(2).padStart(8, '0')}.`;
		result += `${b.toString(2).padStart(8, '0')}.`;
		result += `${c.toString(2).padStart(8, '0')}.`;
		result += `${d.toString(2).padStart(8, '0')}\n`;

		// Hex representation
		result += `\n十六進制表示:\n`;
		result += `${a.toString(16).padStart(2, '0').toUpperCase()}.`;
		result += `${b.toString(16).padStart(2, '0').toUpperCase()}.`;
		result += `${c.toString(16).padStart(2, '0').toUpperCase()}.`;
		result += `${d.toString(16).padStart(2, '0').toUpperCase()}\n`;

		return result;
	};

	// Port Scanner simulation
	const scanPorts = (target: string, ports?: string) => {
		const portList = ports ? ports.split(',').map(p => parseInt(p.trim())) : [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 8080];
		
		let result = `埠掃描結果: ${target}\n\n`;
		result += `掃描埠: ${portList.join(', ')}\n\n`;
		
		// Common ports info
		const portInfo: Record<number, string> = {
			21: "FTP",
			22: "SSH",
			23: "Telnet",
			25: "SMTP",
			53: "DNS",
			80: "HTTP",
			110: "POP3",
			143: "IMAP",
			443: "HTTPS",
			993: "IMAPS",
			995: "POP3S",
			8080: "HTTP-Alt"
		};

		result += `常見埠服務:\n`;
		portList.forEach(port => {
			const service = portInfo[port] || "未知";
			const status = Math.random() > 0.7 ? "開放" : "關閉"; // Random simulation
			result += `${port}/tcp  ${status.padEnd(6)} ${service}\n`;
		});

		result += `\n注意: 這是前端模擬結果，實際使用請用專門工具\n`;
		
		return result;
	};

	// Ping simulation
	const performPing = (hostname: string) => {
		let result = `PING ${hostname} 模擬結果:\n\n`;
		
		for (let i = 1; i <= 4; i++) {
			const time = (Math.random() * 50 + 10).toFixed(1);
			const ttl = Math.floor(Math.random() * 10) + 54;
			result += `來自 ${hostname} 的回覆: 位元組=32 時間=${time}ms TTL=${ttl}\n`;
		}
		
		result += `\n${hostname} 的 Ping 統計資料:\n`;
		result += `    封包: 已傳送 = 4，已收到 = 4， 已遺失 = 0 (0% 遺失)，\n`;
		result += `來回行程的估計時間 (毫秒):\n`;
		result += `    最小值 = 12ms，最大值 = 45ms，平均 = 28ms\n`;
		result += `\n注意: 這是前端模擬結果\n`;
		
		return result;
	};

	// WHOIS simulation
	const performWhois = (domain: string) => {
		let result = `WHOIS查詢結果: ${domain}\n\n`;
		
		const whoisData = {
			"google.com": {
				registrar: "MarkMonitor Inc.",
				created: "1997-09-15",
				expires: "2028-09-14",
				nameservers: ["ns1.google.com", "ns2.google.com", "ns3.google.com", "ns4.google.com"]
			},
			"github.com": {
				registrar: "CSC Corporate Domains, Inc.",
				created: "2007-10-09",
				expires: "2024-10-09",
				nameservers: ["dns1.p08.nsone.net", "dns2.p08.nsone.net"]
			}
		};

		const data = whoisData[domain as keyof typeof whoisData];
		
		if (data) {
			result += `域名: ${domain}\n`;
			result += `註冊商: ${data.registrar}\n`;
			result += `建立日期: ${data.created}\n`;
			result += `到期日期: ${data.expires}\n`;
			result += `名稱伺服器:\n`;
			data.nameservers.forEach(ns => {
				result += `  ${ns}\n`;
			});
		} else {
			result += `未找到 ${domain} 的WHOIS資料 (這是前端模擬)\n`;
		}
		
		result += `\n注意: 這是簡化的模擬結果\n`;
		result += `實際WHOIS查詢需要後端服務支援\n`;
		
		return result;
	};

	const handleExecute = async () => {
		if (!target.trim()) {
			setOutput("請輸入目標主機名或IP地址");
			return;
		}

		setIsLoading(true);
		setOutput("執行中...");

		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 1000));

		try {
			let result = "";
			
			switch (tool) {
				case "dns":
					result = performDNSLookup(target);
					break;
				case "ip":
					result = analyzeIP(target);
					break;
				case "port":
					result = scanPorts(target);
					break;
				case "ping":
					result = performPing(target);
					break;
				case "whois":
					result = performWhois(target);
					break;
			}
			
			setOutput(result);
		} catch (error) {
			setOutput("執行出錯: " + (error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClear = () => {
		setTarget("");
		setOutput("");
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(output);
	};

	const getToolDescription = () => {
		switch (tool) {
			case "dns": return "查詢域名的DNS記錄";
			case "ip": return "分析IP地址的類別和特性";
			case "port": return "掃描目標主機的常見埠";
			case "ping": return "測試與目標主機的連通性";
			case "whois": return "查詢域名的註冊資訊";
		}
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
								網路工具
							</h1>
							<p className="text-black">
								網路診斷、DNS查詢、埠掃描等基本網路工具
							</p>
						</div>

						{/* Controls */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<div className="flex flex-wrap gap-4 mb-6">
								<div className="flex items-center space-x-2">
									<label className="text-sm font-medium text-black">
										工具:
									</label>
									<select
										value={tool}
										onChange={(e) =>
											setTool(e.target.value as any)
										}
										className="bg-white text-black border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
									>
										<option value="dns">DNS查詢</option>
										<option value="ip">IP分析</option>
										<option value="port">埠掃描</option>
										<option value="ping">Ping測試</option>
										<option value="whois">WHOIS查詢</option>
									</select>
								</div>
							</div>

							<div className="mb-4">
								<p className="text-sm text-gray-600 mb-2">
									{getToolDescription()}
								</p>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Input */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										目標 ({tool === "ip" ? "IP地址" : "主機名/域名"})
									</label>
									<input
										type="text"
										value={target}
										onChange={(e) => setTarget(e.target.value)}
										className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-600"
										placeholder={
											tool === "ip" 
												? "例如: 192.168.1.1" 
												: tool === "whois"
												? "例如: google.com"
												: "例如: google.com 或 192.168.1.1"
										}
									/>
								</div>

								{/* Output */}
								<div>
									<label className="block text-sm font-medium text-black mb-2">
										執行結果
									</label>
									<textarea
										value={output}
										readOnly
										className="bg-white text-black w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-600 font-mono"
										placeholder="結果將顯示在這裡..."
									/>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3 mt-6">
								<button
									onClick={handleExecute}
									disabled={!target || isLoading}
									className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? "執行中..." : "執行"}
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
								網路工具說明
							</h3>
							<div className="text-blue-800 space-y-3">
								<div>
									<p><strong>DNS查詢:</strong> 查詢域名對應的IP地址和DNS記錄</p>
									<p><strong>IP分析:</strong> 分析IP地址的類別、範圍和特殊用途</p>
									<p><strong>埠掃描:</strong> 檢查目標主機開放的服務埠</p>
									<p><strong>Ping測試:</strong> 測試網路連通性和延遲</p>
									<p><strong>WHOIS查詢:</strong> 查詢域名註冊資訊</p>
								</div>
								
								<div>
									<p><strong>CTF應用場景:</strong></p>
									<ul className="list-disc ml-6 mt-1 space-y-1">
										<li>偵察目標網路架構</li>
										<li>發現隱藏的服務和埠</li>
										<li>分析網路流量和通訊模式</li>
										<li>查找DNS中隱藏的子域名</li>
									</ul>
								</div>

								<div>
									<p><strong>常用埠和服務:</strong></p>
									<ul className="list-disc ml-6 mt-1 space-y-1">
										<li>21 (FTP), 22 (SSH), 23 (Telnet)</li>
										<li>25 (SMTP), 53 (DNS), 80 (HTTP), 443 (HTTPS)</li>
										<li>110 (POP3), 143 (IMAP), 993 (IMAPS), 995 (POP3S)</li>
										<li>8080 (HTTP-Alt), 3389 (RDP), 5432 (PostgreSQL)</li>
									</ul>
								</div>

								<div className="bg-blue-100 p-3 rounded mt-3">
									<p className="text-sm">
										<strong>注意:</strong> 
										此工具提供前端模擬功能，實際網路掃描需要後端支援。
										在CTF中請使用專業工具如nmap、dig、nslookup等。
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