import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
}

console.log('Loading categories from JSON files...');
let categoriesData = [];
try {
  const possibleFiles = [
    'all_categories.json',
    'categories_full_72.json',
    'full_categories.json',
    'categories.json',
    path.join('attachments', '5cfa3a10-0e57-4549-a445-e54f3a31793f', 'categories_full_72.json')
  ];
  
  let loaded = false;
  for (const file of possibleFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`Trying to load categories from ${file}...`);
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
  categoriesData = [
    { id: 1, name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
    { id: 2, name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" },
    { id: 3, name: "חינוך", icon: "school", description: "תעודות, קורסים, והשכלה" },
    { id: 4, name: "נדל\"ן", icon: "home", description: "מסמכי דירה, משכנתא, וחוזי שכירות" },
    { id: 5, name: "משפחה", icon: "family_restroom", description: "מסמכים משפחתיים, אירועים, ותכנון" },
    { id: 6, name: "קריירה", icon: "work", description: "קורות חיים, חוזי עבודה, והמלצות" }
  ];
}

categoriesData = categoriesData.map((category, index) => {
  if (!category.id) {
    category.id = index + 1;
  }
  
  if (!category.icon) {
    category.icon = 'category';
  }
  
  if (!category.description) {
    category.description = `ניהול מידע הקשור ל${category.name}`;
  }
  
  return category;
});

console.log(`Total categories loaded: ${categoriesData.length}`);

app.get('/api/categories', (req, res) => {
  res.json(categoriesData);
});

app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 24; // Show 24 categories per page
  const totalPages = Math.ceil(categoriesData.length / itemsPerPage);
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, categoriesData.length);
  
  const paginatedCategories = categoriesData.slice(startIndex, endIndex);
  
  res.send(createDashboardPage(paginatedCategories, {
    currentPage: page,
    totalPages: totalPages,
    totalCategories: categoriesData.length
  }));
});

app.get('/category/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categoriesData.find(c => c.id === categoryId);
  
  if (!category) {
    return res.redirect('/dashboard');
  }
  
  res.send(createCategoryPage(category));
});

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`Keeviqo all categories server running at http://localhost:${PORT}`);
});

