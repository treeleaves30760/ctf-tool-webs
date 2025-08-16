import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Website Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">網站相關</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">關於網站</Link></li>
              <li><Link href="/sitemap" className="hover:text-white transition-colors">導航地圖</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">小額贊助</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition-colors">更新日誌</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">合作交流</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: ctftools@example.com</li>
              <li>技術交流群: 364788699</li>
              <li>洽談合作QQ: 1521770894</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">友情連結</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="https://github.com" className="hover:text-white transition-colors">GitHub</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">CTF社群</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">線上工具</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/tools/base64" className="hover:text-white transition-colors">Base64編碼</Link></li>
              <li><Link href="/tools/hash" className="hover:text-white transition-colors">雜湊計算</Link></li>
              <li><Link href="/tools/caesar" className="hover:text-white transition-colors">凱薩密碼</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 <span className="text-teal-400">CTF Tools</span> - 目前版本: <span className="text-teal-400">v1.0.0</span></p>
        </div>
      </div>
    </footer>
  );
}