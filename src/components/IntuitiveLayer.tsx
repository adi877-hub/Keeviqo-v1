import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { analyzeUserContext, getUserProfile, fetchCategory } from '../utils/api';

interface IntuitiveLayerProps {
  currentCategoryId?: number;
  currentSubcategoryId?: number;
}

const IntuitiveLayer: React.FC<IntuitiveLayerProps> = ({ 
  currentCategoryId,
  currentSubcategoryId
}) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  interface MissingItem {
    type: 'document' | 'form' | 'reminder' | 'information';
    description: string;
    actionPath?: string;
    priority: 'high' | 'medium' | 'low';
  }
  
  const [missingItems, setMissingItems] = useState<MissingItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectMissingItems = async () => {
      try {
        setLoading(true);
        
        const userContext = await analyzeUserContext();
        const userProfile = await getUserProfile();
        
        interface CategoryDetails {
          id: number;
          name: string;
          description?: string;
          icon?: string;
        }
        
        let categoryDetails: CategoryDetails | null = null;
        if (currentCategoryId) {
          categoryDetails = await fetchCategory(currentCategoryId) as CategoryDetails;
        }
        
        const detected: MissingItem[] = [];
        
        if (userContext.documentUpdates && userContext.documentUpdates.length > 0) {
          for (const doc of userContext.documentUpdates) {
            const lastUpdated = new Date(doc.lastUpdated);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            
            if (lastUpdated < oneYearAgo) {
              detected.push({
                type: 'document',
                description: t('intuition.outdated_document', { name: doc.name }),
                actionPath: `/document/update/${doc.documentId}`,
                priority: 'high'
              });
            }
          }
        }
        
        if (userContext.upcomingEvents && userContext.upcomingEvents.length > 0) {
          for (const event of userContext.upcomingEvents) {
            const eventDate = new Date(event.date);
            const now = new Date();
            const daysDiff = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff < 30 && daysDiff > 0 && 
                categoryDetails && event.category === categoryDetails.name) {
              detected.push({
                type: 'reminder',
                description: t('intuition.upcoming_event_reminder', { 
                  title: event.title, 
                  days: daysDiff 
                }),
                actionPath: `/feature/reminder/new?title=${encodeURIComponent(event.title)}`,
                priority: daysDiff < 7 ? 'high' : 'medium'
              });
            }
          }
        }
        
        if (categoryDetails) {
          if (categoryDetails.name === 'Health') {
            detected.push({
              type: 'information',
              description: t('intuition.health_checkup_reminder'),
              actionPath: '/feature/reminder/new?category=Health',
              priority: 'medium'
            });
          }
          
          else if (categoryDetails.name === 'Finance') {
            detected.push({
              type: 'document',
              description: t('intuition.tax_documents_reminder'),
              actionPath: '/feature/upload/new?category=Finance',
              priority: 'medium'
            });
          }
          
          else if (categoryDetails.name === 'Legal') {
            detected.push({
              type: 'document',
              description: t('intuition.legal_documents_reminder'),
              actionPath: '/feature/upload/new?category=Legal',
              priority: 'low'
            });
          }
        }
        
        setMissingItems(detected);
        setIsVisible(detected.length > 0);
        setLoading(false);
      } catch (error) {
        console.error('Error in intuitive layer:', error);
        setLoading(false);
      }
    };
    
    detectMissingItems();
  }, [currentCategoryId, currentSubcategoryId, t]);

  const handleAction = (actionPath: string) => {
    setLocation(actionPath);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (loading || !isVisible) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="mr-3">
          <p className="text-sm text-yellow-700 font-medium">{t('intuition.title')}</p>
          
          <ul className="mt-2 text-sm text-yellow-600 list-disc list-inside">
            {missingItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item.description}
                {item.actionPath && (
                  <button 
                    onClick={() => handleAction(item.actionPath!)}
                    className="mr-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    {t('common.fix_now')}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <button 
          onClick={handleDismiss}
          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
        >
          {t('common.dismiss')}
        </button>
      </div>
    </div>
  );
};

export default IntuitiveLayer;
