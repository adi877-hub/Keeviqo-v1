import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';

interface Subcategory {
  id: number;
  name: string;
  features: Feature[];
}

interface Feature {
  id: number;
  type: string;
  label: string;
  url?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  smartFeatures: string;
  includes: string;
  subcategories: Subcategory[];
}

const mockCategory: Category = {
  id: 1,
  name: "ביטוח לאומי",
  description: "ניהול מסמכים ותהליכים מול ביטוח לאומי",
  smartFeatures: "שליחת טפסים ישירות מתוך המערכת • תיעוד שיחות ותגובות מביטוח לאומי • התראות לבקשות פתוחות או חסרות",
  includes: "פניות, תביעות, טפסים, אישורים • נכות, דמי לידה, הבטחת הכנסה, ניידות",
  subcategories: [
    {
      id: 101,
      name: "תביעות",
      features: [
        { id: 1001, type: "upload", label: "העלאת מסמכים" },
        { id: 1002, type: "reminder", label: "תזכורת לטיפול" },
        { id: 1003, type: "external_link", label: "אתר ביטוח לאומי", url: "https://www.btl.gov.il/" }
      ]
    },
    {
      id: 102,
      name: "אישורים",
      features: [
        { id: 1004, type: "upload", label: "העלאת אישורים" },
        { id: 1005, type: "form", label: "טופס בקשה" }
      ]
    }
  ]
};

function CategoryPage() {
  const [, params] = useRoute('/category/:id');
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    setCategory(mockCategory);
  }, [params?.id]);

  const handleSubcategoryClick = (subcategoryId: number) => {
    setLocation(`/subcategory/${subcategoryId}`);
  };

  const handleBackClick = () => {
    setLocation('/');
  };

  if (!category) {
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
      
      <h1 className="text-3xl font-bold mb-4 text-right">{category.name}</h1>
      <p className="text-gray-600 mb-6">{category.description}</p>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">פיצ&apos;רים חכמים:</h2>
        <p>{category.smartFeatures}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">כולל:</h2>
        <p>{category.includes}</p>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">תתי-קטגוריות:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.subcategories.map((subcategory) => (
          <div 
            key={subcategory.id} 
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleSubcategoryClick(subcategory.id)}
          >
            <h3 className="text-lg font-semibold mb-2">{subcategory.name}</h3>
            <div className="flex flex-wrap">
              {subcategory.features.map((feature) => (
                <span 
                  key={feature.id} 
                  className={`feature-button feature-${feature.type} text-xs`}
                >
                  {feature.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
