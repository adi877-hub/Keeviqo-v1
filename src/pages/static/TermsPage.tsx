import React from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';

function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      
      <h1 className="text-3xl font-bold mb-6 text-right">{t('terms.title')}</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.introduction.title')}</h2>
          <p className="mb-4 text-right">{t('terms.introduction.description')}</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.definitions.title')}</h2>
          <ul className="list-disc list-inside mb-4 text-right">
            <li>{t('terms.definitions.item1')}</li>
            <li>{t('terms.definitions.item2')}</li>
            <li>{t('terms.definitions.item3')}</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.accountTerms.title')}</h2>
          <p className="mb-4 text-right">{t('terms.accountTerms.description')}</p>
          <ul className="list-disc list-inside mb-4 text-right">
            <li>{t('terms.accountTerms.item1')}</li>
            <li>{t('terms.accountTerms.item2')}</li>
            <li>{t('terms.accountTerms.item3')}</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.intellectualProperty.title')}</h2>
          <p className="mb-4 text-right">{t('terms.intellectualProperty.description')}</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.userContent.title')}</h2>
          <p className="mb-4 text-right">{t('terms.userContent.description')}</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.prohibitedUses.title')}</h2>
          <p className="mb-4 text-right">{t('terms.prohibitedUses.description')}</p>
          <ul className="list-disc list-inside mb-4 text-right">
            <li>{t('terms.prohibitedUses.item1')}</li>
            <li>{t('terms.prohibitedUses.item2')}</li>
            <li>{t('terms.prohibitedUses.item3')}</li>
            <li>{t('terms.prohibitedUses.item4')}</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.termination.title')}</h2>
          <p className="mb-4 text-right">{t('terms.termination.description')}</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.disclaimer.title')}</h2>
          <p className="mb-4 text-right">{t('terms.disclaimer.description')}</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('terms.contact.title')}</h2>
          <p className="text-right">{t('terms.contact.description')}</p>
        </section>
      </div>
    </div>
  );
}

export default TermsPage;
