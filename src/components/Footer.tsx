import React from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { path: '/about', label: t('footer.about') },
    { path: '/privacy', label: t('footer.privacy') },
    { path: '/terms', label: t('footer.terms') },
    { path: '/contact', label: t('footer.contact') },
    { path: '/faq', label: t('footer.faq') },
  ];
  
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Keeviqo</div>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <nav className="mb-4">
              <ul className="flex flex-wrap justify-end gap-4">
                {footerLinks.map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        setLocation(link.path);
                      }}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="text-gray-500 dark:text-gray-500 text-sm">
              &copy; {currentYear} Keeviqo. {t('footer.rights')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
