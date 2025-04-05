import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let generateSmartFeatureHtml;
try {
  const { generateSmartFeatureHtml: importedFunction } = await import('./generateSmartFeatureHtml.js');
  generateSmartFeatureHtml = importedFunction;
} catch (error) {
  console.log('Smart feature HTML generator not found, using fallback');
  generateSmartFeatureHtml = (featureName) => {
    return `<h1>Smart Feature: ${featureName}</h1><p>This is a placeholder for the ${featureName} feature.</p>`;
  };
}

const app = express();
const PORT = 3002;

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
  categoriesData = [];
}

app.get('*', (req, res) => {
  if (req.path.startsWith('/feature/')) {
    const featureName = req.path.split('/')[2];
    res.send(generateSmartFeatureHtml(featureName));
    return;
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  res.send(generateDashboardHtml(page, limit));
});

app.listen(PORT, () => {
  console.log(`Keeviqo direct dashboard server running at http://localhost:${PORT}`);
  console.log(`Total categories loaded: ${categoriesData.length}`);
});

function generateDashboardHtml(page, limit) {
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
      font-weight: 700;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
    }
    
    .user-menu .material-icons {
      margin-left: 5px;
    }
    
    .page-title {
      margin-bottom: 30px;
      color: #1976D2;
      font-size: 28px;
      font-weight: 700;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .category-card {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .category-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
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
      margin-left: 15px;
    }
    
    .category-name {
      font-size: 18px;
      font-weight: 700;
      color: #1976D2;
      margin: 0;
    }
    
    .category-description {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.5;
    }
    
    .smart-features {
      font-size: 14px;
      color: #1976D2;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
    
    .pagination-button {
      background-color: white;
      border: 1px solid #ddd;
      padding: 8px 15px;
      margin: 0 5px;
      border-radius: 5px;
      cursor: pointer;
      color: #1976D2;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }
    
    .pagination-button:hover {
      background-color: #e3f2fd;
    }
    
    .pagination-button.active {
      background-color: #1976D2;
      color: white;
      border-color: #1976D2;
    }
    
    .pagination-button.disabled {
      color: #ccc;
      cursor: not-allowed;
    }
    
    .smart-features-bar {
      display: flex;
      justify-content: center;
      background-color: #e3f2fd;
      padding: 15px 0;
      margin-bottom: 30px;
      border-radius: 10px;
    }
    
    .smart-feature-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 15px;
      color: #1976D2;
      text-decoration: none;
      transition: transform 0.3s ease;
    }
    
    .smart-feature-button:hover {
      transform: translateY(-3px);
    }
    
    .smart-feature-icon {
      background-color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .smart-feature-name {
      font-size: 14px;
      font-weight: 500;
    }
    
    footer {
      background-color: #1976D2;
      color: white;
      padding: 20px 0;
      margin-top: 50px;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .footer-links a {
      color: white;
      margin-left: 15px;
      text-decoration: none;
    }
    
    .search-bar {
      display: flex;
      margin-bottom: 30px;
    }
    
    .search-input {
      flex: 1;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 5px 0 0 5px;
      font-family: 'Rubik', sans-serif;
      font-size: 16px;
    }
    
    .search-button {
      background-color: #1976D2;
      color: white;
      border: none;
      padding: 0 20px;
      border-radius: 0 5px 5px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <div class="logo">Keeviqo</div>
      <div class="user-menu">
        <span class="material-icons">account_circle</span>
        שלום, משתמש
      </div>
    </div>
  </header>
  
  <div class="container">
    <h1 class="page-title">לוח הבקרה שלי</h1>
    
    <div class="smart-features-bar">
      <a href="/feature/KeeviAI" class="smart-feature-button">
        <div class="smart-feature-icon">
          <span class="material-icons">psychology</span>
        </div>
        <span class="smart-feature-name">KeeviAI</span>
      </a>
      <a href="/feature/KeeviScan" class="smart-feature-button">
        <div class="smart-feature-icon">
          <span class="material-icons">document_scanner</span>
        </div>
        <span class="smart-feature-name">KeeviScan</span>
      </a>
      <a href="/feature/KeeviRemind" class="smart-feature-button">
        <div class="smart-feature-icon">
          <span class="material-icons">notifications</span>
        </div>
        <span class="smart-feature-name">KeeviRemind</span>
      </a>
      <a href="/feature/KeeviMap" class="smart-feature-button">
        <div class="smart-feature-icon">
          <span class="material-icons">map</span>
        </div>
        <span class="smart-feature-name">KeeviMap</span>
      </a>
      <a href="/feature/KeeviShare" class="smart-feature-button">
        <div class="smart-feature-icon">
          <span class="material-icons">share</span>
        </div>
        <span class="smart-feature-name">KeeviShare</span>
      </a>
    </div>
    
    <div class="search-bar">
      <input type="text" class="search-input" placeholder="חיפוש קטגוריות, מסמכים, תזכורות...">
      <button class="search-button">
        <span class="material-icons">search</span>
      </button>
    </div>
    
    <div class="categories-grid">
      ${paginatedCategories.map(category => `
        <div class="category-card" onclick="window.location.href='/category/${category.id}'">
          <div class="category-header">
            <div class="category-icon">
              <span class="material-icons">${category.icon || 'folder'}</span>
            </div>
            <h2 class="category-name">${category.name}</h2>
          </div>
          <p class="category-description">${category.description || 'אין תיאור'}</p>
          <div class="smart-features">
            <strong>פיצ'רים חכמים:</strong> ${category.smartFeatures || 'אין פיצ\'רים חכמים'}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="pagination">
      ${generatePaginationButtons(page, totalPages, limit)}
    </div>
  </div>
  
  <footer>
    <div class="footer-content">
      <div>© Keeviqo 2025. כל הזכויות שמורות.</div>
      <div class="footer-links">
        <a href="/about">אודות</a>
        <a href="/contact">צור קשר</a>
        <a href="/terms">תנאי שימוש</a>
        <a href="/privacy">מדיניות פרטיות</a>
      </div>
    </div>
  </footer>
  
  <script>
    document.querySelectorAll('.pagination-button').forEach(button => {
      if (!button.classList.contains('disabled')) {
        button.addEventListener('click', function() {
          const page = this.getAttribute('data-page');
          const limit = this.getAttribute('data-limit');
          if (page && limit) {
            window.location.href = '/?page=' + page + '&limit=' + limit;
          }
        });
      }
    });
  </script>
</body>
</html>`;
}

function generatePaginationButtons(currentPage, totalPages, limit) {
  let buttons = '';
  
  if (currentPage > 1) {
    buttons += `<button class="pagination-button" data-page="1" data-limit="${limit}">ראשון</button>`;
  } else {
    buttons += `<button class="pagination-button disabled">ראשון</button>`;
  }
  
  if (currentPage > 1) {
    buttons += `<button class="pagination-button" data-page="${currentPage - 1}" data-limit="${limit}">הקודם</button>`;
  } else {
    buttons += `<button class="pagination-button disabled">הקודם</button>`;
  }
  
  buttons += `<button class="pagination-button active">עמוד ${currentPage} מתוך ${totalPages}</button>`;
  
  if (currentPage < totalPages) {
    buttons += `<button class="pagination-button" data-page="${currentPage + 1}" data-limit="${limit}">הבא</button>`;
  } else {
    buttons += `<button class="pagination-button disabled">הבא</button>`;
  }
  
  if (currentPage < totalPages) {
    buttons += `<button class="pagination-button" data-page="${totalPages}" data-limit="${limit}">אחרון</button>`;
  } else {
    buttons += `<button class="pagination-button disabled">אחרון</button>`;
  }
  
  return buttons;
}
