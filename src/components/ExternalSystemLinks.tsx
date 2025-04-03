import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getExternalSystemLinks } from '../utils/api';

interface ExternalSystemLinksProps {
  category: string;
  userId?: number;
}

function ExternalSystemLinks({ category }: ExternalSystemLinksProps) {
  const { t } = useTranslation();
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getExternalSystemLinks(category);
        setLinks(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch external system links:', err);
        setError(t('externalSystems.fetchError'));
        setLoading(false);
      }
    };

    fetchLinks();
  }, [category, t]);

  if (loading) {
    return <div className="text-center py-4">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (links.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
        {t('externalSystems.noLinks')}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-right">{t('externalSystems.title')}</h2>
      
      <div className="space-y-3">
        {links.map((link, index) => {
          const url = new URL(link);
          const domain = url.hostname.replace('www.', '');
          
          let category = 'general';
          if (link.includes('health') || link.includes('kupat') || link.includes('clalit') || link.includes('maccabi')) {
            category = 'health';
          } else if (link.includes('gov.il') || link.includes('government')) {
            category = 'government';
          } else if (link.includes('education') || link.includes('school') || link.includes('university')) {
            category = 'education';
          } else if (link.includes('tax') || link.includes('finance') || link.includes('bank')) {
            category = 'finance';
          }
          
          return (
            <a 
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                category === 'health' ? 'border-l-4 border-green-500' :
                category === 'government' ? 'border-l-4 border-blue-500' :
                category === 'education' ? 'border-l-4 border-yellow-500' :
                category === 'finance' ? 'border-l-4 border-purple-500' :
                'border-l-4 border-gray-500'
              }`}
            >
              <div className="flex items-center">
                <span className={`material-icons mr-3 ${
                  category === 'health' ? 'text-green-500' :
                  category === 'government' ? 'text-blue-500' :
                  category === 'education' ? 'text-yellow-500' :
                  category === 'finance' ? 'text-purple-500' :
                  'text-gray-500'
                }`}>
                  {category === 'health' ? 'local_hospital' :
                   category === 'government' ? 'account_balance' :
                   category === 'education' ? 'school' :
                   category === 'finance' ? 'attach_money' :
                   'link'}
                </span>
                <div>
                  <div className="font-medium">{domain}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t(`externalSystems.categories.${category}`)}</div>
                </div>
              </div>
              <span className="material-icons text-gray-400">open_in_new</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default ExternalSystemLinks;
