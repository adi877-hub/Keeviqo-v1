import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import SmartSearch from './SmartSearch';

function Header() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { theme } = useTheme();
  
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/faq', label: t('nav.faq') },
  ];
  
  const secondaryItems = [
    { path: '/privacy', label: t('nav.privacy') },
    { path: '/terms', label: t('nav.terms') },
  ];
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 sticky top-0 z-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div 
            className="text-2xl font-bold cursor-pointer text-blue-600 dark:text-blue-400"
            onClick={() => setLocation('/')}
          >
            Keeviqo
          </div>
        </div>
        
        <div className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0 md:mx-4">
          <SmartSearch />
        </div>
        
        <nav className="flex flex-wrap justify-center">
          <ul className="flex flex-wrap space-x-1 md:space-x-4 mb-2 md:mb-0">
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation(item.path);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === item.path
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          
          <ul className="flex flex-wrap space-x-1 md:space-x-4 text-xs text-gray-500 dark:text-gray-400">
            {secondaryItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation(item.path);
                  }}
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
