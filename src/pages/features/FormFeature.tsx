import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';

const mockFormFields = [
  { id: 1, type: 'text', label: 'שם מלא', required: true },
  { id: 2, type: 'email', label: 'כתובת אימייל', required: true },
  { id: 3, type: 'tel', label: 'מספר טלפון', required: false },
  { id: 4, type: 'textarea', label: 'הערות נוספות', required: false },
];

function FormFeature() {
  const [, params] = useRoute('/feature/form/:id');
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (fieldId: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const missingRequired = mockFormFields
      .filter(field => field.required)
      .some(field => !formData[field.id]);
    
    if (missingRequired) {
      setError('יש למלא את כל שדות החובה');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({});
    } catch (err) {
      setError('שגיאה בשליחת הטופס');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackClick = () => {
    setLocation(`/subcategory/${params?.id ? Math.floor(parseInt(params.id) / 100) : ''}`);
  };

  const renderFormField = (field: typeof mockFormFields[0]) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={`field-${field.id}`}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required={field.required}
          />
        );
      default:
        return (
          <input
            type={field.type}
            id={`field-${field.id}`}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={handleBackClick}
        className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10"
      >
        <span className="material-icons">arrow_forward</span>
      </button>
      
      <h1 className="text-3xl font-bold mb-6 text-right">מילוי טופס</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        {success ? (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">
              <span className="material-icons text-5xl">check_circle</span>
            </div>
            <h2 className="text-xl font-semibold mb-4">הטופס נשלח בהצלחה!</h2>
            <button
              onClick={() => setSuccess(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              מילוי טופס נוסף
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mockFormFields.map(field => (
              <div key={field.id}>
                <label htmlFor={`field-${field.id}`} className="block text-sm font-medium text-gray-700 text-right">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {renderFormField(field)}
              </div>
            ))}
            
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
                {submitting ? 'שולח...' : 'שליחת הטופס'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default FormFeature;
