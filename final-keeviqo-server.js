import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

// Helper function to get feature icon based on type
function getFeatureIcon(type) {
  switch (type) {
    case 'upload': return 'upload_file';
    case 'reminder': return 'notifications';
    case 'external_link': return 'link';
    case 'form': return 'description';
    default: return 'star';
  }
}

// Load categories data from multiple possible sources with fallbacks
let categoriesData = [];
try {
  const possibleFiles = [
    'categories_full_72.json',
    'all_categories.json',
    'full_categories.json'
  ];
  
  let loaded = false;
  for (const file of possibleFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`Loading categories from ${file}...`);
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const parsedData = JSON.parse(rawData);
      
      if (parsedData.categories && Array.isArray(parsedData.categories)) {
        categoriesData = parsedData.categories;
      } else if (Array.isArray(parsedData)) {
        categoriesData = parsedData;
      }
      
      if (categoriesData.length > 0) {
        console.log(`Successfully loaded ${categoriesData.length} categories from ${file}`);
        loaded = true;
        break;
      }
    }
  }
  
  if (!loaded) {
    throw new Error('No valid categories found in any file');
  }
} catch (error) {
  console.error('Error loading categories:', error);
  // Create fallback categories if loading fails
  categoriesData = [
    { id: 1, name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
    { id: 2, name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" },
    { id: 3, name: "חינוך", icon: "school", description: "תעודות, קורסים, והשכלה" },
    { id: 4, name: "נדל\"ן", icon: "home", description: "מסמכי דירה, משכנתא, וחוזי שכירות" },
    { id: 5, name: "משפחה", icon: "family_restroom", description: "מסמכים משפחתיים, אירועים, ותכנון" },
    { id: 6, name: "קריירה", icon: "work", description: "קורות חיים, חוזי עבודה, והמלצות" }
  ];
}

// Set up Express routes
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoints
app.get('/api/categories', (req, res) => {
  res.json(categoriesData);
});

// HTML routes
app.get('/', (req, res) => {
  res.send(generateDashboardHtml());
});

app.get('/category/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categoriesData.find(cat => cat.id === categoryId);
  
  if (!category) {
    return res.status(404).send(generateErrorHtml('קטגוריה לא נמצאה'));
  }
  
  res.send(generateCategoryHtml(category));
});

app.get('/subcategory/:categoryId/:subcategoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const subcategoryId = parseInt(req.params.subcategoryId);
  
  const category = categoriesData.find(cat => cat.id === categoryId);
  
  if (!category) {
    return res.status(404).send(generateErrorHtml('קטגוריה לא נמצאה'));
  }
  
  const subcategory = (category.subcategories || []).find(sub => sub.id === subcategoryId);
  
  if (!subcategory) {
    return res.status(404).send(generateErrorHtml('תת-קטגוריה לא נמצאה'));
  }
  
  res.send(generateSubcategoryHtml(category, subcategory));
});

// Smart feature routes
app.get('/smart-feature/:name', (req, res) => {
  const featureName = req.params.name;
  const categoryId = req.query.category ? parseInt(req.query.category) : null;
  
  res.send(generateSmartFeatureHtml(featureName, categoryId));
});

// Feature routes
app.get('/feature/:type/:id', (req, res) => {
  const featureType = req.params.type;
  const featureId = parseInt(req.params.id);
  
  res.send(generateFeatureHtml(featureType, featureId));
});

// Generate HTML for error pages
function generateErrorHtml(message) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - שגיאה</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Rubik', sans-serif;
      direction: rtl;
      text-align: right;
      background-color: #f5f7fa;
      color: #333;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    
    .error-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 40px;
      text-align: center;
      max-width: 500px;
    }
    
    .error-icon {
      font-size: 64px;
      color: #f44336;
      margin-bottom: 20px;
    }
    
    .error-message {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 20px;
    }
    
    .back-link {
      display: inline-block;
      background-color: #1976D2;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      margin-top: 20px;
      transition: background-color 0.2s;
    }
    
    .back-link:hover {
      background-color: #1565C0;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="error-icon">
      <span class="material-icons">error</span>
    </div>
    <div class="error-message">${message}</div>
    <a href="/" class="back-link">חזרה לדף הבית</a>
  </div>
</body>
</html>`;
}
