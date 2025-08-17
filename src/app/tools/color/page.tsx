'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ColorTool() {
  const [hex, setHex] = useState('#ff5733');
  const [rgb, setRgb] = useState({ r: 255, g: 87, b: 51 });
  const [hsl, setHsl] = useState({ h: 9, s: 100, l: 60 });
  const [hsv, setHsv] = useState({ h: 9, s: 80, v: 100 });
  const [cmyk, setCmyk] = useState({ c: 0, m: 66, y: 80, k: 0 });

  // Convert RGB to other formats
  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;

    let h = 0, s = 0;
    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum;
      switch (max) {
        case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / diff + 2) / 6; break;
        case b: h = ((r - g) / diff + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const v = max;

    let h = 0, s = 0;
    if (max !== 0) s = diff / max;
    if (diff !== 0) {
      switch (max) {
        case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / diff + 2) / 6; break;
        case b: h = ((r - g) / diff + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    return { 
      c: Math.round(c * 100), 
      m: Math.round(m * 100), 
      y: Math.round(y * 100), 
      k: Math.round(k * 100) 
    };
  };

  // Convert from other formats to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 1/6) { r = c; g = x; b = 0; }
    else if (h < 2/6) { r = x; g = c; b = 0; }
    else if (h < 3/6) { r = 0; g = c; b = x; }
    else if (h < 4/6) { r = 0; g = x; b = c; }
    else if (h < 5/6) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  const updateFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
    setCmyk(rgbToCmyk(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHexChange = (newHex: string) => {
    setHex(newHex);
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      const newRgb = hexToRgb(newHex);
      updateFromRgb(newRgb);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [component]: Math.max(0, Math.min(255, value)) };
    updateFromRgb(newRgb);
  };

  const handleHslChange = (component: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [component]: value };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
    setCmyk(rgbToCmyk(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleRandomColor = () => {
    const randomRgb = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
    updateFromRgb(randomRgb);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const currentColor = rgbToHex(rgb.r, rgb.g, rgb.b);

  const colorVariations = [
    { name: '當前顏色', color: currentColor },
    { name: '反轉', color: rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b) },
    { name: '灰階', color: (() => {
      const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
      return rgbToHex(gray, gray, gray);
    })() },
  ];

  // Generate complementary and analogous colors
  const complementaryColor = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
  const analogous1 = hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l);
  const analogous2 = hslToRgb((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);

  colorVariations.push(
    { name: '互補色', color: rgbToHex(complementaryColor.r, complementaryColor.g, complementaryColor.b) },
    { name: '類似色1', color: rgbToHex(analogous1.r, analogous1.g, analogous1.b) },
    { name: '類似色2', color: rgbToHex(analogous2.r, analogous2.g, analogous2.b) }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">顏色轉換工具</h1>
              <p className="text-black">在RGB、HEX、HSL、HSV、CMYK等顏色格式之間轉換</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Color Preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-black mb-4">顏色預覽</h3>
                <div 
                  className="w-full h-40 rounded-lg border border-gray-300 mb-4"
                  style={{ backgroundColor: currentColor }}
                ></div>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-lg text-black">{currentColor}</div>
                  <button
                    onClick={handleRandomColor}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    隨機顏色
                  </button>
                </div>
              </div>

              {/* Color Input Forms */}
              <div className="space-y-6">
                {/* HEX */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-black">HEX</label>
                    <button
                      onClick={() => copyToClipboard(hex)}
                      className="text-xs text-teal-600 hover:text-teal-700"
                    >
                      複製
                    </button>
                  </div>
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="bg-white text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 font-mono"
                  />
                </div>

                {/* RGB */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-black">RGB</label>
                    <button
                      onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                      className="text-xs text-teal-600 hover:text-teal-700"
                    >
                      複製
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">R</label>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgb.r}
                        onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                        className="bg-white text-black w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">G</label>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgb.g}
                        onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                        className="bg-white text-black w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">B</label>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgb.b}
                        onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                        className="bg-white text-black w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* HSL */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-black">HSL</label>
                    <button
                      onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                      className="text-xs text-teal-600 hover:text-teal-700"
                    >
                      複製
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">H</label>
                      <input
                        type="number"
                        min="0"
                        max="360"
                        value={hsl.h}
                        onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                        className="bg-white text-black w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">S%</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={hsl.s}
                        onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                        className="bg-white text-black w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">L%</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={hsl.l}
                        onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                        className="bg-white text-black w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* CMYK */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-black">CMYK</label>
                    <button
                      onClick={() => copyToClipboard(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`)}
                      className="text-xs text-teal-600 hover:text-teal-700"
                    >
                      複製
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <div>
                      <label className="text-xs text-gray-600">C%</label>
                      <div className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 font-mono">
                        {cmyk.c}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">M%</label>
                      <div className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 font-mono">
                        {cmyk.m}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Y%</label>
                      <div className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 font-mono">
                        {cmyk.y}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">K%</label>
                      <div className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 font-mono">
                        {cmyk.k}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Variations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">顏色變化</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {colorVariations.map((variation, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="w-full h-20 rounded-lg border border-gray-300 mb-2 cursor-pointer"
                      style={{ backgroundColor: variation.color }}
                      onClick={() => handleHexChange(variation.color)}
                    ></div>
                    <div className="text-xs text-gray-600">{variation.name}</div>
                    <div className="text-xs font-mono text-black">{variation.color}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>顏色格式:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>HEX:</strong> 十六進制表示法，如 #FF5733</li>
                  <li><strong>RGB:</strong> 紅綠藍三色值，範圍 0-255</li>
                  <li><strong>HSL:</strong> 色相(0-360°)、飽和度(0-100%)、亮度(0-100%)</li>
                  <li><strong>HSV:</strong> 色相(0-360°)、飽和度(0-100%)、明度(0-100%)</li>
                  <li><strong>CMYK:</strong> 印刷四色模式，青、洋紅、黃、黑</li>
                </ul>
                <p><strong>應用:</strong> 網頁設計、圖形設計、CTF隱寫術分析等。</p>
                <p className="text-sm mt-3">
                  <strong>提示:</strong> 點擊顏色變化區域的色塊可以快速應用該顏色。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}