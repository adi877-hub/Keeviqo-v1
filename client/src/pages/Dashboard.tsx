import React, { useState } from 'react';
import { useLocation } from 'wouter';

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  smartFeatures: string;
  includes: string;
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: "ביטוח לאומי",
    icon: "security",
    description: "ניהול מסמכים ותהליכים מול ביטוח לאומי",
    smartFeatures: "שליחת טפסים ישירות מתוך המערכת • תיעוד שיחות ותגובות מביטוח לאומי • התראות לבקשות פתוחות או חסרות",
    includes: "פניות, תביעות, טפסים, אישורים • נכות, דמי לידה, הבטחת הכנסה, ניידות"
  },
  {
    id: 2,
    name: "בריאות",
    icon: "favorite",
    description: "ניהול מידע רפואי ותיעוד טיפולים",
    smartFeatures: "תזכורות לתרופות ובדיקות • מעקב אחר תוצאות • קישור למערכות קופות החולים",
    includes: "תוצאות בדיקות • מרשמים • סיכומי ביקור • היסטוריה רפואית"
  },
  {
    id: 3,
    name: "חינוך",
    icon: "school",
    description: "ניהול מסמכים ומידע הקשורים לחינוך",
    smartFeatures: "מעקב אחר הישגים • תזכורות לאירועים חינוכיים • ניהול תקשורת עם מוסדות חינוך",
    includes: "תעודות • אישורי לימודים • תכתובות עם מורים • לוח זמנים"
  }
];

function Dashboard() {
  const [categories] = useState<Category[]>(mockCategories);
  const [, setLocation] = useLocation();

  const handleCategoryClick = (categoryId: number) => {
    setLocation(`/category/${categoryId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-right">Keeviqo Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="category-card cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-2 rounded-full ml-3">
                <span className="material-icons">{category.icon}</span>
              </div>
              <h2 className="text-xl font-bold">{category.name}</h2>
            </div>
            
            <p className="text-gray-600 mb-4">{category.description}</p>
            
            <div className="border-t pt-3">
              <h3 className="font-semibold text-sm mb-2">פיצ'רים חכמים:</h3>
              <p className="text-sm text-gray-700">{category.smartFeatures}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
