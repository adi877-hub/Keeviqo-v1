import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

let categoriesData = [];
try {
  const filePath = path.join(__dirname, 'categories_full_72.json');
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    
    if (parsedData.categories && Array.isArray(parsedData.categories)) {
      categoriesData = parsedData.categories;
    } else if (Array.isArray(parsedData)) {
      categoriesData = parsedData;
    }
    
    console.log(`Loaded ${categoriesData.length} categories`);
  } else {
    throw new Error('Categories file not found');
  }
} catch (error) {
  console.error('Error loading categories:', error);
  categoriesData = [
    { id: 1, name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
    { id: 2, name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" },
    { id: 3, name: "חינוך", icon: "school", description: "תעודות, קורסים, והשכלה" }
  ];
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/categories', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedCategories = categoriesData.slice(startIndex, endIndex);
  
  res.json({
    total: categoriesData.length,
    page,
    limit,
    categories: paginatedCategories
  });
});

app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo Dashboard</title>
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
    
    <div id="categories-container" class="categories-grid">
      <!-- Categories will be loaded here -->
    </div>
    
    <div id="pagination" class="pagination">
      <!-- Pagination will be loaded here -->
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
    document.addEventListener('DOMContentLoaded', () => {
      loadCategories(1, 12);
    });
    
    function loadCategories(page, limit) {
      fetch(\`/api/categories?page=\${page}&limit=\${limit}\`)
        .then(response => response.json())
        .then(data => {
          displayCategories(data.categories);
          displayPagination(data.page, Math.ceil(data.total / data.limit), data.limit);
        })
        .catch(error => {
          console.error('Error loading categories:', error);
          document.getElementById('categories-container').innerHTML = '<p>שגיאה בטעינת הקטגוריות. אנא נסה שוב מאוחר יותר.</p>';
        });
    }
    
    function displayCategories(categories) {
      const container = document.getElementById('categories-container');
      container.innerHTML = '';
      
      categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => window.location.href = \`/category/\${category.id}\`;
        
        card.innerHTML = \`
          <div class="category-header">
            <div class="category-icon">
              <span class="material-icons">\${category.icon || 'folder'}</span>
            </div>
            <h2 class="category-name">\${category.name}</h2>
          </div>
          <p class="category-description">\${category.description || 'אין תיאור'}</p>
          <div class="smart-features">
            <strong>פיצ'רים חכמים:</strong> \${category.smartFeatures || 'אין פיצ\'רים חכמים'}
          </div>
        \`;
        
        container.appendChild(card);
      });
    }
    
    function displayPagination(currentPage, totalPages, limit) {
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';
      
      const firstButton = document.createElement('button');
      firstButton.className = currentPage > 1 ? 'pagination-button' : 'pagination-button disabled';
      firstButton.textContent = 'ראשון';
      if (currentPage > 1) {
        firstButton.onclick = () => loadCategories(1, limit);
      }
      pagination.appendChild(firstButton);
      
      const prevButton = document.createElement('button');
      prevButton.className = currentPage > 1 ? 'pagination-button' : 'pagination-button disabled';
      prevButton.textContent = 'הקודם';
      if (currentPage > 1) {
        prevButton.onclick = () => loadCategories(currentPage - 1, limit);
      }
      pagination.appendChild(prevButton);
      
      const currentButton = document.createElement('button');
      currentButton.className = 'pagination-button active';
      currentButton.textContent = \`עמוד \${currentPage} מתוך \${totalPages}\`;
      pagination.appendChild(currentButton);
      
      const nextButton = document.createElement('button');
      nextButton.className = currentPage < totalPages ? 'pagination-button' : 'pagination-button disabled';
      nextButton.textContent = 'הבא';
      if (currentPage < totalPages) {
        nextButton.onclick = () => loadCategories(currentPage + 1, limit);
      }
      pagination.appendChild(nextButton);
      
      const lastButton = document.createElement('button');
      lastButton.className = currentPage < totalPages ? 'pagination-button' : 'pagination-button disabled';
      lastButton.textContent = 'אחרון';
      if (currentPage < totalPages) {
        lastButton.onclick = () => loadCategories(totalPages, limit);
      }
      pagination.appendChild(lastButton);
    }
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`Simple dashboard server running at http://localhost:${PORT}`);
});
