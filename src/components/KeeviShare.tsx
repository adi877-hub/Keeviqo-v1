import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createShareLink, revokeShareLink, fetchCategories, getUserDocuments } from '../utils/api';
import type { Category, Document, ShareLink } from '../utils/api';

interface KeeviShareProps {
  onComplete?: () => void;
  defaultCategories?: number[];
  defaultDocuments?: number[];
}

const KeeviShare: React.FC<KeeviShareProps> = ({ 
  onComplete,
  defaultCategories,
  defaultDocuments
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(defaultCategories || []);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>(defaultDocuments || []);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [maxAccess, setMaxAccess] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [revoking, setRevoking] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [categoriesData, documentsData] = await Promise.all([
          fetchCategories(),
          getUserDocuments()
        ]);
        
        setCategories(categoriesData);
        setDocuments(documentsData);
        
        setShareLinks([]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data for KeeviShare:', err);
        setError(t('keevishare.load_error'));
        setLoading(false);
      }
    };
    
    loadData();
  }, [t]);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDocumentToggle = (documentId: number) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleCreateShareLink = async () => {
    if (selectedCategories.length === 0 && selectedDocuments.length === 0) {
      setError(t('keevishare.nothing_selected'));
      return;
    }
    
    try {
      setCreating(true);
      setError(null);
      setSuccess(null);
      
      const shareData = {
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        documents: selectedDocuments.length > 0 ? selectedDocuments : undefined,
        expiresIn: expirationDays * 24 * 60 * 60, // Convert days to seconds
        maxAccess: maxAccess || undefined
      };
      
      const newShareLink = await createShareLink(shareData);
      
      setShareLinks(prev => [newShareLink, ...prev]);
      setSuccess(t('keevishare.link_created'));
      
      setSelectedCategories([]);
      setSelectedDocuments([]);
      
    } catch (err) {
      console.error('Error creating share link:', err);
      setError(t('keevishare.create_error'));
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeLink = async (linkId: number) => {
    try {
      setRevoking(prev => ({ ...prev, [linkId]: true }));
      setError(null);
      
      await revokeShareLink(linkId);
      
      setShareLinks(prev => prev.filter(link => link.id !== linkId));
      setSuccess(t('keevishare.link_revoked'));
      
    } catch (err) {
      console.error('Error revoking share link:', err);
      setError(t('keevishare.revoke_error'));
    } finally {
      setRevoking(prev => ({ ...prev, [linkId]: false }));
    }
  };

  const handleCopyLink = (linkId: number, url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopiedLink(linkId);
        setTimeout(() => setCopiedLink(null), 2000);
      })
      .catch(err => {
        console.error('Error copying link:', err);
        setError(t('keevishare.copy_error'));
      });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-right">{t('keevishare.title')}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-right">{t('keevishare.title')}</h2>
      <p className="text-gray-600 mb-6 text-right">{t('keevishare.description')}</p>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-right">{t('keevishare.select_categories')}</h3>
          <div className="bg-gray-50 p-4 rounded-md h-64 overflow-y-auto">
            {categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id} className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                      />
                      <span className="mr-2 text-right flex-grow">{category.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">{t('keevishare.no_categories')}</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-right">{t('keevishare.select_documents')}</h3>
          <div className="bg-gray-50 p-4 rounded-md h-64 overflow-y-auto">
            {documents.length > 0 ? (
              <ul className="space-y-2">
                {documents.map(document => (
                  <li key={document.id} className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(document.id)}
                        onChange={() => handleDocumentToggle(document.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                      />
                      <span className="mr-2 text-right flex-grow">{document.name}</span>
                      <span className="text-xs text-gray-500">{document.category}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">{t('keevishare.no_documents')}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-3 text-right">{t('keevishare.share_options')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              {t('keevishare.expiration')}
            </label>
            <select
              value={expirationDays}
              onChange={(e) => setExpirationDays(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 rtl:text-right"
              dir="rtl"
            >
              <option value={1}>{t('keevishare.expire_1_day')}</option>
              <option value={7}>{t('keevishare.expire_7_days')}</option>
              <option value={30}>{t('keevishare.expire_30_days')}</option>
              <option value={90}>{t('keevishare.expire_90_days')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              {t('keevishare.max_access')}
            </label>
            <select
              value={maxAccess || ''}
              onChange={(e) => setMaxAccess(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 rtl:text-right"
              dir="rtl"
            >
              <option value="">{t('keevishare.unlimited')}</option>
              <option value={1}>{t('keevishare.access_1')}</option>
              <option value={5}>{t('keevishare.access_5')}</option>
              <option value={10}>{t('keevishare.access_10')}</option>
              <option value={25}>{t('keevishare.access_25')}</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreateShareLink}
            disabled={creating || (selectedCategories.length === 0 && selectedDocuments.length === 0)}
            className={`px-4 py-2 rounded-md ${
              creating || (selectedCategories.length === 0 && selectedDocuments.length === 0)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {creating ? (
              <>
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                {t('common.creating')}
              </>
            ) : (
              t('keevishare.create_link')
            )}
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3 text-right">{t('keevishare.active_links')}</h3>
        
        {shareLinks.length > 0 ? (
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('keevishare.url')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('keevishare.expires')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('keevishare.access_count')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shareLinks.map(link => (
                  <tr key={link.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-sm text-gray-900 truncate max-w-xs">
                          {link.url}
                        </span>
                        <button
                          onClick={() => handleCopyLink(link.id, link.url)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          {copiedLink === link.id ? (
                            <span className="text-green-500 text-xs">{t('common.copied')}</span>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {formatDate(link.expiresAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {link.accessCount} {link.maxAccess && `/ ${link.maxAccess}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRevokeLink(link.id)}
                        disabled={revoking[link.id]}
                        className={`text-red-600 hover:text-red-900 ${revoking[link.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {revoking[link.id] ? t('common.revoking') : t('keevishare.revoke')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">{t('keevishare.no_active_links')}</p>
            <p className="text-sm text-gray-400 mt-2">{t('keevishare.create_first_link')}</p>
          </div>
        )}
      </div>
      
      {onComplete && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onComplete}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {t('common.done')}
          </button>
        </div>
      )}
    </div>
  );
};

export default KeeviShare;
