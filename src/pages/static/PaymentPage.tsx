import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import PaymentProcessor from '../../components/PaymentProcessor';

function PaymentPage() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const plans = [
    {
      id: 'basic',
      name: t('payment.plans.basic.name'),
      price: 49.99,
      features: [
        t('payment.plans.basic.feature1'),
        t('payment.plans.basic.feature2'),
        t('payment.plans.basic.feature3'),
      ],
    },
    {
      id: 'premium',
      name: t('payment.plans.premium.name'),
      price: 99.99,
      features: [
        t('payment.plans.premium.feature1'),
        t('payment.plans.premium.feature2'),
        t('payment.plans.premium.feature3'),
        t('payment.plans.premium.feature4'),
      ],
    },
    {
      id: 'enterprise',
      name: t('payment.plans.enterprise.name'),
      price: 199.99,
      features: [
        t('payment.plans.enterprise.feature1'),
        t('payment.plans.enterprise.feature2'),
        t('payment.plans.enterprise.feature3'),
        t('payment.plans.enterprise.feature4'),
        t('payment.plans.enterprise.feature5'),
      ],
    },
  ];
  
  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
  
  return (
    <div className="container mx-auto p-4">
      <BackButton />
      
      <h1 className="text-3xl font-bold mb-6 text-right">{t('payment.pageTitle')}</h1>
      
      {!selectedPlan ? (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-right">{t('payment.choosePlan')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPlan(plan.id)}
              >
                <h2 className="text-xl font-bold mb-2 text-right">{plan.name}</h2>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-right">₪{plan.price.toFixed(2)}</div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-end">
                      <span className="text-right">{feature}</span>
                      <span className="material-icons text-green-500 mr-2">check_circle</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors w-full"
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {t('payment.selectPlan')}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-right">{t('payment.selectedPlan')}</h2>
            
            {selectedPlanData && (
              <div>
                <h3 className="text-lg font-bold mb-2 text-right">{selectedPlanData.name}</h3>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-right">₪{selectedPlanData.price.toFixed(2)}</div>
                
                <ul className="space-y-2 mb-6">
                  {selectedPlanData.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-end">
                      <span className="text-right">{feature}</span>
                      <span className="material-icons text-green-500 mr-2">check_circle</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors w-full"
                  onClick={() => setSelectedPlan(null)}
                >
                  {t('payment.changePlan')}
                </button>
              </div>
            )}
          </div>
          
          <div>
            {selectedPlanData && (
              <PaymentProcessor 
                amount={selectedPlanData.price}
                description={`${t('payment.subscriptionTo')} ${selectedPlanData.name}`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
