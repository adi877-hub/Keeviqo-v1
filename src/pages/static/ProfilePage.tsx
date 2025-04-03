import React from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import UserProfileSettings from '../../components/UserProfileSettings';
import QRCodeGenerator from '../../components/QRCodeGenerator';

function ProfilePage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto p-4">
      <BackButton />
      
      <h1 className="text-3xl font-bold mb-6 text-right">{t('profile.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <UserProfileSettings />
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-right">{t('profile.shareProfile')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-right">{t('profile.shareDescription')}</p>
            
            <QRCodeGenerator 
              data="https://keeviqo.com/profile/share/123"
              title={t('profile.qrCode')}
              showControls={false}
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-right">{t('profile.emergencyAccess')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-right">{t('profile.emergencyDescription')}</p>
            
            <div className="flex justify-end mb-4">
              <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors">
                {t('profile.setupEmergency')}
              </button>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded text-right">
              {t('profile.emergencyWarning')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
