import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserProfile } from '../utils/api';
import ExternalSystemLinks from './ExternalSystemLinks';

interface SmartContextSuggestionsProps {
  currentCategory?: string;
}

function SmartContextSuggestions({ currentCategory }: SmartContextSuggestionsProps) {
  const { t } = useTranslation();
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectRelevantCategories = async () => {
      try {
        
        const userProfile = await getUserProfile();
        
        let detected: string[] = [];
        
        if (currentCategory) {
          detected.push(currentCategory);
        }
        
        if (userProfile.name.includes('Dr.') || userProfile.email.includes('doctor') || userProfile.email.includes('health')) {
          detected.push('health');
        }
        
        if (userProfile.email.includes('gov') || userProfile.email.includes('government')) {
          detected.push('government');
        }
        
        if (userProfile.email.includes('edu') || userProfile.email.includes('school') || userProfile.email.includes('university')) {
          detected.push('education');
        }
        
        if (userProfile.email.includes('finance') || userProfile.email.includes('bank') || userProfile.email.includes('tax')) {
          detected.push('finance');
        }
        
        if (detected.length === 0) {
          detected = ['health', 'government', 'finance'];
        }
        
        detected = detected.slice(0, 3);
        
        setSuggestedCategories(detected);
        setLoading(false);
      } catch (err) {
        console.error('Failed to detect relevant categories:', err);
        setError(t('smartContext.error'));
        setLoading(false);
        
        setSuggestedCategories(['health', 'government', 'finance']);
      }
    };

    detectRelevantCategories();
  }, [currentCategory, t]);

  if (loading) {
    return <div className="text-center py-4">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-right">{t('smartContext.title')}</h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-right">
        {t('smartContext.description')}
      </p>
      
      <div className="space-y-6">
        {suggestedCategories.map((category, index) => (
          <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
            <h3 className="text-lg font-semibold mb-3 text-right">
              {t(`categories.${category}`)}
            </h3>
            <ExternalSystemLinks category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SmartContextSuggestions;
