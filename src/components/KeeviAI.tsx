import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

interface KeeviAIProps {
  currentCategory?: string;
  currentSubcategory?: string;
  userData?: {
    recentCategories: string[];
    upcomingEvents: any[];
    documentUpdates: any[];
  };
}

const KeeviAI: React.FC<KeeviAIProps> = ({ 
  currentCategory, 
  currentSubcategory,
  userData 
}) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'form' | 'document' | 'reminder' | 'link' | null>(null);
  const [actionPath, setActionPath] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const analyzeContext = () => {
      if (currentCategory === 'Health' || 
          userData?.recentCategories.includes('Health')) {
        setSuggestion(t('keeviai.healthcare_suggestion'));
        setActionType('form');
        setActionPath('/feature/form/17'); // Form 17 path
        setIsVisible(true);
        return;
      }

      const hasTaxDeadline = userData?.upcomingEvents.some(
        event => event.title.includes('Tax') && 
        new Date(event.date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );
      
      if (hasTaxDeadline) {
        setSuggestion(t('keeviai.tax_deadline_reminder'));
        setActionType('reminder');
        setActionPath('/feature/reminder/tax');
        setIsVisible(true);
        return;
      }

      const hasOutdatedDocuments = userData?.documentUpdates.some(
        doc => new Date(doc.lastUpdated) < new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      );
      
      if (hasOutdatedDocuments) {
        setSuggestion(t('keeviai.outdated_documents'));
        setActionType('document');
        setActionPath('/documents/outdated');
        setIsVisible(true);
        return;
      }

      setIsVisible(false);
    };

    analyzeContext();
  }, [currentCategory, currentSubcategory, userData, t]);

  const handleAction = () => {
    if (actionPath) {
      setLocation(actionPath);
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg p-4 border-2 border-blue-500 z-50 animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="mr-3 flex-1">
          <div className="text-sm font-medium text-gray-900">KeeviAI</div>
          <div className="text-sm text-gray-600 mt-1">{suggestion}</div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end space-x-2">
        <button 
          onClick={handleDismiss}
          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
        >
          {t('common.dismiss')}
        </button>
        <button 
          onClick={handleAction}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {actionType === 'form' && t('common.fill_form')}
          {actionType === 'document' && t('common.update_documents')}
          {actionType === 'reminder' && t('common.set_reminder')}
          {actionType === 'link' && t('common.visit_link')}
        </button>
      </div>
    </div>
  );
};

export default KeeviAI;
