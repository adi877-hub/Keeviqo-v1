import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';

interface Feature {
  id: number;
  type: string;
  label: string;
  url?: string;
}

interface Subcategory {
  id: number;
  name: string;
  features: Feature[];
  categoryId: number;
}

const mockSubcategory: Subcategory = {
  id: 101,
  name: "תביעות",
  categoryId: 1,
  features: [
    { id: 1001, type: "upload", label: "העלאת מסמכים" },
    { id: 1002, type: "reminder", label: "תזכורת לטיפול" },
    { id: 1003, type: "external_link", label: "אתר ביטוח לאומי", url: "https://www.btl.gov.il/" }
  ]
};

function SubcategoryPage() {
  const [, params] = useRoute('/subcategory/:id');
  const [, setLocation] = useLocation();
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);

  useEffect(() => {
    setSubcategory(mockSubcategory);
  }, [params?.id]);

  const handleFeatureClick = (feature: Feature) => {
    if (feature.type === 'external_link' && feature.url) {
      window.open(feature.url, '_blank');
    } else {
      setLocation(`/feature/${feature.type}/${feature.id}`);
    }
  };

  const handleBackClick = () => {
    if (subcategory) {
      setLocation(`/category/${subcategory.categoryId}`);
    } else {
      setLocation('/');
    }
  };

  if (!subcategory) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={handleBackClick}
        className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10"
      >
        <span className="material-icons">arrow_forward</span>
      </button>
      
      <h1 className="text-3xl font-bold mb-6 text-right">{subcategory.name}</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">פעולות זמינות:</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subcategory.features.map((feature) => (
            <div
              key={feature.id}
              className={`p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow feature-${feature.type}`}
              onClick={() => handleFeatureClick(feature)}
            >
              <div className="flex items-center">
                <span className="material-icons mr-2">
                  {feature.type === 'upload' && 'upload_file'}
                  {feature.type === 'reminder' && 'notifications'}
                  {feature.type === 'external_link' && 'link'}
                  {feature.type === 'form' && 'description'}
                </span>
                <h3 className="text-lg font-semibold">{feature.label}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubcategoryPage;
