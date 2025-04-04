import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { analyzeUserContext, getUserDocuments, archiveDocument, deleteDocument } from '../utils/api';

interface DeclutterModeProps {
  onComplete?: () => void;
}

interface DocumentItem {
  id: number;
  name: string;
  lastAccessed: string;
  category: string;
  size: number;
  duplicateOf?: number;
  recommendation: 'keep' | 'archive' | 'delete';
  reason: string;
}

const DeclutterMode: React.FC<DeclutterModeProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [actionCompleted, setActionCompleted] = useState<Record<number, string>>({});
  const [stats, setStats] = useState({
    totalDocuments: 0,
    archiveRecommended: 0,
    deleteRecommended: 0,
    spaceToSave: 0,
  });

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        
        const userContext = await analyzeUserContext();
        const userDocuments = await getUserDocuments();
        
        const processedDocs: DocumentItem[] = userDocuments.map((doc: any) => {
          const lastAccessed = new Date(doc.lastAccessed || doc.createdAt);
          const now = new Date();
          const daysSinceLastAccess = Math.floor((now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24));
          
          let recommendation: 'keep' | 'archive' | 'delete' = 'keep';
          let reason = '';
          
          const possibleDuplicate = userDocuments.find((d: any) => 
            d.id !== doc.id && 
            d.name === doc.name && 
            d.size === doc.size &&
            d.category === doc.category
          );
          
          if (possibleDuplicate) {
            recommendation = 'delete';
            reason = t('declutter.duplicate_document');
          } 
          else if (daysSinceLastAccess > 365) {
            recommendation = 'archive';
            reason = t('declutter.not_accessed_year');
          }
          else if (doc.size > 10000000 && daysSinceLastAccess > 180) {
            recommendation = 'archive';
            reason = t('declutter.large_rarely_accessed');
          }
          else if (doc.name.toLowerCase().includes('temp') || 
                  doc.name.toLowerCase().includes('draft') || 
                  doc.name.toLowerCase().includes('copy')) {
            recommendation = 'delete';
            reason = t('declutter.temporary_document');
          }
          
          return {
            id: doc.id,
            name: doc.name,
            lastAccessed: lastAccessed.toISOString(),
            category: doc.category,
            size: doc.size,
            duplicateOf: possibleDuplicate?.id,
            recommendation,
            reason
          };
        });
        
        const archiveCount = processedDocs.filter(doc => doc.recommendation === 'archive').length;
        const deleteCount = processedDocs.filter(doc => doc.recommendation === 'delete').length;
        const spaceToSave = processedDocs
          .filter(doc => doc.recommendation !== 'keep')
          .reduce((total, doc) => total + doc.size, 0);
        
        setDocuments(processedDocs);
        setStats({
          totalDocuments: processedDocs.length,
          archiveRecommended: archiveCount,
          deleteRecommended: deleteCount,
          spaceToSave
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading documents for declutter:', error);
        setLoading(false);
      }
    };
    
    loadDocuments();
  }, [t]);

  const handleSelectAll = (recommendation: 'archive' | 'delete') => {
    const newSelected = { ...selectedItems };
    
    documents.forEach(doc => {
      if (doc.recommendation === recommendation && !actionCompleted[doc.id]) {
        newSelected[doc.id] = true;
      }
    });
    
    setSelectedItems(newSelected);
  };

  const handleToggleSelect = (docId: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const handleProcessSelected = async (action: 'archive' | 'delete') => {
    try {
      setProcessing(true);
      
      const selectedIds = Object.entries(selectedItems)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => parseInt(id));
      
      if (selectedIds.length === 0) {
        setProcessing(false);
        return;
      }
      
      const newActionCompleted = { ...actionCompleted };
      
      for (const docId of selectedIds) {
        if (action === 'archive') {
          await archiveDocument(docId);
          newActionCompleted[docId] = 'archived';
        } else {
          await deleteDocument(docId);
          newActionCompleted[docId] = 'deleted';
        }
      }
      
      setActionCompleted(newActionCompleted);
      setSelectedItems({});
      setProcessing(false);
    } catch (error) {
      console.error(`Error ${action}ing documents:`, error);
      setProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-right">{t('declutter.title')}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-right">{t('declutter.title')}</h2>
      <p className="text-gray-600 mb-6 text-right">{t('declutter.description')}</p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2 text-right">{t('declutter.summary')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <div className="text-sm text-gray-600">{t('declutter.total_documents')}</div>
          </div>
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.archiveRecommended}</div>
            <div className="text-sm text-gray-600">{t('declutter.archive_recommended')}</div>
          </div>
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-2xl font-bold text-red-500">{stats.deleteRecommended}</div>
            <div className="text-sm text-gray-600">{t('declutter.delete_recommended')}</div>
          </div>
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-2xl font-bold text-green-500">{formatBytes(stats.spaceToSave)}</div>
            <div className="text-sm text-gray-600">{t('declutter.space_to_save')}</div>
          </div>
        </div>
      </div>
      
      {stats.archiveRecommended > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{t('declutter.archive_candidates')}</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleSelectAll('archive')}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                {t('declutter.select_all')}
              </button>
              <button 
                onClick={() => handleProcessSelected('archive')}
                disabled={processing || !Object.values(selectedItems).some(v => v)}
                className={`px-3 py-1 text-sm text-white rounded ${
                  processing || !Object.values(selectedItems).some(v => v) 
                    ? 'bg-yellow-300' 
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {processing ? t('common.processing') : t('declutter.archive_selected')}
              </button>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.select')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.name')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.category')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.last_accessed')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.size')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.reason')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents
                  .filter(doc => doc.recommendation === 'archive')
                  .map(doc => (
                    <tr key={doc.id} className={actionCompleted[doc.id] ? 'bg-gray-100' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {actionCompleted[doc.id] ? (
                          <span className="text-yellow-500">{t('declutter.archived')}</span>
                        ) : (
                          <input 
                            type="checkbox" 
                            checked={!!selectedItems[doc.id]} 
                            onChange={() => handleToggleSelect(doc.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {doc.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {doc.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {new Date(doc.lastAccessed).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatBytes(doc.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {doc.reason}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {stats.deleteRecommended > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{t('declutter.delete_candidates')}</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleSelectAll('delete')}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                {t('declutter.select_all')}
              </button>
              <button 
                onClick={() => handleProcessSelected('delete')}
                disabled={processing || !Object.values(selectedItems).some(v => v)}
                className={`px-3 py-1 text-sm text-white rounded ${
                  processing || !Object.values(selectedItems).some(v => v) 
                    ? 'bg-red-300' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {processing ? t('common.processing') : t('declutter.delete_selected')}
              </button>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.select')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.name')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.category')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.last_accessed')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.size')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.reason')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents
                  .filter(doc => doc.recommendation === 'delete')
                  .map(doc => (
                    <tr key={doc.id} className={actionCompleted[doc.id] ? 'bg-gray-100' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {actionCompleted[doc.id] ? (
                          <span className="text-red-500">{t('declutter.deleted')}</span>
                        ) : (
                          <input 
                            type="checkbox" 
                            checked={!!selectedItems[doc.id]} 
                            onChange={() => handleToggleSelect(doc.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {doc.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {doc.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {new Date(doc.lastAccessed).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatBytes(doc.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {doc.reason}
                        {doc.duplicateOf && (
                          <span className="text-red-500 mr-1">
                            {t('declutter.duplicate_of', { id: doc.duplicateOf })}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {stats.archiveRecommended === 0 && stats.deleteRecommended === 0 && (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{t('declutter.all_organized')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('declutter.no_action_needed')}</p>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={onComplete}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('common.done')}
        </button>
      </div>
    </div>
  );
};

export default DeclutterMode;
