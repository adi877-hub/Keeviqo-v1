import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { getUserEmergencyData, getEmergencyContacts, EmergencyContact, EmergencyData, MedicalInfo } from '../utils/api';

function EmergencyModePage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState('medical');

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        if (isVerified) {
          const data = await getUserEmergencyData();
          const contactsData = await getEmergencyContacts();
          
          setEmergencyData(data);
          setContacts(contactsData);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch emergency data:', err);
        setError(t('emergency.fetchError'));
        setLoading(false);
      }
    };

    fetchEmergencyData();
  }, [isVerified, t]);

  const verifyAccessCode = () => {
    if (accessCode.length === 6 && /^\d+$/.test(accessCode)) {
      setIsVerified(true);
    } else {
      setError(t('emergency.invalidCode'));
    }
  };

  if (loading && isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-red-700 font-semibold">{t('emergency.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{t('emergency.title')}</h1>
          
          <p className="text-gray-600 mb-6 text-center">
            {t('emergency.accessDescription')}
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accessCode">
              {t('emergency.accessCode')}
            </label>
            <input
              id="accessCode"
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="123456"
              maxLength={6}
            />
          </div>
          
          <button
            onClick={verifyAccessCode}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            {t('emergency.accessButton')}
          </button>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setLocation('/')}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              {t('emergency.returnToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-red-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">{t('emergency.title')}</h1>
              <button
                onClick={() => setLocation('/')}
                className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                {t('emergency.exit')}
              </button>
            </div>
          </div>
          
          {emergencyData && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row mb-6 items-start">
                <div className="bg-red-100 p-3 rounded-full mb-4 md:mb-0 md:mr-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{emergencyData.user.name}</h2>
                  <p className="text-gray-600">{t('emergency.id')}: {emergencyData.user.id}</p>
                  <p className="text-gray-600">{t('emergency.dob')}: {emergencyData.user.dateOfBirth}</p>
                  <p className="text-gray-600">{t('emergency.address')}: {emergencyData.user.address}</p>
                  <p className="text-gray-600">{t('emergency.phone')}: {emergencyData.user.phone}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'medical'
                        ? 'border-b-2 border-red-600 text-red-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('medical')}
                  >
                    {t('emergency.tabs.medical')}
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'contacts'
                        ? 'border-b-2 border-red-600 text-red-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('contacts')}
                  >
                    {t('emergency.tabs.contacts')}
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'documents'
                        ? 'border-b-2 border-red-600 text-red-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('documents')}
                  >
                    {t('emergency.tabs.documents')}
                  </button>
                </div>
                
                <div className="py-4">
                  {activeTab === 'medical' && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-700 mb-2">{t('emergency.medical.bloodType')}</h3>
                          <p className="text-2xl font-bold text-red-600">{emergencyData.medicalInfo.bloodType}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-700 mb-2">{t('emergency.medical.doctor')}</h3>
                          <p className="font-medium">{emergencyData.medicalInfo.doctorName}</p>
                          <p className="text-gray-600">{emergencyData.medicalInfo.doctorPhone}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">{t('emergency.medical.allergies')}</h3>
                        {emergencyData.medicalInfo.allergies.length > 0 ? (
                          <ul className="bg-red-50 p-3 rounded-lg">
                            {emergencyData.medicalInfo.allergies.map((allergy, index) => (
                              <li key={index} className="mb-1 last:mb-0 font-medium text-red-700">
                                • {allergy}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">{t('emergency.medical.noAllergies')}</p>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">{t('emergency.medical.medications')}</h3>
                        {emergencyData.medicalInfo.medications.length > 0 ? (
                          <ul className="bg-blue-50 p-3 rounded-lg">
                            {emergencyData.medicalInfo.medications.map((medication, index) => (
                              <li key={index} className="mb-1 last:mb-0 font-medium text-blue-700">
                                • {medication}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">{t('emergency.medical.noMedications')}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">{t('emergency.medical.conditions')}</h3>
                        {emergencyData.medicalInfo.conditions.length > 0 ? (
                          <ul className="bg-yellow-50 p-3 rounded-lg">
                            {emergencyData.medicalInfo.conditions.map((condition, index) => (
                              <li key={index} className="mb-1 last:mb-0 font-medium text-yellow-700">
                                • {condition}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">{t('emergency.medical.noConditions')}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'contacts' && (
                    <div>
                      {contacts.length > 0 ? (
                        <div className="space-y-4">
                          {contacts.map((contact) => (
                            <div key={contact.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                                  <p className="text-gray-600">{contact.relationship}</p>
                                </div>
                                <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-800">
                                  {contact.accessLevel}
                                </div>
                              </div>
                              
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <a 
                                  href={`tel:${contact.phone}`} 
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                  </svg>
                                  {contact.phone}
                                </a>
                                
                                <a 
                                  href={`mailto:${contact.email}`} 
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                  </svg>
                                  {contact.email}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">{t('emergency.contacts.none')}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'documents' && (
                    <div>
                      {emergencyData.documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {emergencyData.documents.map((doc) => (
                            <a 
                              key={doc.id}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-start"
                            >
                              <div className="bg-gray-100 p-2 rounded mr-3">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-medium text-blue-600">{doc.name}</h3>
                                <p className="text-xs text-gray-500">{doc.type}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">{t('emergency.documents.none')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <p className="text-red-700 font-medium">
            {t('emergency.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyModePage;
