const express = require('express');
const fs = require('fs');
const path = require('path');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'keeviqo-secret-key-2025',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

const authenticate = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
};

if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'));
}

const createStaticFiles = () => {
  const cssContent = `
    body {
      font-family: 'Rubik', sans-serif;
      direction: rtl;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #1976D2;
      color: white;
      padding: 15px 0;
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
    }
    .login-form {
      max-width: 400px;
      margin: 100px auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    button {
      background-color: #1976D2;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      width: 100%;
    }
    button:hover {
      background-color: #1565C0;
    }
    .error-message {
      color: #d32f2f;
      margin-bottom: 20px;
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .category-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .category-title {
      color: #1976D2;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .category-description {
      color: #666;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .subcategory-list {
      margin-top: 15px;
    }
    .subcategory-item {
      background-color: #f1f5f9;
      padding: 10px;
      margin-bottom: 8px;
      border-radius: 4px;
      cursor: pointer;
    }
    .subcategory-item:hover {
      background-color: #e3f2fd;
    }
    .back-button {
      display: inline-block;
      margin-bottom: 20px;
      background-color: #f1f5f9;
      color: #1976D2;
      padding: 8px 15px;
      border-radius: 4px;
      text-decoration: none;
    }
    .back-button:hover {
      background-color: #e3f2fd;
    }
    .feature-button {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 8px 15px;
      border-radius: 4px;
      color: white;
      text-decoration: none;
    }
    .feature-upload {
      background-color: #1976D2;
    }
    .feature-reminder {
      background-color: #388E3C;
    }
    .feature-external_link {
      background-color: #7B1FA2;
    }
    .feature-form {
      background-color: #F57C00;
    }
    .language-toggle {
      position: absolute;
      top: 20px;
      left: 20px;
      background: white;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
    .pagination-button {
      margin: 0 5px;
      padding: 8px 15px;
      background-color: #f1f5f9;
      border-radius: 4px;
      cursor: pointer;
    }
    .pagination-button.active {
      background-color: #1976D2;
      color: white;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
    }
    .footer-links a {
      margin: 0 10px;
      color: #1976D2;
      text-decoration: none;
    }
  `;
  fs.writeFileSync(path.join(__dirname, 'public', 'styles.css'), cssContent);

  const loginHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - התחברות</title>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="container">
        <div class="login-form">
          <h1 style="text-align: center; color: #1976D2; margin-bottom: 30px;">Keeviqo</h1>
          <h2 style="text-align: center; margin-bottom: 30px;">התחברות למערכת</h2>
          <div id="error-message" class="error-message" style="display: none;"></div>
          <form id="login-form" action="/login" method="post">
            <div class="form-group">
              <label for="username">שם משתמש</label>
              <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
              <label for="password">סיסמה</label>
              <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">התחבר</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('login-form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          
          fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              window.location.href = '/dashboard';
            } else {
              const errorMessage = document.getElementById('error-message');
              errorMessage.textContent = data.message || 'שם משתמש או סיסמה שגויים';
              errorMessage.style.display = 'block';
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
      </script>
    </body>
    </html>
  `;
  fs.writeFileSync(path.join(__dirname, 'public', 'login.html'), loginHtml);
};

createStaticFiles();

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req.session.authenticated) {
    return res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'Keeviqo2023!') {
    req.session.authenticated = true;
    req.session.username = username;
    return res.json({ success: true });
  }
  
  res.json({ success: false, message: 'שם משתמש או סיסמה שגויים' });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/dashboard', authenticate, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedCategories = categoriesData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(categoriesData.length / limit);
  
  let dashboardHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - לוח בקרה</title>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="language-toggle" onclick="toggleLanguage()">EN</div>
      <div class="header">
        <div class="container">
          <div class="logo">Keeviqo</div>
          <div>שלום, ${req.session.username} | <a href="/logout" style="color: white; text-decoration: underline;">התנתק</a></div>
        </div>
      </div>
      <div class="container">
        <h1>לוח בקרה</h1>
        <p>ברוכים הבאים למערכת Keeviqo. בחרו קטגוריה להתחיל:</p>
        
        <div class="category-grid">
  `;
  
  paginatedCategories.forEach(category => {
    dashboardHtml += `
      <div class="category-card" onclick="location.href='/category/${category.id}'">
        <div class="category-title">${category.name}</div>
        <div class="category-description">${category.description || 'אין תיאור'}</div>
      </div>
    `;
  });
  
  dashboardHtml += `
        </div>
        
        <div class="pagination">
  `;
  
  for (let i = 1; i <= totalPages; i++) {
    dashboardHtml += `
      <div class="pagination-button ${i === page ? 'active' : ''}" onclick="location.href='/dashboard?page=${i}'">${i}</div>
    `;
  }
  
  dashboardHtml += `
        </div>
        
        <div class="footer">
          <div class="footer-links">
            <a href="/about">אודות</a>
            <a href="/privacy">מדיניות פרטיות</a>
            <a href="/terms">תנאי שימוש</a>
            <a href="/contact">צור קשר</a>
          </div>
          <p>© 2025 Keeviqo. כל הזכויות שמורות.</p>
        </div>
      </div>
      
      <script>
        function toggleLanguage() {
          alert('שינוי שפה יהיה זמין בקרוב');
        }
      </script>
    </body>
    </html>
  `;
  
  res.send(dashboardHtml);
});

