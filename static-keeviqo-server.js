import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

let categoriesData = [];
try {
  const categoriesPath = path.join(__dirname, 'categories_full_72.json');
  if (fs.existsSync(categoriesPath)) {
    const rawData = fs.readFileSync(categoriesPath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    
    if (parsedData.categories && Array.isArray(parsedData.categories)) {
      categoriesData = parsedData.categories;
    } else if (Array.isArray(parsedData)) {
      categoriesData = parsedData;
    }
    
    console.log(`Loaded ${categoriesData.length} categories from categories_full_72.json`);
  } else {
    throw new Error('Categories file not found');
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/categories', (req, res) => {
  res.json(categoriesData);
});

app.post('/api/login', (req, res) => {
  res.json({ success: true, token: 'demo-token-12345' });
});

function generateDashboardHtml() {
  const categoryCards = categoriesData.map(category => `
    <div class="category-card" onclick="location.href='/category/${category.id}'">
      <div class="category-header">
        <span class="material-icons">${category.icon}</span>
        <h2>${category.name}</h2>
      </div>
      <p>${category.description || ''}</p>
    </div>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keeviqo - Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
      body {
        font-family: 'Rubik', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        direction: rtl;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      header {
        background-color: #1976D2;
        color: white;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
      }
      .user-info {
        display: flex;
        align-items: center;
      }
      .user-info .material-icons {
        margin-left: 5px;
      }
      .search-bar {
        margin: 20px 0;
        display: flex;
      }
      .search-bar input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .search-bar button {
        background-color: #1976D2;
        color: white;
        border: none;
        padding: 10px 15px;
        margin-right: 10px;
        border-radius: 4px;
        cursor: pointer;
      }
      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      .category-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 20px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      .category-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .category-header .material-icons {
        margin-left: 10px;
        color: #1976D2;
        font-size: 28px;
      }
      .category-header h2 {
        margin: 0;
        font-size: 18px;
      }
      .category-card p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
      .smart-features {
        margin-top: 30px;
      }
      .smart-features h2 {
        margin-bottom: 15px;
        color: #333;
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
      }
      .feature-card {
        background-color: #e3f2fd;
        border-radius: 8px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .feature-card .material-icons {
        font-size: 36px;
        color: #1976D2;
        margin-bottom: 10px;
      }
      .feature-card h3 {
        margin: 0 0 5px 0;
        font-size: 16px;
      }
      .feature-card p {
        margin: 0;
        font-size: 12px;
        color: #666;
      }
      .pagination {
        display: flex;
        justify-content: center;
        margin-top: 30px;
      }
      .pagination button {
        background-color: white;
        border: 1px solid #ddd;
        padding: 8px 12px;
        margin: 0 5px;
        cursor: pointer;
        border-radius: 4px;
      }
      .pagination button.active {
        background-color: #1976D2;
        color: white;
        border-color: #1976D2;
      }
      footer {
        margin-top: 50px;
        background-color: #f0f0f0;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      @media (max-width: 768px) {
        .categories-grid {
          grid-template-columns: 1fr;
        }
        .features-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="logo">Keeviqo</div>
      <div class="user-info">
        <span>שלום, אדמין</span>
        <span class="material-icons">account_circle</span>
      </div>
    </header>
    
    <div class="container">
      <div class="search-bar">
        <input type="text" placeholder="חיפוש קטגוריות, מסמכים, או תזכורות...">
        <button><span class="material-icons">search</span></button>
      </div>
      
      <h1>הקטגוריות שלי</h1>
      
      <div class="categories-grid">
        ${categoryCards}
      </div>
      
      <div class="smart-features">
        <h2>פיצ'רים חכמים</h2>
        <div class="features-grid">
          <div class="feature-card">
            <span class="material-icons">psychology</span>
            <h3>KeeviAI</h3>
            <p>עוזר אישי חכם המזהה את הכוונות שלך</p>
          </div>
          <div class="feature-card">
            <span class="material-icons">document_scanner</span>
            <h3>KeeviScan</h3>
            <p>סריקה וניתוח מסמכים אוטומטי</p>
          </div>
          <div class="feature-card">
            <span class="material-icons">notifications</span>
            <h3>KeeviRemind</h3>
            <p>תזכורות חכמות מותאמות אישית</p>
          </div>
          <div class="feature-card">
            <span class="material-icons">map</span>
            <h3>KeeviMap</h3>
            <p>מפת חיים אינטראקטיבית</p>
          </div>
          <div class="feature-card">
            <span class="material-icons">share</span>
            <h3>KeeviShare</h3>
            <p>שיתוף מאובטח של מידע נבחר</p>
          </div>
        </div>
      </div>
      
      <div class="pagination">
        <button class="active">1</button>
        <button>2</button>
        <button>3</button>
        <button><span class="material-icons">chevron_right</span></button>
      </div>
    </div>
    
    <footer>
      <p>© 2023 Keeviqo - כל הזכויות שמורות</p>
    </footer>
    
    <script>
      document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
          const categoryId = this.getAttribute('data-id');
          if (categoryId) {
            window.location.href = '/category/' + categoryId;
          }
        });
      });
    </script>
  </body>
  </html>
  `;
}

function generateCategoryHtml(categoryId) {
  const category = categoriesData.find(c => c.id === parseInt(categoryId));
  
  if (!category) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Category Not Found</title>
      </head>
      <body>
        <h1>Category not found</h1>
        <a href="/">Back to Dashboard</a>
      </body>
      </html>
    `;
  }
  
  const subcategoriesHtml = (category.subcategories || []).map(subcategory => `
    <div class="subcategory-card" onclick="location.href='/subcategory/${subcategory.id}'">
      <h3>${subcategory.name}</h3>
      <div class="features-list">
        ${(subcategory.features || []).map(feature => `
          <span class="feature-tag feature-${feature.type}">${feature.label}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  return `
  <!DOCTYPE html>
  <html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keeviqo - ${category.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
      body {
        font-family: 'Rubik', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        direction: rtl;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      header {
        background-color: #1976D2;
        color: white;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
      }
      .back-button {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: #1976D2;
        color: white;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 5px rgba(0,0,0,0.2);
        cursor: pointer;
        z-index: 100;
      }
      .category-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      .category-header .material-icons {
        font-size: 36px;
        margin-left: 15px;
        color: #1976D2;
      }
      .category-header h1 {
        margin: 0;
      }
      .category-description {
        margin-bottom: 30px;
        color: #666;
      }
      .subcategories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      .subcategory-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 20px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .subcategory-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      .subcategory-card h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #333;
      }
      .features-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .feature-tag {
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        color: white;
      }
      .feature-upload { background-color: #1976D2; }
      .feature-reminder { background-color: #388E3C; }
      .feature-external_link { background-color: #7B1FA2; }
      .feature-form { background-color: #F57C00; }
      .smart-features-section {
        margin-top: 40px;
        background-color: #e3f2fd;
        padding: 20px;
        border-radius: 8px;
      }
      .smart-features-section h2 {
        margin-top: 0;
        color: #1976D2;
      }
      footer {
        margin-top: 50px;
        background-color: #f0f0f0;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      @media (max-width: 768px) {
        .subcategories-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="logo">Keeviqo</div>
    </header>
    
    <div class="container">
      <div class="category-header">
        <span class="material-icons">${category.icon}</span>
        <h1>${category.name}</h1>
      </div>
      
      <div class="category-description">
        <p>${category.description || ''}</p>
      </div>
      
      <h2>תתי-קטגוריות</h2>
      <div class="subcategories-grid">
        ${subcategoriesHtml || '<p>אין תתי-קטגוריות זמינות</p>'}
      </div>
      
      <div class="smart-features-section">
        <h2>פיצ'רים חכמים ל${category.name}</h2>
        <p>הפיצ'רים החכמים של Keeviqo מסייעים לך לנהל את המידע שלך ביעילות ובחכמה.</p>
        <ul>
          <li><strong>KeeviAI</strong> - מזהה את הצרכים שלך ומציע פעולות רלוונטיות</li>
          <li><strong>KeeviScan</strong> - סורק ומנתח מסמכים באופן אוטומטי</li>
          <li><strong>KeeviRemind</strong> - שולח תזכורות חכמות בהתאם לצרכים שלך</li>
          <li><strong>KeeviMap</strong> - מציג מפת קשרים בין פריטי מידע שונים</li>
          <li><strong>KeeviShare</strong> - מאפשר שיתוף מאובטח של מידע נבחר</li>
        </ul>
      </div>
    </div>
    
    <div class="back-button" onclick="location.href='/'">
      <span class="material-icons">arrow_back</span>
    </div>
    
    <footer>
      <p>© 2023 Keeviqo - כל הזכויות שמורות</p>
    </footer>
  </body>
  </html>
  `;
}

function generateLoginHtml() {
  return `
  <!DOCTYPE html>
  <html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keeviqo - התחברות</title>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
      body {
        font-family: 'Rubik', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        direction: rtl;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .login-container {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        padding: 30px;
        width: 100%;
        max-width: 400px;
      }
      .login-header {
        text-align: center;
        margin-bottom: 30px;
      }
      .login-header h1 {
        color: #1976D2;
        margin: 10px 0;
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
      }
      .login-button {
        background-color: #1976D2;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        font-weight: 500;
      }
      .login-footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #666;
      }
      .login-footer a {
        color: #1976D2;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="login-container">
      <div class="login-header">
        <h1>Keeviqo</h1>
        <p>התחבר למערכת ניהול המידע האישי שלך</p>
      </div>
      
      <form class="login-form" id="loginForm">
        <div class="form-group">
          <label for="username">שם משתמש</label>
          <input type="text" id="username" name="username" required>
        </div>
        
        <div class="form-group">
          <label for="password">סיסמה</label>
          <input type="password" id="password" name="password" required>
        </div>
        
        <button type="submit" class="login-button">התחבר</button>
      </form>
      
      <div class="login-footer">
        <p>שכחת סיסמה? <a href="#">לחץ כאן</a></p>
      </div>
    </div>
    
    <script>
      document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'admin' && password === 'Keeviqo2023!') {
          window.location.href = '/';
        } else {
          alert('שם משתמש או סיסמה שגויים');
        }
      });
    </script>
  </body>
  </html>
  `;
}

app.get('/', (req, res) => {
  res.send(generateDashboardHtml());
});

app.get('/login', (req, res) => {
  res.send(generateLoginHtml());
});

app.get('/category/:id', (req, res) => {
  res.send(generateCategoryHtml(req.params.id));
});

app.listen(PORT, () => {
  console.log(`Keeviqo static server running at http://localhost:${PORT}`);
  console.log(`Total categories loaded: ${categoriesData.length}`);
});
