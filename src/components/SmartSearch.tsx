import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { fetchCategories } from '../utils/api';

interface SearchResult {
  id: number;
  name: string;
  type: 'category' | 'subcategory' | 'feature';
  parentName?: string;
  parentId?: number;
  icon?: string;
  path: string;
}

function SmartSearch() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSearchableItems = async () => {
      try {
        const categories = await fetchCategories();
        const items: SearchResult[] = [];
        
        categories.forEach(category => {
          items.push({
            id: category.id,
            name: category.name,
            type: 'category',
            icon: category.icon,
            path: `/category/${category.id}`
          });
          
          if (category.subcategories) {
            category.subcategories.forEach(subcategory => {
              items.push({
                id: subcategory.id,
                name: subcategory.name,
                type: 'subcategory',
                parentName: category.name,
                parentId: category.id,
                path: `/subcategory/${subcategory.id}`
              });
              
              if (subcategory.features) {
                subcategory.features.forEach(feature => {
                  items.push({
                    id: feature.id,
                    name: feature.label,
                    type: 'feature',
                    parentName: subcategory.name,
                    parentId: subcategory.id,
                    path: feature.type === 'external_link' && feature.url 
                      ? feature.url 
                      : `/feature/${feature.type}/${feature.id}`
                  });
                });
              }
            });
          }
        });
        
        setAllItems(items);
      } catch (error) {
        console.error('Failed to load searchable items:', error);
      }
    };
    
    loadSearchableItems();
    
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);
    
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
      return;
    }
    
    const searchResults = allItems.filter(item => {
      const normalizedQuery = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(normalizedQuery);
      const parentMatch = item.parentName?.toLowerCase().includes(normalizedQuery);
      
      return nameMatch || parentMatch;
    });
    
    searchResults.sort((a, b) => {
      const aExact = a.name.toLowerCase() === searchQuery.toLowerCase();
      const bExact = b.name.toLowerCase() === searchQuery.toLowerCase();
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      const typeOrder = { category: 0, subcategory: 1, feature: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
    
    setResults(searchResults);
    setShowResults(true);
    setIsLoading(false);
  };

  const handleResultClick = (result: SearchResult) => {
    const updatedSearches = [result.name, ...recentSearches.filter(s => s !== result.name)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    if (result.path.startsWith('http')) {
      window.open(result.path, '_blank');
    } else {
      setLocation(result.path);
    }
    
    setQuery('');
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder={t('search.placeholder')}
          className="w-full px-4 py-2 pr-10 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          )}
        </div>
      </div>
      
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-200 max-h-96 overflow-y-auto">
          {query.trim() === '' && recentSearches.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('search.recent')}</h3>
              {recentSearches.map((search, index) => (
                <div 
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
                  onClick={() => handleSearch(search)}
                >
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {search}
                </div>
              ))}
            </div>
          )}
          
          {query.trim() !== '' && results.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {t('search.noResults')}
            </div>
          ) : (
            <div className="p-2">
              {query.trim() !== '' && (
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  {t('search.results', { count: results.length })}
                </h3>
              )}
              
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center">
                    {result.type === 'category' && (
                      <span className="material-icons text-blue-500 mr-2">{result.icon || 'folder'}</span>
                    )}
                    {result.type === 'subcategory' && (
                      <span className="material-icons text-green-500 mr-2">subdirectory_arrow_right</span>
                    )}
                    {result.type === 'feature' && (
                      <span className="material-icons text-purple-500 mr-2">extension</span>
                    )}
                    <div>
                      <div className="font-medium">{result.name}</div>
                      {result.parentName && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {result.type === 'subcategory' 
                            ? `${t('search.inCategory')}: ${result.parentName}` 
                            : `${t('search.inSubcategory')}: ${result.parentName}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {query.trim() !== '' && results.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t('search.tip')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SmartSearch;
