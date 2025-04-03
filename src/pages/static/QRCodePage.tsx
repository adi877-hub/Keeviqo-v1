import React from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import QRCodeGenerator from '../../components/QRCodeGenerator';

function QRCodePage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto p-4">
      <BackButton />
      
      <h1 className="text-3xl font-bold mb-6 text-right">{t('qrcode.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <QRCodeGenerator 
            title={t('qrcode.generator.title')}
            description={t('qrcode.generator.description')}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-right">{t('qrcode.howto.title')}</h2>
          
          <div className="space-y-4 text-right">
            <p className="text-gray-700 dark:text-gray-300">{t('qrcode.howto.step1')}</p>
            <p className="text-gray-700 dark:text-gray-300">{t('qrcode.howto.step2')}</p>
            <p className="text-gray-700 dark:text-gray-300">{t('qrcode.howto.step3')}</p>
            <p className="text-gray-700 dark:text-gray-300">{t('qrcode.howto.step4')}</p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="font-semibold mb-2 text-right">{t('qrcode.tips.title')}</h3>
            <ul className="list-disc list-inside space-y-2 text-right">
              <li>{t('qrcode.tips.item1')}</li>
              <li>{t('qrcode.tips.item2')}</li>
              <li>{t('qrcode.tips.item3')}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-right">{t('qrcode.examples.title')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-right">{t('qrcode.examples.personal.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-right">{t('qrcode.examples.personal.description')}</p>
            <QRCodeGenerator 
              data="https://keeviqo.com/profile/123"
              size={150}
              showControls={false}
            />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-right">{t('qrcode.examples.document.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-right">{t('qrcode.examples.document.description')}</p>
            <QRCodeGenerator 
              data="https://keeviqo.com/document/456"
              size={150}
              showControls={false}
            />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-right">{t('qrcode.examples.emergency.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-right">{t('qrcode.examples.emergency.description')}</p>
            <QRCodeGenerator 
              data="https://keeviqo.com/emergency/789"
              size={150}
              showControls={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodePage;