function createDashboardPage(categories, pagination) {
  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - Dashboard</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      direction: rtl;
    }
    .header {
      background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .welcome-card {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    .category-card {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px;
      transition: transform 0.2s;
      cursor: pointer;
    }
    .category-card:hover {
      transform: translateY(-5px);
    }
    .category-icon {
      background-color: #e3f2fd;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
    }
    .category-icon span {
      font-size: 24px;
      color: #1976D2;
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      gap: 10px;
    }
    .pagination-button {
      background-color: #1976D2;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
    }
    .pagination-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .search-container {
      margin-bottom: 20px;
    }
    .search-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
  </style>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <div class="header">
    <h1>Keeviqo</h1>
    <div>שלום, מנהל</div>
  </div>
  
  <div class="container">
    <div class="welcome-card">
      <h2>ברוכים הבאים למערכת Keeviqo</h2>
      <p>המערכת החכמה לניהול מידע אישי. בחר קטגוריה להתחלה.</p>
    </div>
    
    <div class="search-container">
      <input type="text" id="categorySearch" class="search-input" placeholder="חיפוש קטגוריה..." oninput="filterCategories()">
    </div>
    
    <h2>הקטגוריות שלי (${pagination.totalCategories})</h2>
    <div class="categories-grid" id="categoriesGrid">
      ${categories.map(category => `
        <div class="category-card" data-category-name="${category.name}" onclick="window.location.href='/category/${category.id}'">
          <div class="category-icon">
            <span class="material-icons">${category.icon || 'category'}</span>
          </div>
          <h3>${category.name}</h3>
          <p>${category.description || ''}</p>
        </div>
      `).join('')}
    </div>
    
    <div class="pagination">
      <button id="prevPage" class="pagination-button" onclick="changePage(-1)" ${pagination.currentPage === 1 ? 'disabled' : ''}>
        הקודם
      </button>
      <span>עמוד ${pagination.currentPage} מתוך ${pagination.totalPages}</span>
      <button id="nextPage" class="pagination-button" onclick="changePage(1)" ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}>
        הבא
      </button>
    </div>
  </div>

  <script>
    function changePage(direction) {
      const newPage = ${pagination.currentPage} + direction;
      if (newPage >= 1 && newPage <= ${pagination.totalPages}) {
        window.location.href = '/dashboard?page=' + newPage;
      }
    }
    
    function filterCategories() {
      const searchTerm = document.getElementById('categorySearch').value.toLowerCase();
      const categoryCards = document.querySelectorAll('.category-card');
      
      categoryCards.forEach(card => {
        const categoryName = card.getAttribute('data-category-name').toLowerCase();
        const categoryDescription = card.querySelector('p').textContent.toLowerCase();
        
        if (categoryName.includes(searchTerm) || categoryDescription.includes(searchTerm)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>
  `;
}

function createCategoryPage(category) {
  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - ${category.name}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      direction: rtl;
    }
    .header {
      background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
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
    }
    .back-button .material-icons {
      margin-left: 8px;
    }
    .category-header {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    .category-icon {
      background-color: #e3f2fd;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
    }
    .category-icon span {
      font-size: 30px;
      color: #1976D2;
    }
    .category-details {
      flex: 1;
    }
    .subcategories {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .subcategory-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }
    .feature-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .feature-button {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
    }
    .upload { background-color: #1976D2; }
    .reminder { background-color: #388E3C; }
    .external_link { background-color: #7B1FA2; }
    .form { background-color: #F57C00; }
  </style>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <div class="header">
    <h1>Keeviqo</h1>
    <div>שלום, מנהל</div>
  </div>
  
  <div class="container">
    <button class="back-button" onclick="window.location.href='/dashboard'">
      <span class="material-icons">arrow_back</span>
      חזרה לדאשבורד
    </button>
    
    <div class="category-header">
      <div class="category-icon">
        <span class="material-icons">${category.icon || 'category'}</span>
      </div>
      <div class="category-details">
        <h1>${category.name}</h1>
        <p>${category.description || ''}</p>
      </div>
    </div>
    
    <div class="subcategories">
      <h2>תתי-קטגוריות ופיצ'רים</h2>
      
      <div class="subcategory-card">
        <h3>העלאת מסמכים</h3>
        <p>העלאת מסמכים וקבצים הקשורים ל${category.name}</p>
        <div class="feature-buttons">
          <button class="feature-button upload">
            העלאת מסמך חדש
          </button>
          <button class="feature-button upload">
            צפייה במסמכים קיימים
          </button>
        </div>
      </div>
      
      <div class="subcategory-card">
        <h3>תזכורות</h3>
        <p>הגדרת תזכורות ומעקב אחר מועדים חשובים</p>
        <div class="feature-buttons">
          <button class="feature-button reminder">
            הוספת תזכורת חדשה
          </button>
          <button class="feature-button reminder">
            צפייה בתזכורות קיימות
          </button>
        </div>
      </div>
      
      <div class="subcategory-card">
        <h3>קישורים חיצוניים</h3>
        <p>קישורים לאתרים ושירותים חיצוניים רלוונטיים</p>
        <div class="feature-buttons">
          <button class="feature-button external_link">
            אתרים ממשלתיים
          </button>
          <button class="feature-button external_link">
            שירותים מקוונים
          </button>
        </div>
      </div>
      
      <div class="subcategory-card">
        <h3>טפסים</h3>
        <p>מילוי טפסים ושמירת מידע מובנה</p>
        <div class="feature-buttons">
          <button class="feature-button form">
            מילוי טופס חדש
          </button>
          <button class="feature-button form">
            צפייה בטפסים שמולאו
          </button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
