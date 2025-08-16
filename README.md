# CTF Tool Web

A comprehensive web-based toolkit for Capture The Flag (CTF) competitions. This application provides quick access to essential encoding, decoding, and cryptographic tools commonly used in CTF challenges.

## 🛠️ Available Tools

### Encoding & Decoding

- **Base Encodings**: Base64, Base36, Base58, Base62, Base85, Base91, Base92
- **Character Encodings**: ASCII, Hex, HTML entities, URL encoding
- **Escape Sequences**: Various escape/unescape utilities
- **Quoted Printable**: Email encoding standard

### Cryptography

- **Classical Ciphers**: Caesar cipher, Morse code, Tap code
- **Modern Encryption**: AES, 3DES, DES, RC4
- **Hash Functions**: MD5, SHA-1, SHA-256, SHA-512, and more
- **Public Key Cryptography**: RSA utilities

### Utilities

- **MIME Types**: File type identification
- **Radix Conversion**: Number base conversions
- **Public Key Analysis**: Key format analysis and conversion

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to access the tools.

## 💡 Usage

Each tool provides:

- **Input/Output areas** for data transformation
- **Real-time processing** as you type
- **Copy-to-clipboard** functionality for quick results
- **Clear explanations** of each tool's purpose

Perfect for:

- CTF competitions
- Security research
- Educational purposes
- Quick data transformations

## 🏗️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- Modern web standards for optimal performance

## 📦 Deployment

Deploy easily on any platform that supports Next.js:

- **Vercel** (recommended): One-click deployment
- **Netlify**: Git-based deployments
- **Docker**: Containerized deployment
- **Static hosting**: Export as static files

```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Add new tools
- Improve existing functionality
- Fix bugs
- Enhance documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
