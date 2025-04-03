import React from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      
      <h1 className="text-3xl font-bold mb-6 text-right">{t('about.title')}</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-right">{t('about.mission.title')}</h2>
        <p className="mb-4 text-right">{t('about.mission.description')}</p>
        
        <h2 className="text-2xl font-semibold mb-4 text-right">{t('about.vision.title')}</h2>
        <p className="mb-4 text-right">{t('about.vision.description')}</p>
        
        <h2 className="text-2xl font-semibold mb-4 text-right">{t('about.story.title')}</h2>
        <p className="text-right">{t('about.story.description')}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-right">{t('about.team.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">{t('about.team.member1.name')}</h3>
            <p className="text-gray-600">{t('about.team.member1.role')}</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">{t('about.team.member2.name')}</h3>
            <p className="text-gray-600">{t('about.team.member2.role')}</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">{t('about.team.member3.name')}</h3>
            <p className="text-gray-600">{t('about.team.member3.role')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
