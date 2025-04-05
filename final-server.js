import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

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

// Generate HTML for the dashboard page
function generateDashboardHtml() {
  return `<!DOCTYPE html>
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
      margin-left: 15px;
      cursor: pointer;
    }
    
    .search-bar {
      display: flex;
      margin: 20px 0;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    
    .search-input {
      flex-grow: 1;
      border: none;
      padding: 12px 15px;
      font-size: 16px;
      font-family: 'Rubik', sans-serif;
    }
    
    .search-button {
      background-color: #1976D2;
      color: white;
      border: none;
      padding: 0 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
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
      text-decoration: none;
    }
    
    .smart-tool .material-icons {
      margin-left: 5px;
      font-size: 18px;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
    
    .pagination-button {
      background-color: #e3f2fd;
      color: #1976D2;
      border: none;
      padding: 8px 15px;
      margin: 0 5px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .pagination-button.active {
      background-color: #1976D2;
      color: white;
    }
    
    .back-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #1976D2;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
      z-index: 100;
      text-decoration: none;
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
    <div class="search-bar">
      <input type="text" class="search-input" id="categorySearch" placeholder="חיפוש קטגוריה...">
      <button class="search-button">
        <span class="material-icons">search</span>
      </button>
    </div>
    
    <div class="smart-tools">
      <a href="/smart-feature/KeeviAI" class="smart-tool">
        <span class="material-icons">psychology</span>
        <span>KeeviAI</span>
      </a>
      <a href="/smart-feature/KeeviScan" class="smart-tool">
        <span class="material-icons">document_scanner</span>
        <span>KeeviScan</span>
      </a>
      <a href="/smart-feature/KeeviRemind" class="smart-tool">
        <span class="material-icons">notifications_active</span>
        <span>KeeviRemind</span>
      </a>
      <a href="/smart-feature/KeeviMap" class="smart-tool">
        <span class="material-icons">map</span>
        <span>KeeviMap</span>
      </a>
      <a href="/smart-feature/KeeviShare" class="smart-tool">
        <span class="material-icons">share</span>
        <span>KeeviShare</span>
      </a>
    </div>
    
    <h2>הקטגוריות שלי</h2>
    
    <div class="categories-grid" id="categoriesGrid">
      ${categoriesData.map(category => `
        <div class="category-card" data-category-id="${category.id}" onclick="navigateToCategory(${category.id})">
          <div class="category-header">
            <div class="category-icon">
              <span class="material-icons">${category.icon || 'folder'}</span>
            </div>
            <h3 class="category-title">${category.name}</h3>
          </div>
          <p class="category-description">${category.description || 'קטגוריה לניהול מידע אישי'}</p>
          <div class="smart-features">
            <strong>פיצ'רים חכמים:</strong> ${category.smartFeatures || 'תזכורות, סריקה, טפסים חכמים'}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="pagination">
      <button class="pagination-button active" data-page="1">1</button>
      <button class="pagination-button" data-page="2">2</button>
      <button class="pagination-button" data-page="3">3</button>
      <button class="pagination-button">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
  </div>
  
  <script>
    // Show loading indicator
    function showLoading() {
      document.getElementById('loadingIndicator').style.display = 'flex';
    }
    
    // Hide loading indicator
    function hideLoading() {
      document.getElementById('loadingIndicator').style.display = 'none';
    }
    
    // Navigate to category with loading indicator
    function navigateToCategory(categoryId) {
      showLoading();
      window.location.href = '/category/' + categoryId;
    }
    
    // Search functionality
    document.getElementById('categorySearch').addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const categoryCards = document.querySelectorAll('.category-card');
      
      categoryCards.forEach(card => {
        const title = card.querySelector('.category-title').textContent.toLowerCase();
        const description = card.querySelector('.category-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
    
    // Pagination functionality
    const itemsPerPage = 12;
    const categoryCards = document.querySelectorAll('.category-card');
    const totalPages = Math.ceil(categoryCards.length / itemsPerPage);
    
    function showPage(pageNumber) {
      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      categoryCards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
    
    // Initialize pagination
    showPage(1);
    
    // Add event listeners to pagination buttons
    document.querySelectorAll('.pagination-button').forEach(button => {
      if (button.dataset.page) {
        button.addEventListener('click', function() {
          document.querySelectorAll('.pagination-button').forEach(btn => {
            btn.classList.remove('active');
          });
          this.classList.add('active');
          showPage(parseInt(this.dataset.page));
        });
      }
    });
    
    // Hide loading indicator when page is fully loaded
    window.addEventListener('load', hideLoading);
  </script>
</body>
</html>`;
}

// Generate HTML for the category page
function generateCategoryHtml(category) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - ${category.name}</title>
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
      margin-left: 15px;
      cursor: pointer;
    }
    
    .category-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .category-icon {
      background-color: #e3f2fd;
      color: #1976D2;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
      font-size: 30px;
    }
    
    .category-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
    }
    
    .category-description {
      font-size: 16px;
      color: #666;
      margin-bottom: 30px;
    }
    
    .category-features {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .feature-title {
      font-size: 18px;
      font-weight: 500;
      margin-top: 0;
      margin-bottom: 15px;
      color: #1976D2;
    }
    
    .feature-content {
      font-size: 15px;
      color: #555;
    }
    
    .subcategories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .subcategory-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    
    .subcategory-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .subcategory-title {
      font-size: 18px;
      font-weight: 500;
      margin-top: 0;
      margin-bottom: 15px;
      color: #333;
    }
    
    .feature-tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 15px;
    }
    
    .feature-tag {
      padding: 5px 10px;
      margin: 0 5px 5px 0;
      border-radius: 15px;
      font-size: 12px;
      color: white;
    }
    
    .feature-tag.upload {
      background-color: #1976D2;
    }
    
    .feature-tag.reminder {
      background-color: #388E3C;
    }
    
    .feature-tag.external_link {
      background-color: #7B1FA2;
    }
    
    .feature-tag.form {
      background-color: #F57C00;
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
      text-decoration: none;
    }
    
    .smart-tool .material-icons {
      margin-left: 5px;
      font-size: 18px;
    }
    
    .back-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #1976D2;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
      z-index: 100;
      text-decoration: none;
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
    <a href="/" class="back-button">
      <span class="material-icons">arrow_back</span>
    </a>
    
    <div class="category-header">
      <div class="category-icon">
        <span class="material-icons">${category.icon || 'folder'}</span>
      </div>
      <h1 class="category-title">${category.name}</h1>
    </div>
    
    <p class="category-description">${category.description || 'קטגוריה לניהול מידע אישי'}</p>
    
    <div class="smart-tools">
      <a href="/smart-feature/KeeviAI?category=${category.id}" class="smart-tool">
        <span class="material-icons">psychology</span>
        <span>KeeviAI</span>
      </a>
      <a href="/smart-feature/KeeviScan?category=${category.id}" class="smart-tool">
        <span class="material-icons">document_scanner</span>
        <span>KeeviScan</span>
      </a>
      <a href="/smart-feature/KeeviRemind?category=${category.id}" class="smart-tool">
        <span class="material-icons">notifications_active</span>
        <span>KeeviRemind</span>
      </a>
      <a href="/smart-feature/KeeviMap?category=${category.id}" class="smart-tool">
        <span class="material-icons">map</span>
        <span>KeeviMap</span>
      </a>
      <a href="/smart-feature/KeeviShare?category=${category.id}" class="smart-tool">
        <span class="material-icons">share</span>
        <span>KeeviShare</span>
      </a>
    </div>
    
    <div class="category-features">
      <h2 class="feature-title">פיצ'רים חכמים</h2>
      <p class="feature-content">${category.smartFeatures || 'תזכורות, סריקה, טפסים חכמים'}</p>
    </div>
    
    <div class="category-features">
      <h2 class="feature-title">כולל</h2>
      <p class="feature-content">${category.includes || 'מסמכים, תזכורות, טפסים, וקישורים חיצוניים'}</p>
    </div>
    
    <h2>תתי-קטגוריות</h2>
    
    <div class="subcategories-grid">
      ${(category.subcategories || []).map(subcategory => `
        <div class="subcategory-card" onclick="navigateToSubcategory(${category.id}, ${subcategory.id})">
          <h3 class="subcategory-title">${subcategory.name}</h3>
          <div class="feature-tags">
            ${(subcategory.features || []).map(feature => `
              <span class="feature-tag ${feature.type}">${feature.label}</span>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  
  <script>
    // Show loading indicator
    function showLoading() {
      document.getElementById('loadingIndicator').style.display = 'flex';
    }
    
    // Hide loading indicator
    function hideLoading() {
      document.getElementById('loadingIndicator').style.display = 'none';
    }
    
    // Navigate to subcategory with loading indicator
    function navigateToSubcategory(categoryId, subcategoryId) {
      showLoading();
      window.location.href = '/subcategory/' + categoryId + '/' + subcategoryId;
    }
    
    // Hide loading indicator when page is fully loaded
    window.addEventListener('load', hideLoading);
  </script>
</body>
</html>`;
}
