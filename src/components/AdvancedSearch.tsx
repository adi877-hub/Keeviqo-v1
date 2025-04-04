import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { searchContent } from '../utils/api';

interface SearchResult {
  id: number;
  type: 'category' | 'subcategory' | 'document' | 'reminder' | 'form';
  title: string;
  description?: string;
  path: string;
  relevance: number;
  category?: string;
  lastUpdated?: string;
}

interface SearchSuggestion {
  text: string;
  type: 'history' | 'popular' | 'correction' | 'category';
}

const AdvancedSearch: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query) {
      const historySuggestions = recentSearches.slice(0, 5).map(text => ({
        text,
        type: 'history' as const
      }));
      setSuggestions(historySuggestions);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        
        const corrections: SearchSuggestion[] = [];
        if (query.length > 3) {
          if (query.includes('helth')) {
            corrections.push({ text: query.replace('helth', 'health'), type: 'correction' });
          }
          if (query.includes('insurnce')) {
            corrections.push({ text: query.replace('insurnce', 'insurance'), type: 'correction' });
          }
          if (query.includes('passort')) {
            corrections.push({ text: query.replace('passort', 'passport'), type: 'correction' });
          }
        }
        
        const categoryMatches: SearchSuggestion[] = [
          { text: 'Health Insurance', type: 'category' as const },
          { text: 'Passport & Travel', type: 'category' as const },
          { text: 'Financial Documents', type: 'category' as const },
          { text: 'Family Records', type: 'category' as const },
          { text: 'Property Documents', type: 'category' as const }
        ].filter(cat => cat.text.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
        
        const popularSuggestions: SearchSuggestion[] = [
          { text: 'passport renewal', type: 'popular' as const },
          { text: 'health insurance claim', type: 'popular' as const },
          { text: 'tax documents', type: 'popular' as const }
        ].filter(pop => pop.text.toLowerCase().includes(query.toLowerCase())).slice(0, 2);
        
        setSuggestions([...corrections, ...categoryMatches, ...popularSuggestions]);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [query, recentSearches]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchResults = await searchContent(query);
      setResults(searchResults);
      
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      setShowSuggestions(false);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    setTimeout(() => handleSearch(), 0);
  };

  const handleResultClick = (result: SearchResult) => {
    setLocation(result.path);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="flex items-center border-2 border-blue-500 rounded-lg overflow-hidden">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder')}
            className="flex-grow px-4 py-2 outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
            ) : (
              t('search')
            )}
          </button>
        </div>
        
        {/* Search suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.type === 'history' && (
                  <span className="material-icons text-gray-500 mr-2 text-sm">history</span>
                )}
                {suggestion.type === 'correction' && (
                  <span className="material-icons text-blue-500 mr-2 text-sm">spellcheck</span>
                )}
                {suggestion.type === 'popular' && (
                  <span className="material-icons text-orange-500 mr-2 text-sm">trending_up</span>
                )}
                {suggestion.type === 'category' && (
                  <span className="material-icons text-green-500 mr-2 text-sm">folder</span>
                )}
                <span className={suggestion.type === 'correction' ? 'font-semibold' : ''}>
                  {suggestion.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">{t('searchResults')}</h2>
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center">
                  {result.type === 'category' && <span className="material-icons text-blue-500 mr-2">category</span>}
                  {result.type === 'subcategory' && <span className="material-icons text-green-500 mr-2">folder</span>}
                  {result.type === 'document' && <span className="material-icons text-orange-500 mr-2">description</span>}
                  {result.type === 'reminder' && <span className="material-icons text-purple-500 mr-2">alarm</span>}
                  {result.type === 'form' && <span className="material-icons text-red-500 mr-2">assignment</span>}
                  <h3 className="text-lg font-medium">{result.title}</h3>
                </div>
                {result.description && (
                  <p className="text-gray-600 mt-1">{result.description}</p>
                )}
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  {result.category && <span>{result.category}</span>}
                  {result.lastUpdated && <span>{t('lastUpdated')}: {result.lastUpdated}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {query && !loading && results.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">{t('noResultsFound')}</p>
          <p className="text-sm mt-2">{t('tryDifferentKeywords')}</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
