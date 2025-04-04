import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  createContextAwareReminder, 
  getUserReminders, 
  updateReminder, 
  deleteReminder,
  analyzeUserContext
} from '../utils/api';

interface Reminder {
  id: number;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once' | 'context_based';
  date: string;
  completed: boolean;
  contextTriggers?: string[];
  priority: 'low' | 'medium' | 'high';
  category?: string;
  relatedDocuments?: number[];
}

interface UserContext {
  recentCategories: string[];
  upcomingEvents: {
    title: string;
    date: string;
    category: string;
  }[];
  documentUpdates: {
    documentId: number;
    name: string;
    category: string;
    lastUpdated: string;
  }[];
  seasonalEvents: string[];
  locationBasedSuggestions: string[];
}

const IntelligentReminders: React.FC = () => {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderDescription, setNewReminderDescription] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');
  const [newReminderFrequency, setNewReminderFrequency] = useState<Reminder['frequency']>('once');
  const [newReminderPriority, setNewReminderPriority] = useState<Reminder['priority']>('medium');
  const [suggestedReminders, setSuggestedReminders] = useState<Partial<Reminder>[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const userReminders = await getUserReminders();
        setReminders(userReminders);
        
        const context = await analyzeUserContext();
        setUserContext(context);
        
        generateSuggestions(context);
        
        setError(null);
      } catch (err) {
        console.error('Failed to load reminders data:', err);
        setError('Failed to load reminders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const generateSuggestions = (context: UserContext) => {
    if (!context) return;
    
    const suggestions: Partial<Reminder>[] = [];
    
    context.upcomingEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      
      if (eventDate > today && (eventDate.getTime() - today.getTime()) < 30 * 24 * 60 * 60 * 1000) {
        suggestions.push({
          title: `${t('prepare')}: ${event.title}`,
          description: t('upcomingEventReminder', { title: event.title, date: new Date(event.date).toLocaleDateString() }),
          date: new Date(event.date).toISOString().split('T')[0],
          frequency: 'once',
          priority: 'medium',
          category: event.category,
          contextTriggers: ['upcoming_event']
        });
      }
    });
    
    context.documentUpdates.forEach(doc => {
      const lastUpdated = new Date(doc.lastUpdated);
      const today = new Date();
      const daysSinceUpdate = Math.floor((today.getTime() - lastUpdated.getTime()) / (24 * 60 * 60 * 1000));
      
      if (daysSinceUpdate > 180) {
        suggestions.push({
          title: `${t('review')}: ${doc.name}`,
          description: t('documentReviewReminder', { name: doc.name, days: daysSinceUpdate }),
          date: new Date().toISOString().split('T')[0],
          frequency: 'once',
          priority: 'low',
          category: doc.category,
          contextTriggers: ['document_outdated'],
          relatedDocuments: [doc.documentId]
        });
      }
    });
    
    context.seasonalEvents.forEach(event => {
      suggestions.push({
        title: event,
        description: t('seasonalEventReminder', { event }),
        date: new Date().toISOString().split('T')[0],
        frequency: 'context_based',
        priority: 'medium',
        contextTriggers: ['seasonal_event']
      });
    });
    
    context.locationBasedSuggestions.forEach(suggestion => {
      suggestions.push({
        title: suggestion,
        description: t('locationBasedReminder', { suggestion }),
        date: new Date().toISOString().split('T')[0],
        frequency: 'context_based',
        priority: 'low',
        contextTriggers: ['location_based']
      });
    });
    
    setSuggestedReminders(suggestions);
  };

  const handleCreateReminder = async () => {
    if (!newReminderTitle.trim()) return;
    
    try {
      setLoading(true);
      
      const newReminder = await createContextAwareReminder({
        title: newReminderTitle,
        description: newReminderDescription,
        frequency: newReminderFrequency,
        date: newReminderDate || new Date().toISOString().split('T')[0],
        priority: newReminderPriority,
        contextTriggers: []
      });
      
      setReminders([...reminders, newReminder]);
      
      setNewReminderTitle('');
      setNewReminderDescription('');
      setNewReminderDate('');
      setNewReminderFrequency('once');
      setNewReminderPriority('medium');
      
      setError(null);
    } catch (err) {
      console.error('Failed to create reminder:', err);
      setError('Failed to create reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await updateReminder(id, { completed: !completed });
      
      setReminders(reminders.map(reminder => 
        reminder.id === id ? { ...reminder, completed: !completed } : reminder
      ));
    } catch (err) {
      console.error('Failed to update reminder:', err);
      setError('Failed to update reminder. Please try again.');
    }
  };

  const handleDeleteReminder = async (id: number) => {
    try {
      await deleteReminder(id);
      
      setReminders(reminders.filter(reminder => reminder.id !== id));
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      setError('Failed to delete reminder. Please try again.');
    }
  };

  const handleAddSuggestion = async (suggestion: Partial<Reminder>) => {
    try {
      setLoading(true);
      
      const newReminder = await createContextAwareReminder({
        title: suggestion.title || '',
        description: suggestion.description || '',
        frequency: suggestion.frequency || 'once',
        date: suggestion.date || new Date().toISOString().split('T')[0],
        priority: suggestion.priority || 'medium',
        contextTriggers: suggestion.contextTriggers || [],
        category: suggestion.category,
        relatedDocuments: suggestion.relatedDocuments
      });
      
      setReminders([...reminders, newReminder]);
      
      setSuggestedReminders(suggestedReminders.filter(s => s.title !== suggestion.title));
      
      setError(null);
    } catch (err) {
      console.error('Failed to add suggested reminder:', err);
      setError('Failed to add reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !reminders.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">{t('intelligentReminders')}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Context-aware suggestions */}
      {showSuggestions && suggestedReminders.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{t('suggestedReminders')}</h3>
            <button 
              onClick={() => setShowSuggestions(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              {t('hide')}
            </button>
          </div>
          
          <div className="space-y-3">
            {suggestedReminders.map((suggestion, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                    <div className="flex mt-2 text-xs text-gray-500">
                      {suggestion.priority && (
                        <span className={`mr-3 px-2 py-1 rounded ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {t(suggestion.priority)}
                        </span>
                      )}
                      {suggestion.category && (
                        <span className="mr-3 px-2 py-1 bg-purple-100 text-purple-800 rounded">
                          {suggestion.category}
                        </span>
                      )}
                      {suggestion.frequency && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                          {t(suggestion.frequency)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddSuggestion(suggestion)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    {t('add')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Create new reminder form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4">{t('createNewReminder')}</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              {t('title')} *
            </label>
            <input
              type="text"
              id="title"
              value={newReminderTitle}
              onChange={(e) => setNewReminderTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('reminderTitlePlaceholder')}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {t('description')}
            </label>
            <textarea
              id="description"
              value={newReminderDescription}
              onChange={(e) => setNewReminderDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('reminderDescriptionPlaceholder')}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                {t('date')}
              </label>
              <input
                type="date"
                id="date"
                value={newReminderDate}
                onChange={(e) => setNewReminderDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                {t('frequency')}
              </label>
              <select
                id="frequency"
                value={newReminderFrequency}
                onChange={(e) => setNewReminderFrequency(e.target.value as Reminder['frequency'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="once">{t('once')}</option>
                <option value="daily">{t('daily')}</option>
                <option value="weekly">{t('weekly')}</option>
                <option value="monthly">{t('monthly')}</option>
                <option value="yearly">{t('yearly')}</option>
                <option value="context_based">{t('contextBased')}</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                {t('priority')}
              </label>
              <select
                id="priority"
                value={newReminderPriority}
                onChange={(e) => setNewReminderPriority(e.target.value as Reminder['priority'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">{t('low')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="high">{t('high')}</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleCreateReminder}
              disabled={!newReminderTitle.trim() || loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              ) : (
                t('createReminder')
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Reminders list */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('yourReminders')}</h3>
        
        {reminders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('noRemindersYet')}</p>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className={`p-4 rounded-lg border ${reminder.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={() => handleToggleComplete(reminder.id, reminder.completed)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <h4 className={`font-medium ${reminder.completed ? 'line-through text-gray-500' : ''}`}>
                        {reminder.title}
                      </h4>
                      {reminder.description && (
                        <p className={`text-sm mt-1 ${reminder.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {reminder.description}
                        </p>
                      )}
                      <div className="flex mt-2 text-xs text-gray-500">
                        <span className="mr-3">
                          {new Date(reminder.date).toLocaleDateString()}
                        </span>
                        {reminder.frequency !== 'once' && (
                          <span className="mr-3">
                            {t(reminder.frequency)}
                          </span>
                        )}
                        <span className={`mr-3 px-2 py-0.5 rounded ${
                          reminder.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {t(reminder.priority)}
                        </span>
                        {reminder.category && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                            {reminder.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={t('deleteReminder')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligentReminders;
