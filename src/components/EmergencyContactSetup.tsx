import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { saveEmergencyContacts, EmergencyContact } from '../utils/api';

interface EmergencyContactSetupProps {
  initialContacts?: EmergencyContact[];
  onSaved?: () => void;
}

function EmergencyContactSetup({ initialContacts = [], onSaved }: EmergencyContactSetupProps) {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts.length > 0 ? initialContacts : [{ name: '', email: '', phone: '', relationship: '', accessLevel: 'basic' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (index: number, field: keyof EmergencyContact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value,
    };
    setContacts(updatedContacts);
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', email: '', phone: '', relationship: '', accessLevel: 'basic' }]);
  };

  const handleRemoveContact = (index: number) => {
    if (contacts.length === 1) {
      return; // Keep at least one contact form
    }
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      await saveEmergencyContacts(contacts);
      setSuccess(true);
      
      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error('Failed to save emergency contacts:', err);
      setError(t('emergency.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-right">{t('emergency.setupTitle')}</h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 text-right">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4 text-right">
          {t('emergency.saveSuccess')}
        </div>
      )}
      
      <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded mb-6 text-right">
        {t('emergency.warning')}
      </div>
      
      <form onSubmit={handleSubmit}>
        {contacts.map((contact, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <button
                type="button"
                onClick={() => handleRemoveContact(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                disabled={contacts.length === 1}
              >
                <span className="material-icons">delete</span>
              </button>
              <h3 className="text-lg font-semibold">{t('emergency.contact')} #{index + 1}</h3>
            </div>
            
            <div className="mb-4">
              <label htmlFor={`name-${index}`} className="block text-gray-700 dark:text-gray-300 text-right mb-2">
                {t('emergency.name')}
              </label>
              <input
                type="text"
                id={`name-${index}`}
                value={contact.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor={`email-${index}`} className="block text-gray-700 dark:text-gray-300 text-right mb-2">
                {t('emergency.email')}
              </label>
              <input
                type="email"
                id={`email-${index}`}
                value={contact.email}
                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor={`phone-${index}`} className="block text-gray-700 dark:text-gray-300 text-right mb-2">
                {t('emergency.phone')}
              </label>
              <input
                type="tel"
                id={`phone-${index}`}
                value={contact.phone}
                onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor={`relationship-${index}`} className="block text-gray-700 dark:text-gray-300 text-right mb-2">
                {t('emergency.relationship')}
              </label>
              <input
                type="text"
                id={`relationship-${index}`}
                value={contact.relationship}
                onChange={(e) => handleInputChange(index, 'relationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-right mb-2">
                {t('emergency.accessLevel')}
              </label>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    contact.accessLevel === 'full'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => handleInputChange(index, 'accessLevel', 'full')}
                >
                  {t('emergency.accessFull')}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    contact.accessLevel === 'medical'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => handleInputChange(index, 'accessLevel', 'medical')}
                >
                  {t('emergency.accessMedical')}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    contact.accessLevel === 'basic'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => handleInputChange(index, 'accessLevel', 'basic')}
                >
                  {t('emergency.accessBasic')}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={handleAddContact}
            className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span className="material-icons mr-1">add_circle</span>
            {t('emergency.addContact')}
          </button>
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

export default EmergencyContactSetup;
