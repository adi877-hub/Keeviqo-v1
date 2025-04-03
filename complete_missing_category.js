// קובץ מסייע להוספת פיצ'רים חכמים לקטגוריות החסרות

import fs from 'fs';

// קריאת הקובץ הקיים
const categories = JSON.parse(fs.readFileSync('./categories.json', 'utf8'));

// מיפוי בין מזהי קטגוריות לפיצ'רים חכמים וכיסוי שחסרים
const smartFeaturesUpdates = {
  // מעקב משפטי ותביעות פתוחות
  82: "תזכורות לדיונים בבית משפט • ניטור תהליכים משפטיים מתמשכים • קישור מסמכים לתביעה ספציפית • התראות על תאריכי הגשה חשובים • תיעוד שלבים בהליך המשפטי • שיתוף מסמכים עם עורכי דין • מעקב אחר פסקי דין וערעורים • ניהול פרוטוקולים ומסמכי בית משפט",
  
  // נוסיף גם includes לקטגוריות שחסרות
};

// עדכון הקטגוריות
let updatedCount = 0;

categories.forEach(category => {
  if (smartFeaturesUpdates[category.id]) {
    category.smartFeatures = smartFeaturesUpdates[category.id];
    updatedCount++;
    globalThis.console.log(`Updated smart features for category: ${category.id} - ${category.name}`);
  }
  
  // עדכון includes אם צריך
  if (category.id === 82 && (!category.includes || category.includes.trim() === '')) {
    category.includes = "פרטי תביעות מתמשכות • פרוטוקולים מבית המשפט • מסמכי עדויות ותצהירים • התכתבויות עם עורכי דין • מסמכי הגשה לבית משפט • תאריכי דיונים עתידיים • כתבי תביעה וכתבי הגנה • החלטות ביניים ופסקי דין";
    console.log(`Updated includes for category: ${category.id} - ${category.name}`);
  }
});

// שמירת הקובץ המעודכן
fs.writeFileSync('./categories.json', JSON.stringify(categories, null, 2));

console.log(`Updated ${updatedCount} categories with missing information.`);
