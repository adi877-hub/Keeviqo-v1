import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { getUserProfile, getRecommendations } from '../utils/api';

interface SmartRecommendationsProps {
  onActionClick?: (actionType: string, actionId: string) => void;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  actionType: 'form' | 'document' | 'reminder' | 'link' | 'grant';
  actionPath: string;
  expiresAt?: string;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ onActionClick }) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [profile, recommendationsData] = await Promise.all([
          getUserProfile(),
          getRecommendations()
        ]);
        
        setUserProfile(profile);
        
        const filteredRecommendations = recommendationsData.filter((rec: Recommendation) => {
          if (dismissedRecommendations.includes(rec.id)) {
            return false;
          }
          
          if (rec.category === 'Children' && !profile.hasChildren) {
            return false;
          }
          
          if (rec.category === 'Elderly Care' && !profile.hasElderlyRelatives) {
            return false;
          }
          
          if (rec.expiresAt && new Date(rec.expiresAt) < new Date()) {
            return false;
          }
          
          return true;
        });
        
        const sortedRecommendations = filteredRecommendations.sort((a: Recommendation, b: Recommendation) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        setRecommendations(sortedRecommendations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(t('smart_recommendations.fetch_error'));
        setLoading(false);
      }
    };
    
    fetchData();
  }, [t, dismissedRecommendations]);

  const handleAction = (recommendation: Recommendation) => {
    if (onActionClick) {
      onActionClick(recommendation.actionType, recommendation.id);
    } else {
      setLocation(recommendation.actionPath);
    }
  };

  const handleDismiss = (recommendationId: string) => {
    setDismissedRecommendations(prev => [...prev, recommendationId]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-right">{t('smart_recommendations.title')}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-right">{t('smart_recommendations.title')}</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-right">{t('smart_recommendations.title')}</h2>
        <p className="text-gray-500 text-center">{t('smart_recommendations.no_recommendations')}</p>
      </div>
    );
  }

  const generatePersonalizedRecommendations = () => {
    if (!userProfile) return [];
    
    const personalizedRecs: Recommendation[] = [];
    
    if (userProfile.children && userProfile.children.some((child: any) => child.age === 4)) {
      personalizedRecs.push({
        id: 'child-grant-4yo',
        title: t('smart_recommendations.child_grant_title'),
        description: t('smart_recommendations.child_grant_description'),
        category: 'Children',
        priority: 'high',
        actionType: 'grant',
        actionPath: '/grants/child-education'
      });
    }
    
    if (userProfile.age && userProfile.age >= 65) {
      personalizedRecs.push({
        id: 'senior-benefits',
        title: t('smart_recommendations.senior_benefits_title'),
        description: t('smart_recommendations.senior_benefits_description'),
        category: 'Health',
        priority: 'medium',
        actionType: 'form',
        actionPath: '/feature/form/senior-benefits'
      });
    }
    
    if (userProfile.hasMortgage) {
      personalizedRecs.push({
        id: 'mortgage-refinance',
        title: t('smart_recommendations.mortgage_refinance_title'),
        description: t('smart_recommendations.mortgage_refinance_description'),
        category: 'Finance',
        priority: 'medium',
        actionType: 'link',
        actionPath: '/feature/external_link/mortgage-refinance'
      });
    }
    
    return personalizedRecs;
  };
  
  const personalizedRecommendations = generatePersonalizedRecommendations();
  const allRecommendations = [...personalizedRecommendations, ...recommendations];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-right">{t('smart_recommendations.title')}</h2>
      
      <div className="space-y-4">
        {allRecommendations.map((recommendation) => (
          <div 
            key={recommendation.id} 
            className={`border-r-4 rounded-md p-4 ${
              recommendation.priority === 'high' 
                ? 'border-red-500 bg-red-50' 
                : recommendation.priority === 'medium'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-blue-500 bg-blue-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-right">{recommendation.title}</h3>
                <p className="text-gray-700 text-right mt-1">{recommendation.description}</p>
                
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    onClick={() => handleDismiss(recommendation.id)}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                  >
                    {t('common.dismiss')}
                  </button>
                  <button
                    onClick={() => handleAction(recommendation)}
                    className={`px-3 py-1 text-xs rounded ${
                      recommendation.actionType === 'form' 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                        : recommendation.actionType === 'document'
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : recommendation.actionType === 'reminder'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : recommendation.actionType === 'grant'
                              ? 'bg-purple-500 hover:bg-purple-600 text-white'
                              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    {recommendation.actionType === 'form' && t('common.fill_form')}
                    {recommendation.actionType === 'document' && t('common.upload_document')}
                    {recommendation.actionType === 'reminder' && t('common.set_reminder')}
                    {recommendation.actionType === 'link' && t('common.visit_link')}
                    {recommendation.actionType === 'grant' && t('common.apply_now')}
                  </button>
                </div>
              </div>
              
              <div className="mr-4 flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  recommendation.category === 'Health' 
                    ? 'bg-green-100 text-green-800' 
                    : recommendation.category === 'Finance'
                      ? 'bg-blue-100 text-blue-800'
                      : recommendation.category === 'Legal'
                        ? 'bg-purple-100 text-purple-800'
                        : recommendation.category === 'Children'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-800'
                }`}>
                  {recommendation.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendations;
