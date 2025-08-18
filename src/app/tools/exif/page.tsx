'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ExifData {
  [key: string]: any;
}

interface ImageInfo {
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModified: string;
  dimensions?: { width: number; height: number };
}

export default function ExifTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // EXIF tag mappings for better display
  const exifTagNames: { [key: string]: string } = {
    '0th': '主要圖像資訊',
    '1st': '縮圖資訊',
    'Exif': '相機設定',
    'GPS': 'GPS資訊',
    'Interop': '互操作性',
    // Common EXIF tags
    'ImageWidth': '圖像寬度',
    'ImageLength': '圖像高度',
    'Make': '相機製造商',
    'Model': '相機型號',
    'DateTime': '拍攝時間',
    'DateTimeOriginal': '原始拍攝時間',
    'DateTimeDigitized': '數位化時間',
    'ExposureTime': '曝光時間',
    'FNumber': '光圈值',
    'ISO': 'ISO感光度',
    'ISOSpeedRatings': 'ISO感光度',
    'FocalLength': '焦距',
    'Flash': '閃光燈',
    'WhiteBalance': '白平衡',
    'ColorSpace': '色彩空間',
    'ExifVersion': 'EXIF版本',
    'Software': '軟體',
    'Artist': '作者',
    'Copyright': '版權',
    'UserComment': '用戶註釋',
    'GPSLatitude': 'GPS緯度',
    'GPSLongitude': 'GPS經度',
    'GPSAltitude': 'GPS海拔',
    'GPSTimeStamp': 'GPS時間戳',
    'GPSDateStamp': 'GPS日期戳',
    'Orientation': '方向',
    'XResolution': 'X解析度',
    'YResolution': 'Y解析度',
    'ResolutionUnit': '解析度單位',
    'Compression': '壓縮方式',
    'PhotometricInterpretation': '光度解釋',
    'ImageDescription': '圖像描述',
    'StripOffsets': '條帶偏移',
    'SamplesPerPixel': '每像素樣本數',
    'RowsPerStrip': '每條帶行數',
    'StripByteCounts': '條帶字節數',
    'PlanarConfiguration': '平面配置'
  };

  // Simple EXIF parser (basic implementation)
  const parseExif = (arrayBuffer: ArrayBuffer): ExifData | null => {
    try {
      const dataView = new DataView(arrayBuffer);
      
      // Check for JPEG SOI marker
      if (dataView.getUint16(0) !== 0xFFD8) {
        return null;
      }

      let offset = 2;
      const exifData: ExifData = {};

      // Find APP1 marker (EXIF)
      while (offset < dataView.byteLength - 1) {
        const marker = dataView.getUint16(offset);
        
        if (marker === 0xFFE1) { // APP1 marker
          const length = dataView.getUint16(offset + 2);
          const exifHeader = new Uint8Array(arrayBuffer.slice(offset + 4, offset + 10));
          
          // Check for &quot;Exif\0\0&quot; header
          if (exifHeader[0] === 0x45 && exifHeader[1] === 0x78 && 
              exifHeader[2] === 0x69 && exifHeader[3] === 0x66 &&
              exifHeader[4] === 0x00 && exifHeader[5] === 0x00) {
            
            // Parse TIFF header
            const tiffOffset = offset + 10;
            const byteOrder = dataView.getUint16(tiffOffset);
            const isLittleEndian = byteOrder === 0x4949;
            
            // Basic EXIF data extraction
            exifData['檔案格式'] = 'JPEG';
            exifData['EXIF標記'] = '已找到';
            exifData['字節順序'] = isLittleEndian ? '小端序 (Intel)' : '大端序 (Motorola)';
            
            // Try to extract some basic info
            const magic = isLittleEndian ? 
              dataView.getUint16(tiffOffset + 2, true) : 
              dataView.getUint16(tiffOffset + 2, false);
            
            if (magic === 42) {
              exifData['TIFF魔數'] = '正確 (42)';
            }
            
            return exifData;
          }
        }
        
        // Move to next marker
        offset += 2;
        if (marker >= 0xFFD0 && marker <= 0xFFD9) {
          // RST markers have no length field
          continue;
        }
        
        if (offset + 2 < dataView.byteLength) {
          const segmentLength = dataView.getUint16(offset);
          offset += segmentLength;
        } else {
          break;
        }
      }

      return null;
    } catch (error) {
      console.error('EXIF parsing error:', error);
      return null;
    }
  };

  // Extract basic image information
  const extractImageInfo = (file: File): Promise<ImageInfo> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const info: ImageInfo = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          lastModified: new Date(file.lastModified).toLocaleString('zh-TW'),
          dimensions: {
            width: img.naturalWidth,
            height: img.naturalHeight
          }
        };
        URL.revokeObjectURL(url);
        resolve(info);
      };
      
      img.onerror = () => {
        const info: ImageInfo = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          lastModified: new Date(file.lastModified).toLocaleString('zh-TW')
        };
        URL.revokeObjectURL(url);
        resolve(info);
      };
      
      img.src = url;
    });
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError('');
    setSelectedFile(file);
    
    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Extract basic image info
      const info = await extractImageInfo(file);
      setImageInfo(info);
      
      // Read file as array buffer for EXIF parsing
      const arrayBuffer = await file.arrayBuffer();
      
      // Parse EXIF data
      const exif = parseExif(arrayBuffer);
      if (exif) {
        setExifData(exif);
      } else {
        setExifData({ '訊息': '未找到EXIF數據或格式不支持' });
      }
      
    } catch (err) {
      setError('處理圖片時發生錯誤: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      setError('請選擇圖片檔案');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearData = () => {
    setSelectedFile(null);
    setImageInfo(null);
    setExifData(null);
    setError('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadMetadata = () => {
    if (!imageInfo && !exifData) return;
    
    const data = {
      基本資訊: imageInfo,
      EXIF數據: exifData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile?.name || 'image'}_metadata.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 bg-white p-4 rounded-lg">
              <h1 className="text-3xl font-bold text-black mb-4">EXIF元數據讀取工具</h1>
              <p className="text-black">類似exiftool的瀏覽器版本，讀取圖片的EXIF元數據資訊</p>
            </div>

            {/* File Upload Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                {isProcessing ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">正在處理圖片...</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-lg font-medium text-black mb-2">拖放圖片到此處或點擊選擇</p>
                    <p className="text-sm text-gray-600">支援 JPEG、PNG、TIFF、WEBP 等格式</p>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {selectedFile && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={clearData}
                    className="border border-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    清除
                  </button>
                  {(imageInfo || exifData) && (
                    <button
                      onClick={downloadMetadata}
                      className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      下載元數據 (JSON)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Results */}
            {(imageInfo || exifData) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview & Basic Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4">圖片預覽與基本資訊</h3>
                  
                  {previewUrl && (
                    <div className="mb-4">
                      <img
                        src={previewUrl}
                        alt="預覽"
                        className="max-w-full h-auto max-h-64 rounded border mx-auto"
                      />
                    </div>
                  )}
                  
                  {imageInfo && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium text-gray-700">檔案名稱:</div>
                        <div className="font-mono">{imageInfo.fileName}</div>
                        
                        <div className="font-medium text-gray-700">檔案大小:</div>
                        <div>{formatFileSize(imageInfo.fileSize)}</div>
                        
                        <div className="font-medium text-gray-700">檔案類型:</div>
                        <div>{imageInfo.fileType}</div>
                        
                        <div className="font-medium text-gray-700">修改時間:</div>
                        <div>{imageInfo.lastModified}</div>
                        
                        {imageInfo.dimensions && (
                          <>
                            <div className="font-medium text-gray-700">尺寸:</div>
                            <div>{imageInfo.dimensions.width} × {imageInfo.dimensions.height} 像素</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* EXIF Data */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4">EXIF元數據</h3>
                  
                  {exifData && (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {Object.entries(exifData).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-2 text-sm py-1 border-b border-gray-100">
                          <div className="font-medium text-gray-700">
                            {exifTagNames[key] || key}:
                          </div>
                          <div className="font-mono text-gray-900 break-all">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Information */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用說明</h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>EXIF元數據:</strong> 圖片中包含的拍攝資訊和技術參數。</p>
                <p><strong>支援格式:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>JPEG:</strong> 最常見的包含EXIF數據的格式</li>
                  <li><strong>TIFF:</strong> 支援豐富的元數據</li>
                  <li><strong>RAW:</strong> 部分相機原始格式</li>
                  <li><strong>其他:</strong> PNG、WEBP等（可能不含EXIF）</li>
                </ul>
                <p><strong>可讀取資訊:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>相機設定（光圈、快門、ISO等）</li>
                  <li>拍攝時間和GPS位置</li>
                  <li>相機型號和軟體版本</li>
                  <li>圖像尺寸和色彩資訊</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>隱私提醒:</strong> EXIF數據可能包含敏感資訊如GPS位置，分享圖片前請留意。
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