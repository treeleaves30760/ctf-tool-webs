'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CTF</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CTF Tools</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-teal-600 transition-colors">
              首頁
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-teal-600 transition-colors flex items-center space-x-1">
                <span>工具箱</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">CTF編碼</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <Link href="/tools/base64" className="block hover:text-teal-600">Base編碼</Link>
                        <Link href="/tools/hex" className="block hover:text-teal-600">Hex編碼</Link>
                        <Link href="/tools/url" className="block hover:text-teal-600">URL編碼</Link>
                        <Link href="/tools/morse" className="block hover:text-teal-600">摩斯電碼</Link>
                      </div>
                    </div>
                    <hr className="border-gray-200" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">CTF演算法</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <Link href="/tools/caesar" className="block hover:text-teal-600">凱薩密碼</Link>
                        <Link href="/tools/vigenere" className="block hover:text-teal-600">維吉尼亞密碼</Link>
                        <Link href="/tools/affine" className="block hover:text-teal-600">仿射密碼</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/about" className="text-gray-700 hover:text-teal-600 transition-colors">
              關於
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              <Link href="/" className="block py-2 text-gray-700 hover:text-teal-600 transition-colors">
                首頁
              </Link>
              <Link href="/tools" className="block py-2 text-gray-700 hover:text-teal-600 transition-colors">
                工具箱
              </Link>
              <Link href="/about" className="block py-2 text-gray-700 hover:text-teal-600 transition-colors">
                關於
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}