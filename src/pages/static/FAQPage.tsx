import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';

interface FAQItem {
  question: string;
  answer: string;
}

function FAQPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const faqItems: FAQItem[] = [
    {
      question: t('faq.items.q1'),
      answer: t('faq.items.a1'),
    },
    {
      question: t('faq.items.q2'),
      answer: t('faq.items.a2'),
    },
    {
      question: t('faq.items.q3'),
      answer: t('faq.items.a3'),
    },
    {
      question: t('faq.items.q4'),
      answer: t('faq.items.a4'),
    },
    {
      question: t('faq.items.q5'),
      answer: t('faq.items.a5'),
    },
    {
      question: t('faq.items.q6'),
      answer: t('faq.items.a6'),
    },
    {
      question: t('faq.items.q7'),
      answer: t('faq.items.a7'),
    },
    {
      question: t('faq.items.q8'),
      answer: t('faq.items.a8'),
    },
  ];
  
  const filteredFAQs = searchTerm 
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqItems;
  
  return (
    <div className="container mx-auto p-4">
      <BackButton />
      
      <h1 className="text-3xl font-bold mb-6 text-right">{t('faq.title')}</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder={t('faq.searchPlaceholder')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-6">
            {filteredFAQs.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <h3 className="text-xl font-semibold mb-2 text-right">{item.question}</h3>
                <p className="text-gray-700 text-right">{item.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('faq.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FAQPage;
