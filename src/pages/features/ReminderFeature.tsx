import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';

function ReminderFeature() {
  const [, params] = useRoute('/feature/reminder/:id');
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date) {
      setError('יש למלא את כל השדות החובה');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTitle('');
      setDescription('');
      setDate('');
      setFrequency('once');
    } catch (err) {
      setError('שגיאה ביצירת התזכורת');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackClick = () => {
    setLocation(`/subcategory/${params?.id ? Math.floor(parseInt(params.id) / 100) : ''}`);
  };

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={handleBackClick}
        className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10"
      >
        <span className="material-icons">arrow_forward</span>
      </button>
      
      <h1 className="text-3xl font-bold mb-6 text-right">יצירת תזכורת</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        {success ? (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">
              <span className="material-icons text-5xl">check_circle</span>
            </div>
            <h2 className="text-xl font-semibold mb-4">התזכורת נוצרה בהצלחה!</h2>
            <button
              onClick={() => setSuccess(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              יצירת תזכורת נוספת
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 text-right">
                כותרת <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 text-right">
                תיאור
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 text-right">
                תאריך <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 text-right">
                תדירות
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="once">חד פעמי</option>
                <option value="daily">יומי</option>
                <option value="weekly">שבועי</option>
                <option value="monthly">חודשי</option>
              </select>
            </div>
            
            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 rounded ${
                  submitting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {submitting ? 'שולח...' : 'יצירת תזכורת'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReminderFeature;
