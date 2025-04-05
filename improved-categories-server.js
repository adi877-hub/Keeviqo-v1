import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { generateSmartFeatureHtml } from './generateSmartFeatureHtml.js';
const app = express();
const PORT = 3002;

// Load categories data with proper fallbacks
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
        console.log(`Loaded ${categoriesData.length} categories from ${file}`);
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
  categoriesData = getDefaultCategories();
}

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
}

// Express middleware
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoints
app.get('/api/categories', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCategories = categoriesData.slice(startIndex, endIndex);
  res.json({
    total: categoriesData.length,
    page,
    limit,
    categories: paginatedCategories,
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || 
      req.path.startsWith('/feature/') || 
      req.path.startsWith('/subcategory/') || 
      req.path.startsWith('/category/')) {
    return next();
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  res.send(generateDashboardHtml(page, limit));
});

app.get('/login-old', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - Login</title>
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
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    
    .login-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    
    h1 {
      color: #1976D2;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    p {
      color: #666;
      margin-bottom: 30px;
    }
    
    form {
      text-align: right;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 20px;
      font-family: 'Rubik', sans-serif;
    }
    
    button {
      background-color: #1976D2;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 12px 20px;
      font-family: 'Rubik', sans-serif;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
    }
    
    button:hover {
      background-color: #1565C0;
    }
    
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="login-card">
    <h1>Keeviqo</h1>
    <p>המערכת החכמה לניהול מידע אישי</p>
    
    <form action="/auth/login" method="POST" onsubmit="return handleLogin(event)">
      <label for="username">שם משתמש</label>
      <input type="text" id="username" name="username">
      
      <label for="password">סיסמה</label>
      <input type="password" id="password" name="password">
      
      <button type="submit">התחברות</button>
    </form>
    
    <div class="footer">
      © 2025 Keeviqo. כל הזכויות שמורות.
    </div>
  </div>
  
  <script>
    function handleLogin(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (username === 'admin' && password === 'Keeviqo2023!') {
        window.location.href = '/?bypass_auth=true';
      } else {
        alert('שם משתמש או סיסמה שגויים');
      }
      
      return false;
    }
  </script>
</body>
</html>`);
});

app.use((req, res, next) => {
  next();
});

function generateDashboardHtml(page = 1, limit = 12) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCategories = categoriesData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(categoriesData.length / limit);
  
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - Dashboard</title>
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
      margin-left: 15px;
      cursor: pointer;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .welcome-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .welcome-title {
      font-size: 24px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 10px;
      color: #1976D2;
    }
    
    .welcome-description {
      font-size: 16px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
    
    .categories-title {
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    
    .categories-title .material-icons {
      margin-left: 8px;
      color: #1976D2;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .category-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .category-icon {
      background-color: #e3f2fd;
      color: #1976D2;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      font-size: 24px;
    }
    
    .category-title {
      font-size: 18px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 10px;
      color: #333;
    }
    
    .category-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
      flex-grow: 1;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      gap: 5px;
    }
    
    .pagination-button {
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
      font-family: 'Rubik', sans-serif;
      transition: background-color 0.2s;
    }
    
    .pagination-button:hover {
      background-color: #f0f0f0;
    }
    
    .pagination-button.active {
      background-color: #1976D2;
      color: white;
      border-color: #1976D2;
    }
    
    .pagination-button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    
    .smart-features-section {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    
    .section-title .material-icons {
      margin-left: 8px;
      color: #1976D2;
    }
    
    .smart-features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    
    .smart-feature-card {
      background-color: #f5f7fa;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    
    .smart-feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .smart-feature-icon {
      background-color: #e3f2fd;
      color: #1976D2;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px;
      font-size: 24px;
    }
    
    .smart-feature-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .smart-feature-description {
      font-size: 12px;
      color: #666;
    }
    
    .loading-indicator {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #1976D2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading-indicator" id="loadingIndicator">
    <div class="loading-spinner"></div>
  </div>

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
    <div class="welcome-card">
      <h1 class="welcome-title">ברוכים הבאים למערכת Keeviqo</h1>
      <p class="welcome-description">המערכת המתקדמת לניהול מידע אישי. בחר קטגוריה להתחלה.</p>
    </div>
    
    <h2 class="categories-title">
      <span class="material-icons">category</span>
      <span>הקטגוריות שלי</span>
    </h2>
    
    <div class="categories-grid">
      ${paginatedCategories.map(category => `
        <div class="category-card" onclick="navigateToCategory(${category.id})">
          <div class="category-icon">
            <span class="material-icons">${category.icon}</span>
          </div>
          <h3 class="category-title">${category.name}</h3>
          <p class="category-description">${category.description || 'ניהול מידע בתחום ' + category.name}</p>
        </div>
      `).join('')}
    </div>
    
    <div class="pagination">
      <button class="pagination-button" onclick="changePage(1)" ${page === 1 ? 'disabled' : ''}>
        <span class="material-icons">first_page</span>
      </button>
      <button class="pagination-button" onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''}>
        <span class="material-icons">chevron_right</span>
      </button>
      
      ${generatePaginationButtons(page, totalPages)}
      
      <button class="pagination-button" onclick="changePage(${page + 1})" ${page === totalPages ? 'disabled' : ''}>
        <span class="material-icons">chevron_left</span>
      </button>
      <button class="pagination-button" onclick="changePage(${totalPages})" ${page === totalPages ? 'disabled' : ''}>
        <span class="material-icons">last_page</span>
      </button>
    </div>
    
    <div class="smart-features-section">
      <h2 class="section-title">
        <span class="material-icons">psychology</span>
        <span>פיצ'רים חכמים</span>
      </h2>
      
      <div class="smart-features-grid">
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviAI')">
          <div class="smart-feature-icon">
            <span class="material-icons">smart_toy</span>
          </div>
          <h3 class="smart-feature-title">KeeviAI</h3>
          <p class="smart-feature-description">עוזר אישי חכם המבוסס על בינה מלאכותית</p>
        </div>
        
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviScan')">
          <div class="smart-feature-icon">
            <span class="material-icons">document_scanner</span>
          </div>
          <h3 class="smart-feature-title">KeeviScan</h3>
          <p class="smart-feature-description">סריקה וזיהוי אוטומטי של מסמכים</p>
        </div>
        
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviRemind')">
          <div class="smart-feature-icon">
            <span class="material-icons">notifications_active</span>
          </div>
          <h3 class="smart-feature-title">KeeviRemind</h3>
          <p class="smart-feature-description">תזכורות חכמות ומותאמות אישית</p>
        </div>
        
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviMap')">
          <div class="smart-feature-icon">
            <span class="material-icons">map</span>
          </div>
          <h3 class="smart-feature-title">KeeviMap</h3>
          <p class="smart-feature-description">מיפוי חכם של המידע האישי שלך</p>
        </div>
        
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviShare')">
          <div class="smart-feature-icon">
            <span class="material-icons">share</span>
          </div>
          <h3 class="smart-feature-title">KeeviShare</h3>
          <p class="smart-feature-description">שיתוף מאובטח של מידע עם אחרים</p>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    function showLoading() {
      document.getElementById('loadingIndicator').style.display = 'flex';
    }
    
    function hideLoading() {
      document.getElementById('loadingIndicator').style.display = 'none';
    }
    
    function navigateToCategory(categoryId) {
      showLoading();
      window.location.href = '/category/' + categoryId;
    }
    
    function navigateToSmartFeature(featureName) {
      showLoading();
      window.location.href = '/smart-feature/' + featureName;
    }
    
    function changePage(page) {
      showLoading();
      window.location.href = '/?page=' + page;
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      hideLoading();
    });
  </script>
</body>
</html>`;
}

function generatePaginationButtons(currentPage, totalPages) {
  let buttons = '';
  const maxVisibleButtons = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
  
  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    buttons += `<button class="pagination-button ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }
  
  return buttons;
}

app.get('/category/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categoriesData.find(cat => cat.id === categoryId);
  
  if (!category) {
    return res.redirect('/');
  }
  
  res.send(generateCategoryHtml(category));
});

app.get('/subcategory/:categoryId/:subcategoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const subcategoryId = parseInt(req.params.subcategoryId);
  
  const category = categoriesData.find(cat => cat.id === categoryId);
  if (!category) {
    return res.redirect('/');
  }
  
  const subcategory = category.subcategories?.find(sub => sub.id === subcategoryId);
  if (!subcategory) {
    return res.redirect(`/category/${categoryId}`);
  }
  
  res.send(generateSubcategoryHtml(category, subcategory));
});

app.get('/feature/:categoryId/:subcategoryId/:featureType/:featureId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const subcategoryId = parseInt(req.params.subcategoryId);
  const featureType = req.params.featureType;
  const featureId = parseInt(req.params.featureId);
  
  const category = categoriesData.find(cat => cat.id === categoryId);
  if (!category) {
    return res.redirect('/');
  }
  
  const subcategory = category.subcategories?.find(sub => sub.id === subcategoryId);
  if (!subcategory) {
    return res.redirect(`/category/${categoryId}`);
  }
  
  const feature = subcategory.features?.find(f => f.id === featureId && f.type === featureType);
  if (!feature) {
    return res.redirect(`/subcategory/${categoryId}/${subcategoryId}`);
  }
  
  res.send(generateFeatureHtml(category, subcategory, feature));
});

app.get('/smart-feature/:name', (req, res) => {
  const featureName = req.params.name;
  res.send(generateSmartFeatureHtml(featureName));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Keeviqo improved server running at http://localhost:${PORT}`);
  console.log(`Total categories loaded: ${categoriesData.length}`);
});

