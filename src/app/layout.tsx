import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CTF線上工具 - CTF工具|CTF編碼|CTF密碼學|CTF加解密|程式設計師工具|線上編解碼",
  description: "CTF線上工具為CTF比賽人員、程式設計師提供50多種常用編碼，如base家族編碼、摩斯電碼，20多種古典密碼學，如仿射密碼、柵欄密碼、培根密碼等，以及10多種雜項工具。",
  keywords: "CTF線上工具、CTF工具、CTF工具箱、CTF工具包、CTF編碼、CTF加解密、CTF密碼學、CTF演算法、base64編碼、base64線上解碼、URL編碼、HTML編碼、ADFGX密碼、凱薩密碼、rot13線上",
  authors: [{ name: "CTF Tools" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
