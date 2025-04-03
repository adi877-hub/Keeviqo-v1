import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { processPayment, generateInvoice, PaymentData } from '../utils/api';

interface PaymentProcessorProps {
  amount: number;
  description: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

function PaymentProcessor({ amount, description, onSuccess, onError }: PaymentProcessorProps) {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method: 'paypal' | 'stripe') => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const paymentData: PaymentData = {
        amount,
        currency: 'ILS',
        method: paymentMethod,
        description,
        customerInfo,
      };

      const response = await processPayment(paymentData);
      setPaymentId(response.paymentId);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      const errorMessage = t('payment.error');
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!paymentId) return;
    
    try {
      const invoiceData = await generateInvoice(paymentId);
      
      const link = document.createElement('a');
      link.href = invoiceData.invoiceUrl;
      link.download = 'keeviqo-invoice.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(t('payment.invoiceError'));
    }
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4 text-right">
          {t('payment.success')}
        </div>
        
        <div className="text-center">
          <button
            onClick={handleGenerateInvoice}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            {t('payment.generateInvoice')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-right">{t('payment.title')}</h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 text-right">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-right mb-2">
            {t('payment.amount')}
          </label>
          <div className="text-xl font-bold text-right">₪{amount.toFixed(2)}</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm text-right">{description}</div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-right mb-2">
            {t('payment.method')}
          </label>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                paymentMethod === 'stripe'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => handlePaymentMethodChange('stripe')}
            >
              Stripe
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                paymentMethod === 'paypal'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => handlePaymentMethodChange('paypal')}
            >
              PayPal
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-right mb-2">
            {t('payment.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-right mb-2">
            {t('payment.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isProcessing}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors w-full"
        >
          {isProcessing ? t('payment.processing') : t('payment.pay')}
        </button>
      </form>
    </div>
  );
}

export default PaymentProcessor;
