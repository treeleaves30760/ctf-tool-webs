import ToolCard from "@/components/ToolCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
	const encodingTools = [
		{
			title: "Base編碼",
			description: "Base64、Base32、Base16",
			href: "/tools/base64",
			icon: "🔐",
		},
		{
			title: "Hex編碼",
			description: "Hex，十六進制編碼轉換",
			href: "/tools/hex",
			icon: "🔢",
		},
		{
			title: "URL編碼",
			description: "URL編碼解碼",
			href: "/tools/url",
			icon: "🌐",
		},
		{
			title: "Quoted-printable編碼",
			description: "Quoted-printable編碼解碼",
			href: "/tools/quoted",
			icon: "📝",
		},
		{
			title: "Mimetypes",
			description: "取得http訊息標頭應用類型",
			href: "/tools/mimetypes",
			icon: "📄",
		},
		{
			title: "HTML編碼",
			description: "HTML實體編碼解碼",
			href: "/tools/html",
			icon: "🏷️",
		},
		{
			title: "Escape編碼",
			description: "JavaScript Escape編碼",
			href: "/tools/escape",
			icon: "🔀",
		},
		{
			title: "敲擊碼",
			description: "Tap code敲擊碼",
			href: "/tools/tapcode",
			icon: "👆",
		},
		{
			title: "摩斯電碼",
			description: "Morse code摩斯電碼",
			href: "/tools/morse",
			icon: "📡",
		},
		{
			title: "雜湊計算",
			description: "MD5、SHA1、SHA256等雜湊計算",
			href: "/tools/hash",
			icon: "🔒",
		},
		{
			title: "AES加密",
			description: "支援5種模式，5種填充",
			href: "/tools/aes",
			icon: "🛡️",
		},
		{
			title: "DES加密",
			description: "支援5種模式，5種填充",
			href: "/tools/des",
			icon: "🔑",
		},
		{
			title: "Triple DES加密",
			description: "支援5種模式，5種填充",
			href: "/tools/3des",
			icon: "🔐",
		},
		{
			title: "RC4加密",
			description: "多種字元集、Base64輸出",
			href: "/tools/rc4",
			icon: "🔄",
		},
		{
			title: "進制轉換",
			description: "ASCII、任意進制轉換",
			href: "/tools/radix",
			icon: "🔢",
		},
		{
			title: "Base36編碼",
			description: "Base36，支援整數",
			href: "/tools/base36",
			icon: "🔀",
		},
		{
			title: "Base58編碼",
			description: "字元表，支援中文編碼",
			href: "/tools/base58",
			icon: "🔤",
		},
		{
			title: "Base62編碼",
			description: "Base62，整數與字串互轉",
			href: "/tools/base62",
			icon: "🔢",
		},
		{
			title: "Base91編碼",
			description: "Base91，整數與字串互轉",
			href: "/tools/base91",
			icon: "🔀",
		},
		{
			title: "公鑰解析",
			description: "取得加密類型、n、e等參數",
			href: "/tools/pubkey",
			icon: "🔓",
		},
		{
			title: "RSA私鑰解析",
			description: "提取私鑰的n、e、d、p、q",
			href: "/tools/rsa-private",
			icon: "🔑",
		},
		{
			title: "Base92編碼",
			description: "Base92線上編碼、解碼",
			href: "/tools/base92",
			icon: "🔀",
		},
		{
			title: "Base85編碼",
			description: "Base85線上編碼、解碼",
			href: "/tools/base85",
			icon: "🔤",
		},
		{
			title: "ASCII編碼轉換",
			description: "Unicode、UTF-16、UTF-32",
			href: "/tools/ascii",
			icon: "📝",
		},
		{
			title: "ROT47編碼",
			description: "ROT47編碼解碼",
			href: "/tools/rot47",
			icon: "🔄",
		},
		{
			title: "二進制編碼",
			description: "二進制與文字互轉",
			href: "/tools/binary",
			icon: "💾",
		},
		{
			title: "八進制編碼",
			description: "八進制與文字互轉",
			href: "/tools/octal",
			icon: "🔢",
		},
		{
			title: "JWT解碼",
			description: "JSON Web Token解析",
			href: "/tools/jwt",
			icon: "🎫",
		},
		{
			title: "Zlib壓縮",
			description: "Zlib壓縮與解壓縮",
			href: "/tools/zlib",
			icon: "📦",
		},
		{
			title: "Gzip壓縮",
			description: "Gzip壓縮與解壓縮",
			href: "/tools/gzip",
			icon: "🗜️",
		},
	];

	const algorithmTools = [
		{
			title: "ADFGX密碼",
			description: "ADFGX Cipher",
			href: "/tools/adfgx",
			icon: "🔤",
		},
		{
			title: "ADFGVX密碼",
			description: "ADFGVX Cipher",
			href: "/tools/adfgvx",
			icon: "🔠",
		},
		{
			title: "仿射密碼",
			description: "Affine Cipher",
			href: "/tools/affine",
			icon: "📐",
		},
		{
			title: "自動密鑰密碼",
			description: "Autokey Cipher",
			href: "/tools/autokey",
			icon: "🔐",
		},
		{
			title: "埃特巴什碼",
			description: "Atbash Cipher",
			href: "/tools/atbash",
			icon: "🔄",
		},
		{
			title: "博福特密碼",
			description: "Beaufort Cipher",
			href: "/tools/beaufort",
			icon: "🌊",
		},
		{
			title: "雙密碼",
			description: "Bifid Cipher",
			href: "/tools/bifid",
			icon: "👯",
		},
		{
			title: "凱薩密碼",
			description: "Caesar Cipher",
			href: "/tools/caesar",
			icon: "👑",
		},
		{
			title: "列移位密碼",
			description: "Columnar Transposition Cipher",
			href: "/tools/columnar",
			icon: "📊",
		},
		{
			title: "恩尼格瑪密碼",
			description: "Enigma M3 Cipher",
			href: "/tools/enigma",
			icon: "⚙️",
			isComingSoon: true,
		},
		{
			title: "四方密碼",
			description: "Foursquare Cipher",
			href: "/tools/foursquare",
			icon: "⬛",
		},
		{
			title: "Gronsfeld密碼",
			description: "Gronsfeld Cipher",
			href: "/tools/gronsfeld",
			icon: "🔢",
		},
		{
			title: "攜帶型機械密碼",
			description: "M-209 Cipher",
			href: "/tools/m209",
			icon: "📻",
			isComingSoon: true,
		},
		{
			title: "普萊費爾密碼",
			description: "Playfair Cipher",
			href: "/tools/playfair",
			icon: "🎯",
		},
		{
			title: "波利比奧斯方陣密碼",
			description: "Polybius Square Cipher",
			href: "/tools/polybius",
			icon: "🔳",
			isComingSoon: true,
		},
		{
			title: "Porta密碼",
			description: "Porta Cipher",
			href: "/tools/porta",
			icon: "🚪",
		},
		{
			title: "柵欄密碼",
			description: "Railfence Cipher",
			href: "/tools/railfence",
			icon: "🚧",
		},
		{
			title: "Rot13密碼",
			description: "Rot13 Cipher",
			href: "/tools/rot13",
			icon: "🔄",
		},
		{
			title: "簡單替換密碼",
			description: "Simple Substitution Cipher",
			href: "/tools/substitution",
			icon: "🔀",
		},
		{
			title: "維吉尼亞密碼",
			description: "Vigenere Cipher",
			href: "/tools/vigenere",
			icon: "📊",
		},
		{
			title: "豬圈密碼",
			description: "Pigpen Cipher",
			href: "/tools/pigpen",
			icon: "🐷",
		},
		{
			title: "培根密碼",
			description: "Baconian Cipher",
			href: "/tools/bacon",
			icon: "🥓",
		},
		{
			title: "滾動密鑰密碼",
			description: "Running Key Cipher",
			href: "/tools/runkey",
			icon: "🏃",
		},
		{
			title: "希爾密碼",
			description: "Hill Cipher",
			href: "/tools/hill",
			icon: "⛰️",
			isComingSoon: true,
		},
		{
			title: "關鍵字密碼",
			description: "Keyword Cipher",
			href: "/tools/keyword",
			icon: "🔑",
		},
		{
			title: "A1z26密碼",
			description: "A1z26 Cipher",
			href: "/tools/a1z26",
			icon: "🔤",
		},
		{
			title: "XOR密碼",
			description: "XOR異或加密解密",
			href: "/tools/xor",
			icon: "⚡",
		},
		{
			title: "一次性密碼本",
			description: "One-time Pad密碼",
			href: "/tools/otp",
			icon: "📄",
		},
		{
			title: "書本密碼",
			description: "Book Cipher",
			href: "/tools/book",
			icon: "📚",
		},
		{
			title: "同音替換密碼",
			description: "Homophonic Substitution",
			href: "/tools/homophonic",
			icon: "🔊",
		},
		{
			title: "虛無主義密碼",
			description: "Nihilist Cipher",
			href: "/tools/nihilist",
			icon: "❌",
		},
		{
			title: "棋盤密碼",
			description: "Checkerboard Cipher",
			href: "/tools/checkerboard",
			icon: "♟️",
		},
	];

	const miscTools = [
		{
			title: "XXencode",
			description: "XXencode編碼解碼",
			href: "/tools/xxencode",
			icon: "❌",
		},
		{
			title: "UUencode",
			description: "UUencode編碼解碼",
			href: "/tools/uuencode",
			icon: "🔄",
		},
		{
			title: "PPencode",
			description: "PPencode編碼解碼",
			href: "/tools/ppencode",
			icon: "🅿️",
		},
		{
			title: "AAencode",
			description: "AAencode編碼解碼",
			href: "/tools/aaencode",
			icon: "🅰️",
		},
		{
			title: "JJencode",
			description: "JJencode編碼解碼",
			href: "/tools/jjencode",
			icon: "🇯🇵",
		},
		{
			title: "JSfuck",
			description: "JSfuck，試試看",
			href: "/tools/jsfuck",
			icon: "🤬",
		},
		{
			title: "Brainfuck",
			description: "Brainfuck，試試看",
			href: "/tools/brainfuck",
			icon: "🧠",
		},
		{
			title: "BubbleBabble",
			description: "BubbleBabble編碼解碼",
			href: "/tools/bubblebabble",
			icon: "🫧",
		},
		{
			title: "Handycode",
			description: "Handycode編碼解碼",
			href: "/tools/handycode",
			icon: "✋",
		},
		{
			title: "Punycode",
			description: "Punycode編碼解碼",
			href: "/tools/punycode",
			icon: "🌐",
		},
		{
			title: "Poemcode",
			description: "Poemcode編碼解碼",
			href: "/tools/poemcode",
			icon: "📝",
			isComingSoon: true,
		},
		{
			title: "WebSocket測試",
			description: "WebSocket連結測試，傳送資料",
			href: "/tools/websocket",
			icon: "🔌",
		},
		{
			title: "HTTP(S)回應標頭檢視",
			description: "檢視請求的回應標頭資訊",
			href: "/tools/headers",
			icon: "📋",
		},
		{
			title: "QR碼工具",
			description: "QR碼產生器與解碼器",
			href: "/tools/qrcode",
			icon: "📱",
		},
		{
			title: "條碼工具",
			description: "條碼產生器與解碼器",
			href: "/tools/barcode",
			icon: "📊",
		},
		{
			title: "隱寫術工具",
			description: "圖片隱寫分析工具",
			href: "/tools/steganography",
			icon: "🖼️",
		},
		{
			title: "正規表達式測試",
			description: "RegEx正規表達式測試器",
			href: "/tools/regex",
			icon: "🔍",
		},
		{
			title: "JSON格式化",
			description: "JSON格式化與驗證",
			href: "/tools/json",
			icon: "📄",
		},
		{
			title: "XML格式化",
			description: "XML格式化與驗證",
			href: "/tools/xml",
			icon: "📋",
		},
		{
			title: "密碼產生器",
			description: "安全密碼產生器",
			href: "/tools/password",
			icon: "🔐",
		},
		{
			title: "網路工具",
			description: "Ping、DNS查詢等網路工具",
			href: "/tools/network",
			icon: "🌐",
		},
		{
			title: "時間戳轉換",
			description: "Unix時間戳轉換工具",
			href: "/tools/timestamp",
			icon: "⏰",
		},
		{
			title: "顏色轉換",
			description: "RGB、HEX、HSL顏色轉換",
			href: "/tools/color",
			icon: "🎨",
		},
		{
			title: "EXIF元數據",
			description: "圖片EXIF元數據讀取工具",
			href: "/tools/exif",
			icon: "📷",
		},
	];

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1">
				{/* Hero Section */}
				<section className="bg-gradient-to-b from-teal-50 to-white py-8">
					<div className="container mx-auto px-4 text-center">
						<h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
							CTF線上工具
						</h1>
						<p className="text-xl text-black mb-8 max-w-3xl mx-auto">
							為CTF比賽人員、程式設計師提供60多種常用編碼、30多種古典密碼學，以及20多種雜項工具
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="#tools"
								className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
							>
								開始使用
							</a>
							<a
								href="/about"
								className="border border-teal-600 text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
							>
								瞭解更多
							</a>
						</div>
					</div>
				</section>

				{/* CTF Encoding Tools */}
				<section id="tools" className="py-16 bg-white">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-black mb-4">CTF編碼</h2>
							<div className="w-20 h-1 bg-teal-600 mx-auto"></div>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{encodingTools.map((tool, index) => (
								<ToolCard key={index} {...tool} />
							))}
						</div>
					</div>
				</section>

				{/* CTF Algorithm Tools */}
				<section className="py-16 bg-gray-50">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-black mb-4">CTF演算法</h2>
							<div className="w-20 h-1 bg-teal-600 mx-auto"></div>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{algorithmTools.map((tool, index) => (
								<ToolCard key={index} {...tool} />
							))}
						</div>
					</div>
				</section>

				{/* CTF Miscellaneous Tools */}
				<section className="py-16 bg-white">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-black mb-4">CTF雜項</h2>
							<div className="w-20 h-1 bg-teal-600 mx-auto"></div>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{miscTools.map((tool, index) => (
								<ToolCard key={index} {...tool} />
							))}
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
