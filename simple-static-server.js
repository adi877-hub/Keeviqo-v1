import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import session from 'express-session';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

app.use(session({
  secret: 'keeviqo-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let categoriesData = [];
try {
  const filePath = path.join(__dirname, 'categories_full_72.json');
  if (fs.existsSync(filePath)) {
    console.log(`Loading categories from categories_full_72.json...`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    
    if (parsedData.categories && Array.isArray(parsedData.categories)) {
      categoriesData = parsedData.categories;
    } else if (Array.isArray(parsedData)) {
      categoriesData = parsedData;
    }
    
    console.log(`Successfully loaded ${categoriesData.length} categories`);
  }
} catch (error) {
  console.error('Error loading categories:', error);
  categoriesData = [
    { id: 1, name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
    { id: 2, name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" }
  ];
}

const authenticate = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  }
  
  if (req.path === '/login' || req.path === '/auth') {
    return next();
  }
  
  res.redirect('/login');
};

app.use(authenticate);

app.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - התחברות</title>
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
    
    .login-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .login-logo {
      font-size: 24px;
      font-weight: bold;
      color: #1976D2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .login-logo .material-icons {
      margin-left: 10px;
      font-size: 32px;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      font-family: 'Rubik', sans-serif;
    }
    
    .login-button {
      background-color: #1976D2;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      font-family: 'Rubik', sans-serif;
      transition: background-color 0.2s;
    }
    
    .login-button:hover {
      background-color: #1565C0;
    }
    
    .error-message {
      color: #f44336;
      margin-bottom: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-header">
      <div class="login-logo">
        <span class="material-icons">dashboard</span>
        <span>Keeviqo</span>
      </div>
      <p>מערכת לניהול מידע אישי</p>
    </div>
    
    ${req.query.error ? '<div class="error-message">שם משתמש או סיסמה שגויים</div>' : ''}
    
    <form class="login-form" action="/auth" method="post">
      <div class="form-group">
        <label for="username">שם משתמש</label>
        <input type="text" id="username" name="username" required>
      </div>
      
      <div class="form-group">
        <label for="password">סיסמה</label>
        <input type="password" id="password" name="password" required>
      </div>
      
      <button type="submit" class="login-button">התחברות</button>
    </form>
  </div>
</body>
</html>`);
});

app.post('/auth', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'Keeviqo2023!') {
    req.session.authenticated = true;
    req.session.username = username;
    res.redirect('/');
  } else {
    res.redirect('/login?error=1');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
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
    
    .user-name {
      margin-left: 10px;
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
        <span class="user-name">${req.session.username || 'משתמש'}</span>
        <a href="/logout" style="color: white; text-decoration: none; display: flex; align-items: center;">
          <span class="material-icons">exit_to_app</span>
        </a>
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
      <a href="#" class="smart-tool">
        <span class="material-icons">psychology</span>
        <span>KeeviAI</span>
      </a>
      <a href="#" class="smart-tool">
        <span class="material-icons">document_scanner</span>
        <span>KeeviScan</span>
      </a>
      <a href="#" class="smart-tool">
        <span class="material-icons">notifications_active</span>
        <span>KeeviRemind</span>
      </a>
      <a href="#" class="smart-tool">
        <span class="material-icons">map</span>
        <span>KeeviMap</span>
      </a>
      <a href="#" class="smart-tool">
        <span class="material-icons">share</span>
        <span>KeeviShare</span>
      </a>
    </div>
    
    <h2>הקטגוריות שלי</h2>
    
    <div class="categories-grid" id="categoriesGrid">
      ${categoriesData.map(category => `
        <div class="category-card" data-category-id="${category.id}">
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
      <button class="pagination-button active">1</button>
      <button class="pagination-button">2</button>
      <button class="pagination-button">3</button>
      <button class="pagination-button">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
  </div>
  
  <script>
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
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Keeviqo server running at http://localhost:${PORT}`);
});