app.get('/category/:id', authenticate, (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categoriesData.find(cat => cat.id === categoryId);
  
  if (!category) {
    return res.status(404).send('קטגוריה לא נמצאה');
  }
  
  let categoryHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - ${category.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="language-toggle" onclick="toggleLanguage()">EN</div>
      <div class="header">
        <div class="container">
          <div class="logo">Keeviqo</div>
          <div>שלום, ${req.session.username} | <a href="/logout" style="color: white; text-decoration: underline;">התנתק</a></div>
        </div>
      </div>
      <div class="container">
        <a href="/dashboard" class="back-button">חזרה ללוח הבקרה</a>
        
        <h1>${category.name}</h1>
        <p>${category.description || 'אין תיאור'}</p>
        
        <h2>תתי-קטגוריות</h2>
        <div class="subcategory-list">
  `;
  
  if (category.subcategories && category.subcategories.length > 0) {
    category.subcategories.forEach(subcategory => {
      categoryHtml += `
        <div class="subcategory-item" onclick="location.href='/subcategory/${category.id}/${subcategory.id}'">
          ${subcategory.name}
        </div>
      `;
    });
  } else {
    categoryHtml += `<p>אין תתי-קטגוריות זמינות</p>`;
  }
  
  categoryHtml += `
        </div>
        
        <div class="footer">
          <div class="footer-links">
            <a href="/about">אודות</a>
            <a href="/privacy">מדיניות פרטיות</a>
            <a href="/terms">תנאי שימוש</a>
            <a href="/contact">צור קשר</a>
          </div>
          <p>© 2025 Keeviqo. כל הזכויות שמורות.</p>
        </div>
      </div>
      
      <script>
        function toggleLanguage() {
          alert('שינוי שפה יהיה זמין בקרוב');
        }
      </script>
    </body>
    </html>
  `;
  
  res.send(categoryHtml);
});

app.get('/subcategory/:categoryId/:subcategoryId', authenticate, (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const subcategoryId = parseInt(req.params.subcategoryId);
  
  const category = categoriesData.find(cat => cat.id === categoryId);
  
  if (!category) {
    return res.status(404).send('קטגוריה לא נמצאה');
  }
  
  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  
  if (!subcategory) {
    return res.status(404).send('תת-קטגוריה לא נמצאה');
  }
  
  let subcategoryHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - ${subcategory.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="language-toggle" onclick="toggleLanguage()">EN</div>
      <div class="header">
        <div class="container">
          <div class="logo">Keeviqo</div>
          <div>שלום, ${req.session.username} | <a href="/logout" style="color: white; text-decoration: underline;">התנתק</a></div>
        </div>
      </div>
      <div class="container">
        <a href="/category/${categoryId}" class="back-button">חזרה לקטגוריה</a>
        
        <h1>${subcategory.name}</h1>
        
        <h2>פיצ'רים זמינים</h2>
  `;
  
  if (subcategory.features && subcategory.features.length > 0) {
    subcategoryHtml += `<div style="margin-top: 20px;">`;
    
    subcategory.features.forEach(feature => {
      let featureClass = '';
      let featureAction = '';
      
      switch (feature.type) {
        case 'upload':
          featureClass = 'feature-upload';
          featureAction = `onclick="alert('פיצ\'ר העלאה יהיה זמין בקרוב')"`;
          break;
        case 'reminder':
          featureClass = 'feature-reminder';
          featureAction = `onclick="alert('פיצ\'ר תזכורות יהיה זמין בקרוב')"`;
          break;
        case 'external_link':
          featureClass = 'feature-external_link';
          if (feature.url) {
            featureAction = `onclick="window.open('${feature.url}', '_blank')"`;
          } else {
            featureAction = `onclick="alert('קישור חיצוני יהיה זמין בקרוב')"`;
          }
          break;
        case 'form':
          featureClass = 'feature-form';
          featureAction = `onclick="alert('פיצ\'ר טפסים יהיה זמין בקרוב')"`;
          break;
      }
      
      subcategoryHtml += `
        <a class="feature-button ${featureClass}" ${featureAction}>
          ${feature.label || feature.type}
        </a>
      `;
    });
    
    subcategoryHtml += `</div>`;
  } else {
    subcategoryHtml += `<p>אין פיצ'רים זמינים</p>`;
  }
  
  subcategoryHtml += `
        <div class="footer">
          <div class="footer-links">
            <a href="/about">אודות</a>
            <a href="/privacy">מדיניות פרטיות</a>
            <a href="/terms">תנאי שימוש</a>
            <a href="/contact">צור קשר</a>
          </div>
          <p>© 2025 Keeviqo. כל הזכויות שמורות.</p>
        </div>
      </div>
      
      <script>
        function toggleLanguage() {
          alert('שינוי שפה יהיה זמין בקרוב');
        }
      </script>
    </body>
    </html>
  `;
  
  res.send(subcategoryHtml);
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'static-pages', 'about.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'static-pages', 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'static-pages', 'terms.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'static-pages', 'contact.html'));
});

app.listen(PORT, () => {
  console.log(`Keeviqo public server running on port ${PORT}`);
});
