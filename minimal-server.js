import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Helper function to get appropriate icon for category based on name
function getIconForCategory(name) {
  const iconMap = {
    'בריאות': 'health_and_safety',
    'פיננסים': 'account_balance',
    'חינוך': 'school',
    'נדל"ן': 'home',
    'משפחה': 'family_restroom',
    'קריירה': 'work',
    'ביטוח': 'security',
    'רכב': 'directions_car',
    'חיות מחמד': 'pets',
    'תחביבים': 'sports_esports',
    'נסיעות': 'flight',
    'קניות': 'shopping_cart',
    'אוכל': 'restaurant',
    'טכנולוגיה': 'devices',
    'ספורט': 'fitness_center'
  };
  return iconMap[name] || 'folder';
}

// Load categories data
let categoriesData = [];
try {
  const possibleFiles = [
    'categories_full_72.json',
    'all_categories.json',
    'full_categories.json',
    'categories.json'
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
  categoriesData = [
    { id: 1, name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
    { id: 2, name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" },
    { id: 3, name: "חינוך", icon: "school", description: "תעודות, קורסים, והשכלה" },
    { id: 4, name: "נדל\"ן", icon: "home", description: "מסמכי דירה, משכנתא, וחוזי שכירות" },
    { id: 5, name: "משפחה", icon: "family_restroom", description: "מסמכים משפחתיים, אירועים, ותכנון" },
    { id: 6, name: "קריירה", icon: "work", description: "קורות חיים, חוזי עבודה, והמלצות" }
  ];
}

// API endpoints
app.get('/api/categories', (req, res) => {
  res.json(categoriesData);
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keeviqo - ניהול מידע אישי</title>
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
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      
      header {
        background-color: #1976D2;
        color: white;
        padding: 15px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      .logo {
        font-size: 24px;
        font-weight: bold;
        display: flex;
        align-items: center;
      }
      
      .logo .material-icons {
        margin-left: 10px;
      }
      
      .user-menu {
        display: flex;
        align-items: center;
      }
      
      .user-menu .material-icons {
        margin-left: 5px;
        cursor: pointer;
      }
      
      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .category-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        padding: 20px;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
      }
      
      .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .category-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .category-icon {
        background-color: #e3f2fd;
        color: #1976D2;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 15px;
      }
      
      .category-title {
        font-size: 18px;
        font-weight: 500;
        margin: 0;
      }
      
      .category-description {
        color: #666;
        font-size: 14px;
        margin-bottom: 15px;
      }
      
      .smart-features {
        font-size: 13px;
        color: #1976D2;
        margin-bottom: 10px;
      }
      
      .smart-tools {
        display: flex;
        justify-content: center;
        margin: 20px 0;
        flex-wrap: wrap;
      }
      
      .smart-tool {
        background-color: #1976D2;
        color: white;
        padding: 10px 15px;
        margin: 5px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }
      
      .smart-tool:hover {
        background-color: #1565C0;
      }
      
      .smart-tool .material-icons {
        margin-left: 5px;
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="header-content">
        <div class="logo">
          <span class="material-icons">dashboard</span>
          <span>Keeviqo</span>
        </div>
        <div class="user-menu">
          <span class="material-icons">notifications</span>
          <span class="material-icons">account_circle</span>
        </div>
      </div>
    </header>
    
    <div class="container">
      <div class="smart-tools">
        <div class="smart-tool" onclick="alert('KeeviAI: מערכת בינה מלאכותית לניהול מידע אישי')">
          <span class="material-icons">psychology</span>
          <span>KeeviAI</span>
        </div>
        <div class="smart-tool" onclick="alert('KeeviScan: סריקה וזיהוי אוטומטי של מסמכים')">
          <span class="material-icons">document_scanner</span>
          <span>KeeviScan</span>
        </div>
        <div class="smart-tool" onclick="alert('KeeviRemind: מערכת תזכורות חכמה')">
          <span class="material-icons">notifications_active</span>
          <span>KeeviRemind</span>
        </div>
        <div class="smart-tool" onclick="alert('KeeviMap: מיפוי מידע אישי')">
          <span class="material-icons">map</span>
          <span>KeeviMap</span>
        </div>
        <div class="smart-tool" onclick="alert('KeeviShare: שיתוף מידע מאובטח')">
          <span class="material-icons">share</span>
          <span>KeeviShare</span>
        </div>
      </div>
      
      <div class="categories-grid">
        ${categoriesData.map((category, index) => `
          <div class="category-card" data-id="${category.id}" onclick="window.location.href='/category/${category.id}'">
            <div class="category-header">
              <div class="category-icon">
                <span class="material-icons">${category.icon || getIconForCategory(category.name)}</span>
              </div>
              <h3 class="category-title">${category.name}</h3>
            </div>
            <p class="category-description">${category.description || ''}</p>
            <div class="smart-features">
              <strong>פיצ'רים חכמים:</strong> ${category.smartFeatures || ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </body>
  </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Keeviqo server running at http://localhost:${PORT}`);
  console.log(`Total categories loaded: ${categoriesData.length}`);
});
