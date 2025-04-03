import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserProfile, updateUserProfile, UserProfile } from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

interface UserProfileSettingsProps {
  onSaved?: () => void;
}

function UserProfileSettings({ onSaved }: UserProfileSettingsProps) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError(t('profile.fetchError'));
        setIsLoading(false);
        
        setProfile({
          id: 0,
          name: '',
          email: '',
          preferences: {
            theme: theme as 'light' | 'dark',
            language: i18n.language as 'he' | 'en',
          },
        });
      }
    };

    fetchProfile();
  }, [t, theme, i18n.language]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleLanguageChange = (language: 'he' | 'en') => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        language,
      },
    });
    
    i18n.changeLanguage(language);
  };

  const handleThemeChange = () => {
    if (!profile) return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        theme: newTheme as 'light' | 'dark',
      },
    });
    
    toggleTheme();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      await updateUserProfile(profile);
      setSuccess(true);
      
      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(t('profile.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-right">{t('profile.settings')}</h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 text-right">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4 text-right">
          {t('profile.saveSuccess')}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-right mb-2">
            {t('profile.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile?.name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-right mb-2">
            {t('profile.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile?.email || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-right">{t('profile.preferences')}</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-right mb-2">
              {t('profile.language')}
            </label>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  profile?.preferences.language === 'en'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleLanguageChange('en')}
              >
                English
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  profile?.preferences.language === 'he'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleLanguageChange('he')}
              >
                עברית
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-right mb-2">
              {t('profile.theme')}
            </label>
            <div className="flex justify-end items-center">
              <span className="text-gray-700 dark:text-gray-300 ml-2">
                {theme === 'light' ? t('profile.darkMode') : t('profile.lightMode')}
              </span>
              <button
                type="button"
                onClick={handleThemeChange}
                className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 dark:bg-gray-600 mx-3"
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform duration-200 ease-in-out rounded-full bg-white ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-gray-700 dark:text-gray-300 mr-2">
                {theme === 'light' ? t('profile.lightMode') : t('profile.darkMode')}
              </span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors w-full"
        >
          {isSaving ? t('common.saving') : t('common.save')}
        </button>
      </form>
    </div>
  );
}

export default UserProfileSettings;
