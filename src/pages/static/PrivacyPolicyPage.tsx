import React from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';

function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      
      <h1 className="text-3xl font-bold mb-6 text-right">{t('privacy.title')}</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('privacy.introduction.title')}</h2>
          <p className="mb-4 text-right">{t('privacy.introduction.description')}</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('privacy.dataCollection.title')}</h2>
          <p className="mb-4 text-right">{t('privacy.dataCollection.description')}</p>
          <ul className="list-disc list-inside mb-4 text-right">
            <li>{t('privacy.dataCollection.item1')}</li>
            <li>{t('privacy.dataCollection.item2')}</li>
            <li>{t('privacy.dataCollection.item3')}</li>
            <li>{t('privacy.dataCollection.item4')}</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('privacy.dataUse.title')}</h2>
          <p className="mb-4 text-right">{t('privacy.dataUse.description')}</p>
          <ul className="list-disc list-inside mb-4 text-right">
            <li>{t('privacy.dataUse.item1')}</li>
            <li>{t('privacy.dataUse.item2')}</li>
            <li>{t('privacy.dataUse.item3')}</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('privacy.dataSharing.title')}</h2>
          <p className="mb-4 text-right">{t('privacy.dataSharing.description')}</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('privacy.dataSecurity.title')}</h2>
          <p className="mb-4 text-right">{t('privacy.dataSecurity.description')}</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('privacy.userRights.title')}</h2>
          <p className="mb-4 text-right">{t('privacy.userRights.description')}</p>
          <ul className="list-disc list-inside mb-4 text-right">
            <li>{t('privacy.userRights.item1')}</li>
            <li>{t('privacy.userRights.item2')}</li>
            <li>{t('privacy.userRights.item3')}</li>
            <li>{t('privacy.userRights.item4')}</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('privacy.contact.title')}</h2>
          <p className="text-right">{t('privacy.contact.description')}</p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
