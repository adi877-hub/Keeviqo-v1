const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;

let categoriesData;
try {
  categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories_full_72.json'), 'utf8'));
} catch (error) {
  console.error('Error loading categories data:', error);
  categoriesData = [];
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'keeviqo-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

function getFeatureDescription(type) {
  switch(type) {
    case 'upload':
      return 'העלאת מסמכים וקבצים הקשורים לקטגוריה זו';
    case 'reminder':
      return 'הגדרת תזכורות ומעקב אחר מועדים חשובים';
    case 'external_link':
      return 'קישור למערכות חיצוניות ואתרים רלוונטיים';
    case 'form':
      return 'מילוי טפסים ושמירת מידע מובנה';
    default:
      return '';
  }
}

const requireAuth = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - התחברות</title>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        body {
          font-family: 'Rubik', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          direction: rtl;
        }
        .login-container {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 30px;
          width: 350px;
          max-width: 90%;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo h1 {
          color: #1976D2;
          margin: 0;
        }
        .form-group {
          margin-bottom: 15px;
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
          font-size: 16px;
          direction: rtl;
        }
        button {
          background-color: #1976D2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 12px;
          width: 100%;
          font-size: 16px;
          cursor: pointer;
          font-weight: 500;
          font-family: 'Rubik', sans-serif;
        }
        button:hover {
          background-color: #1565C0;
        }
        .error {
          color: #f44336;
          margin-top: 15px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <div class="logo">
          <h1>Keeviqo</h1>
          <p>ניהול מידע אישי חכם</p>
        </div>
        <form action="/login" method="POST">
          <div class="form-group">
            <label for="username">שם משתמש</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">סיסמה</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">התחברות</button>
          ${req.query.error ? '<p class="error">שם משתמש או סיסמה שגויים</p>' : ''}
        </form>
      </div>
    </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'Keeviqo2023!') {
    req.session.authenticated = true;
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.redirect('/login?error=true');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/dashboard', requireAuth, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const search = req.query.search || '';
  
  let filteredCategories = categoriesData;
  
  if (search) {
    filteredCategories = categoriesData.filter(category => 
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCategories.length / limit);
  
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - לוח בקרה</title>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        body {
          font-family: 'Rubik', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          direction: rtl;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          color: #1976D2;
          margin: 0;
        }
        .user-menu {
          display: flex;
          align-items: center;
        }
        .user-menu a {
          margin-right: 15px;
          color: #333;
          text-decoration: none;
        }
        .search-bar {
          margin-bottom: 20px;
          display: flex;
        }
        .search-bar input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px 0 0 4px;
          font-size: 16px;
          direction: rtl;
        }
        .search-bar button {
          background-color: #1976D2;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          padding: 10px 15px;
          cursor: pointer;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .category-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
          margin-bottom: 15px;
          font-size: 14px;
        }
        .category-features {
          font-size: 13px;
          color: #1976D2;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
        .pagination a {
          display: inline-block;
          padding: 8px 12px;
          margin: 0 5px;
          background-color: white;
          border-radius: 4px;
          text-decoration: none;
          color: #333;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .pagination a.active {
          background-color: #1976D2;
          color: white;
        }
        .pagination a:hover:not(.active) {
          background-color: #f1f1f1;
        }
        .no-results {
          text-align: center;
          padding: 40px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <div class="logo">
            <h1>Keeviqo</h1>
          </div>
          <div class="user-menu">
            <a href="/profile"><span class="material-icons">person</span> ${req.session.username}</a>
            <a href="/logout"><span class="material-icons">exit_to_app</span> התנתקות</a>
          </div>
        </header>
        
        <div class="search-bar">
          <input type="text" id="searchInput" placeholder="חיפוש קטגוריות..." value="${search}">
          <button onclick="searchCategories()"><span class="material-icons">search</span></button>
        </div>
        
        ${paginatedCategories.length > 0 ? `
          <div class="categories-grid">
            ${paginatedCategories.map(category => `
              <div class="category-card" onclick="location.href='/category/${category.id}'">
                <div class="category-header">
                  <div class="category-icon">
                    <span class="material-icons">${category.icon || 'folder'}</span>
                  </div>
                  <h2 class="category-title">${category.name}</h2>
                </div>
                <p class="category-description">${category.description || ''}</p>
                <div class="category-features">
                  <strong>פיצ'רים חכמים:</strong> ${category.smartFeatures || ''}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="pagination">
            ${page > 1 ? `<a href="/dashboard?page=${page-1}&limit=${limit}&search=${search}">הקודם</a>` : ''}
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => 
              `<a href="/dashboard?page=${pageNum}&limit=${limit}&search=${search}" class="${pageNum === page ? 'active' : ''}">${pageNum}</a>`
            ).join('')}
            ${page < totalPages ? `<a href="/dashboard?page=${page+1}&limit=${limit}&search=${search}">הבא</a>` : ''}
          </div>
        ` : `
          <div class="no-results">
            <h2>לא נמצאו תוצאות</h2>
            <p>נסה לחפש מונחים אחרים או <a href="/dashboard">הצג את כל הקטגוריות</a></p>
          </div>
        `}
      </div>
      
      <script>
        function searchCategories() {
          const searchTerm = document.getElementById('searchInput').value;
          window.location.href = '/dashboard?search=' + encodeURIComponent(searchTerm);
        }
        
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            searchCategories();
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Keeviqo server running on port ${PORT}`);
});
