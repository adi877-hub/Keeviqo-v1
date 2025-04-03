import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generateQRCode } from '../utils/api';

interface QRCodeGeneratorProps {
  data?: string;
  size?: number;
  title?: string;
  description?: string;
  showControls?: boolean;
}

function QRCodeGenerator({
  data: initialData = '',
  size = 200,
  title,
  description,
  showControls = true,
}: QRCodeGeneratorProps) {
  const { t } = useTranslation();
  const [data, setData] = useState(initialData);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async (value: string) => {
    if (!value.trim()) {
      setError(t('qrcode.error.emptyData'));
      setQrCodeUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateQRCode(value);
      setQrCodeUrl(response.url); // Using url instead of qrCodeUrl
    } catch (err) {
      setError(t('qrcode.error.generation'));
      console.error('QR code generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      generateCode(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateCode(data);
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'keeviqo-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {title && <h2 className="text-xl font-semibold mb-4 text-right">{title}</h2>}
      {description && <p className="mb-4 text-gray-600 dark:text-gray-400 text-right">{description}</p>}
      
      {showControls && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="qrData" className="block text-gray-700 dark:text-gray-300 text-right mb-2">
              {t('qrcode.dataLabel')}
            </label>
            <input
              type="text"
              id="qrData"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder={t('qrcode.placeholder')}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors w-full"
          >
            {isLoading ? t('qrcode.generating') : t('qrcode.generate')}
          </button>
        </form>
      )}
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 text-right">
          {error}
        </div>
      )}
      
      {qrCodeUrl && (
        <div className="flex flex-col items-center">
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            width={size} 
            height={size} 
            className="mb-4"
          />
          
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
          >
            {t('qrcode.download')}
          </button>
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;
