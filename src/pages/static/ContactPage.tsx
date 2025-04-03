import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import { sendContactForm } from '../../utils/api';

function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      await sendContactForm(formData);
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setStatus('error');
      setError(t('contact.form.error'));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      
      <h1 className="text-3xl font-bold mb-6 text-right">{t('contact.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('contact.form.title')}</h2>
          
          {status === 'success' ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-right">
              {t('contact.form.success')}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-right mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-right mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 text-right mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 text-right mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  required
                ></textarea>
              </div>
              
              {status === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors w-full"
              >
                {status === 'submitting' ? t('contact.form.submitting') : t('contact.form.submit')}
              </button>
            </form>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">{t('contact.info.title')}</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 text-right">{t('contact.info.address.title')}</h3>
            <p className="text-right">{t('contact.info.address.line1')}</p>
            <p className="text-right">{t('contact.info.address.line2')}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 text-right">{t('contact.info.phone.title')}</h3>
            <p className="text-right">{t('contact.info.phone.number')}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 text-right">{t('contact.info.email.title')}</h3>
            <p className="text-right">
              <a href="mailto:info@keeviqo.com" className="text-blue-500 hover:underline">
                {t('contact.info.email.address')}
              </a>
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2 text-right">{t('contact.info.hours.title')}</h3>
            <p className="text-right">{t('contact.info.hours.weekdays')}</p>
            <p className="text-right">{t('contact.info.hours.weekend')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