// Default categories if loading fails
function getDefaultCategories() {
  return [
    { id: 1, name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
    { id: 2, name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" },
    { id: 3, name: "חינוך", icon: "school", description: "תעודות, קורסים, והשכלה" },
    { id: 4, name: "נדל\"ן", icon: "home", description: "מסמכי דירה, משכנתא, וחוזי שכירות" },
    { id: 5, name: "משפחה", icon: "family_restroom", description: "מסמכים משפחתיים, אירועים, ותכנון" },
    { id: 6, name: "קריירה", icon: "work", description: "קורות חיים, חוזי עבודה, והמלצות" }
  ];
}

function getFeatureIcon(featureType) {
  switch(featureType) {
    case 'upload': return 'upload_file';
    case 'reminder': return 'notifications';
    case 'external_link': return 'link';
    case 'form': return 'description';
    default: return 'star';
  }
}

function getFeatureDescription(featureType, categoryName, subcategoryName) {
  switch(featureType) {
    case 'upload':
      return `העלאת מסמכים הקשורים ל${subcategoryName} ב${categoryName}`;
    case 'reminder':
      return `הגדרת תזכורות הקשורות ל${subcategoryName} ב${categoryName}`;
    case 'external_link':
      return `קישורים לאתרים חיצוניים הקשורים ל${subcategoryName} ב${categoryName}`;
    case 'form':
      return `מילוי טפסים הקשורים ל${subcategoryName} ב${categoryName}`;
    default:
      return `פעולות הקשורות ל${subcategoryName} ב${categoryName}`;
  }
}

function getFeatureButtonText(featureType) {
  switch(featureType) {
    case 'upload': return 'העלאת מסמכים';
    case 'reminder': return 'הגדרת תזכורות';
    case 'external_link': return 'פתיחת קישורים';
    case 'form': return 'מילוי טפסים';
    default: return 'פתיחה';
  }
}

function getDefaultFeatureButtons(categoryName, subcategoryName) {
  return `
    <button class="feature-button upload" onclick="alert('פיצ\\'ר העלאת מסמכים יהיה זמין בקרוב!')">
      <span class="material-icons">upload_file</span>
      העלאת מסמכים
    </button>
    <button class="feature-button reminder" onclick="alert('פיצ\\'ר תזכורות יהיה זמין בקרוב!')">
      <span class="material-icons">notifications</span>
      תזכורות
    </button>
    <button class="feature-button external_link" onclick="alert('פיצ\\'ר קישורים חיצוניים יהיה זמין בקרוב!')">
      <span class="material-icons">link</span>
      קישורים חיצוניים
    </button>
    <button class="feature-button form" onclick="alert('פיצ\\'ר טפסים יהיה זמין בקרוב!')">
      <span class="material-icons">description</span>
      טפסים
    </button>
  `;
}

function getDefaultSubcategories(categoryName) {
  return `
    <div class="subcategory-card">
      <h3 class="subcategory-title">מסמכים</h3>
      <p class="subcategory-description">ניהול מסמכים הקשורים ל${categoryName}</p>
      <div class="feature-buttons">
        ${getDefaultFeatureButtons(categoryName, 'מסמכים')}
      </div>
    </div>
    <div class="subcategory-card">
      <h3 class="subcategory-title">תזכורות</h3>
      <p class="subcategory-description">ניהול תזכורות הקשורות ל${categoryName}</p>
      <div class="feature-buttons">
        ${getDefaultFeatureButtons(categoryName, 'תזכורות')}
      </div>
    </div>
    <div class="subcategory-card">
      <h3 class="subcategory-title">טפסים</h3>
      <p class="subcategory-description">ניהול טפסים הקשורים ל${categoryName}</p>
      <div class="feature-buttons">
        ${getDefaultFeatureButtons(categoryName, 'טפסים')}
      </div>
    </div>
  `;
}

function generateSubcategoryHtml(category, subcategory) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - ${subcategory.name}</title>
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
      margin-left: 15px;
      cursor: pointer;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .back-button {
      display: inline-flex;
      align-items: center;
      background-color: #f0f0f0;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      margin-bottom: 20px;
      cursor: pointer;
      font-family: 'Rubik', sans-serif;
    }
    
    .back-button .material-icons {
      margin-left: 8px;
    }
    
    .subcategory-header {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .subcategory-title {
      font-size: 24px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 10px;
      color: #1976D2;
      display: flex;
      align-items: center;
    }
    
    .subcategory-title .material-icons {
      margin-left: 10px;
      color: #1976D2;
    }
    
    .subcategory-description {
      font-size: 16px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
    
    .breadcrumbs {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-size: 14px;
      color: #666;
    }
    
    .breadcrumbs .material-icons {
      font-size: 16px;
      margin: 0 5px;
    }
    
    .breadcrumbs a {
      color: #1976D2;
      text-decoration: none;
    }
    
    .breadcrumbs a:hover {
      text-decoration: underline;
    }
    
    .features-section {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .feature-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .feature-icon {
      background-color: #e3f2fd;
      color: #1976D2;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      font-size: 24px;
    }
    
    .feature-icon.upload { background-color: #e3f2fd; color: #1976D2; }
    .feature-icon.reminder { background-color: #e8f5e9; color: #388E3C; }
    .feature-icon.external_link { background-color: #f3e5f5; color: #7B1FA2; }
    .feature-icon.form { background-color: #fff3e0; color: #F57C00; }
    
    .feature-title {
      font-size: 18px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 10px;
      color: #333;
    }
    
    .feature-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
    }
    
    .feature-button {
      display: inline-flex;
      align-items: center;
      background-color: #1976D2;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
      font-family: 'Rubik', sans-serif;
      font-size: 14px;
    }
    
    .feature-button.upload { background-color: #1976D2; }
    .feature-button.reminder { background-color: #388E3C; }
    .feature-button.external_link { background-color: #7B1FA2; }
    .feature-button.form { background-color: #F57C00; }
    
    .feature-button .material-icons {
      margin-left: 5px;
      font-size: 16px;
    }
    
    .smart-features-section {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    
    .section-title .material-icons {
      margin-left: 8px;
      color: #1976D2;
    }
    
    .smart-features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    
    .smart-feature-card {
      background-color: #f5f7fa;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    
    .smart-feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .smart-feature-icon {
      background-color: #e3f2fd;
      color: #1976D2;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px;
      font-size: 24px;
    }
    
    .smart-feature-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .smart-feature-description {
      font-size: 12px;
      color: #666;
    }
    
    .loading-indicator {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #1976D2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading-indicator" id="loadingIndicator">
    <div class="loading-spinner"></div>
  </div>

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
    <div class="breadcrumbs">
      <a href="/" onclick="navigateToHome(); return false;">דאשבורד</a>
      <span class="material-icons">chevron_left</span>
      <a href="/category/${category.id}" onclick="navigateToCategory(${category.id}); return false;">${category.name}</a>
      <span class="material-icons">chevron_left</span>
      <span>${subcategory.name}</span>
    </div>
    
    <div class="subcategory-header">
      <h1 class="subcategory-title">
        <span class="material-icons">${getFeatureIcon(subcategory.features && subcategory.features.length > 0 ? subcategory.features[0].type : 'upload')}</span>
        <span>${subcategory.name}</span>
      </h1>
      <p class="subcategory-description">ניהול ${subcategory.name} הקשורים ל${category.name}</p>
    </div>
    
    <div class="features-section">
      <h2 class="section-title">
        <span class="material-icons">featured_play_list</span>
        <span>פעולות זמינות</span>
      </h2>
      
      <div class="features-grid">
        ${subcategory.features && subcategory.features.length > 0 ? 
          subcategory.features.map(feature => `
            <div class="feature-card" onclick="navigateToFeature('${feature.type}', ${feature.id})">
              <div class="feature-icon ${feature.type}">
                <span class="material-icons">${getFeatureIcon(feature.type)}</span>
              </div>
              <h3 class="feature-title">${feature.label}</h3>
              <p class="feature-description">${getFeatureDescription(feature.type, category.name, subcategory.name)}</p>
              <button class="feature-button ${feature.type}">
                <span class="material-icons">${getFeatureIcon(feature.type)}</span>
                ${getFeatureButtonText(feature.type)}
              </button>
            </div>
          `).join('') : 
          `
          <div class="feature-card" onclick="alert('פיצ\\'ר העלאת מסמכים יהיה זמין בקרוב!')">
            <div class="feature-icon upload">
              <span class="material-icons">upload_file</span>
            </div>
            <h3 class="feature-title">העלאת מסמכים</h3>
            <p class="feature-description">העלאת מסמכים הקשורים ל${subcategory.name} ב${category.name}</p>
            <button class="feature-button upload">
              <span class="material-icons">upload_file</span>
              העלאת מסמכים
            </button>
          </div>
          
          <div class="feature-card" onclick="alert('פיצ\\'ר תזכורות יהיה זמין בקרוב!')">
            <div class="feature-icon reminder">
              <span class="material-icons">notifications</span>
            </div>
            <h3 class="feature-title">תזכורות</h3>
            <p class="feature-description">הגדרת תזכורות הקשורות ל${subcategory.name} ב${category.name}</p>
            <button class="feature-button reminder">
              <span class="material-icons">notifications</span>
              הגדרת תזכורות
            </button>
          </div>
          
          <div class="feature-card" onclick="alert('פיצ\\'ר קישורים חיצוניים יהיה זמין בקרוב!')">
            <div class="feature-icon external_link">
              <span class="material-icons">link</span>
            </div>
            <h3 class="feature-title">קישורים חיצוניים</h3>
            <p class="feature-description">קישורים לאתרים חיצוניים הקשורים ל${subcategory.name} ב${category.name}</p>
            <button class="feature-button external_link">
              <span class="material-icons">link</span>
              פתיחת קישורים
            </button>
          </div>
          
          <div class="feature-card" onclick="alert('פיצ\\'ר טפסים יהיה זמין בקרוב!')">
            <div class="feature-icon form">
              <span class="material-icons">description</span>
            </div>
            <h3 class="feature-title">טפסים</h3>
            <p class="feature-description">מילוי טפסים הקשורים ל${subcategory.name} ב${category.name}</p>
            <button class="feature-button form">
              <span class="material-icons">description</span>
              מילוי טפסים
            </button>
          </div>
          `
        }
      </div>
    </div>
    
    <div class="smart-features-section">
      <h2 class="section-title">
        <span class="material-icons">psychology</span>
        <span>פיצ'רים חכמים</span>
      </h2>
      
      <div class="smart-features-grid">
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviAI')">
          <div class="smart-feature-icon">
            <span class="material-icons">smart_toy</span>
          </div>
          <h3 class="smart-feature-title">KeeviAI</h3>
          <p class="smart-feature-description">עוזר אישי חכם המבוסס על בינה מלאכותית</p>
        </div>
        
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviScan')">
          <div class="smart-feature-icon">
            <span class="material-icons">document_scanner</span>
          </div>
          <h3 class="smart-feature-title">KeeviScan</h3>
          <p class="smart-feature-description">סריקה וזיהוי אוטומטי של מסמכים</p>
        </div>
        
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviRemind')">
          <div class="smart-feature-icon">
            <span class="material-icons">notifications_active</span>
          </div>
          <h3 class="smart-feature-title">KeeviRemind</h3>
          <p class="smart-feature-description">תזכורות חכמות ומותאמות אישית</p>
        </div>
        
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviMap')">
          <div class="smart-feature-icon">
            <span class="material-icons">map</span>
          </div>
          <h3 class="smart-feature-title">KeeviMap</h3>
          <p class="smart-feature-description">מיפוי חכם של המידע האישי שלך</p>
        </div>
        
        <div class="smart-feature-card" onclick="navigateToSmartFeature('KeeviShare')">
          <div class="smart-feature-icon">
            <span class="material-icons">share</span>
          </div>
          <h3 class="smart-feature-title">KeeviShare</h3>
          <p class="smart-feature-description">שיתוף מאובטח של מידע עם אחרים</p>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    function showLoading() {
      document.getElementById('loadingIndicator').style.display = 'flex';
    }
    
    function hideLoading() {
      document.getElementById('loadingIndicator').style.display = 'none';
    }
    
    function navigateToHome() {
      showLoading();
      window.location.href = '/';
    }
    
    function navigateToCategory(categoryId) {
      showLoading();
      window.location.href = '/category/' + categoryId;
    }
    
    function navigateToFeature(featureType, featureId) {
      showLoading();
      window.location.href = '/feature/${category.id}/${subcategory.id}/' + featureType + '/' + featureId;
    }
    
    function navigateToSmartFeature(featureName) {
      showLoading();
      window.location.href = '/smart-feature/' + featureName;
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      hideLoading();
    });
  </script>
</body>
</html>`;
}
