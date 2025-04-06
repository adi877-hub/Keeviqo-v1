import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import bodyParser from 'body-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keeviqo-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(express.static(path.join(__dirname, 'public')));

let categoriesData;
try {
  const categoriesFile = path.join(__dirname, 'categories_full_72.json');
  categoriesData = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
  console.log(`Loaded ${categoriesData.length} categories`);
} catch (error) {
  console.error('Error loading categories:', error);
  categoriesData = [];
}

function getFeatureTypeHebrew(type) {
  const types = {
    'upload': 'העלאת מסמך',
    'reminder': 'תזכורת',
    'external_link': 'קישור חיצוני',
    'form': 'טופס'
  };
  return types[type] || type;
}

const authenticate = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/api/categories', (req, res) => {
  res.json(categoriesData);
});

app.get('/api/category/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categoriesData.find(cat => cat.id === categoryId);
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  res.json(category);
});

app.get('/api/subcategory/:categoryId/:subcategoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const subcategoryId = parseInt(req.params.subcategoryId);
  
  const category = categoriesData.find(cat => cat.id === categoryId);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  const subcategory = category.subcategories ? 
    category.subcategories.find(sub => sub.id === subcategoryId) : null;
  
  if (!subcategory) {
    return res.status(404).json({ error: 'Subcategory not found' });
  }
  
  res.json(subcategory);
});

app.post('/api/upload', (req, res) => {
  res.json({ success: true, message: 'Document uploaded successfully' });
});

app.post('/api/reminder', (req, res) => {
  res.json({ success: true, message: 'Reminder set successfully' });
});

app.post('/api/form', (req, res) => {
  res.json({ success: true, message: 'Form submitted successfully' });
});

const staticPages = ['about', 'privacy', 'terms', 'contact'];
staticPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    try {
      const htmlPath = path.join(__dirname, `static-pages/${page}.html`);
      if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
      } else {
        res.status(404).send(`${page} page not found`);
      }
    } catch (error) {
      console.error(`Error serving ${page} page:`, error);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - התחברות</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          padding: 30px;
          width: 350px;
        }
        h1 {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 30px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          color: #34495e;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          box-sizing: border-box;
        }
        button {
          width: 100%;
          padding: 12px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #2980b9;
        }
        .error-message {
          color: #e74c3c;
          margin-top: 20px;
          text-align: center;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo img {
          max-width: 150px;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <div class="logo">
          <h2>Keeviqo</h2>
        </div>
        <h1>התחברות למערכת</h1>
        <form action="/login" method="POST">
          <div class="form-group">
            <label for="username">שם משתמש</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">סיסמה</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">התחבר</button>
          ${req.query.error ? '<p class="error-message">שם משתמש או סיסמה שגויים</p>' : ''}
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

app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', authenticate, (req, res) => {
  const categoriesHtml = categoriesData.map(category => `
    <div class="category-card" onclick="location.href='/category/${category.id}'">
      <h3>${category.name}</h3>
      <p>${category.description || 'No description available'}</p>
      <div class="category-features">
        ${category.smartFeatures ? `<span class="feature-tag">Smart Features: ${category.smartFeatures}</span>` : ''}
      </div>
    </div>
  `).join('');

  res.send(`
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
        header {
          background-color: #2c3e50;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo h1 {
          margin: 0;
          font-size: 24px;
        }
        .user-menu {
          display: flex;
          align-items: center;
        }
        .user-menu a {
          color: white;
          text-decoration: none;
          margin-left: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .category-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .category-card h3 {
          color: #2c3e50;
          margin-top: 0;
        }
        .category-features {
          margin-top: 15px;
        }
        .feature-tag {
          display: inline-block;
          background-color: #e8f4fd;
          color: #3498db;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
        }
        .search-bar {
          margin-bottom: 20px;
        }
        .search-bar input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        footer {
          background-color: #2c3e50;
          color: white;
          text-align: center;
          padding: 15px;
          margin-top: 40px;
        }
        footer a {
          color: #3498db;
          text-decoration: none;
        }
        .back-button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 8px 15px;
          border-radius: 5px;
          text-decoration: none;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">
          <h1>Keeviqo</h1>
        </div>
        <div class="user-menu">
          <a href="/profile">פרופיל</a>
          <a href="/logout">התנתק</a>
        </div>
      </header>
      
      <div class="container">
        <h2>ברוך הבא, ${req.session.username}</h2>
        
        <div class="search-bar">
          <input type="text" placeholder="חפש קטגוריות..." id="searchInput" onkeyup="searchCategories()">
        </div>
        
        <div class="categories-grid" id="categoriesGrid">
          ${categoriesHtml}
        </div>
      </div>
      
      <footer>
        <p>Keeviqo &copy; 2023 | <a href="/about">אודות</a> | <a href="/privacy">מדיניות פרטיות</a> | <a href="/terms">תנאי שימוש</a> | <a href="/contact">צור קשר</a></p>
      </footer>
      
      <script>
        function searchCategories() {
          const input = document.getElementById('searchInput');
          const filter = input.value.toUpperCase();
          const grid = document.getElementById('categoriesGrid');
          const cards = grid.getElementsByClassName('category-card');
          
          for (let i = 0; i < cards.length; i++) {
            const title = cards[i].getElementsByTagName('h3')[0];
            const description = cards[i].getElementsByTagName('p')[0];
            const txtValue = title.textContent || title.innerText;
            const descValue = description.textContent || description.innerText;
            
            if (txtValue.toUpperCase().indexOf(filter) > -1 || descValue.toUpperCase().indexOf(filter) > -1) {
              cards[i].style.display = "";
            } else {
              cards[i].style.display = "none";
            }
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/category/:id', authenticate, (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categoriesData.find(cat => cat.id === categoryId);
  
  if (!category) {
    return res.status(404).send('Category not found');
  }
  
  const subcategoriesHtml = category.subcategories ? category.subcategories.map(subcategory => `
    <div class="subcategory-card" onclick="location.href='/subcategory/${category.id}/${subcategory.id}'">
      <h3>${subcategory.name}</h3>
      <div class="subcategory-features">
        ${subcategory.features ? subcategory.features.map(feature => 
          `<span class="feature-button feature-${feature.type}">${feature.label}</span>`
        ).join('') : 'No features available'}
      </div>
    </div>
  `).join('') : '<p>No subcategories available</p>';

  res.send(`
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
        header {
          background-color: #2c3e50;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo h1 {
          margin: 0;
          font-size: 24px;
        }
        .user-menu {
          display: flex;
          align-items: center;
        }
        .user-menu a {
          color: white;
          text-decoration: none;
          margin-left: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .subcategories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .subcategory-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .subcategory-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .subcategory-card h3 {
          color: #2c3e50;
          margin-top: 0;
        }
        .subcategory-features {
          margin-top: 15px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .feature-button {
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
          color: white;
        }
        .feature-upload { background-color: #1976D2; }
        .feature-reminder { background-color: #388E3C; }
        .feature-external_link { background-color: #7B1FA2; }
        .feature-form { background-color: #F57C00; }
        .category-info {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .back-button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 8px 15px;
          border-radius: 5px;
          text-decoration: none;
          margin-bottom: 20px;
        }
        footer {
          background-color: #2c3e50;
          color: white;
          text-align: center;
          padding: 15px;
          margin-top: 40px;
        }
        footer a {
          color: #3498db;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">
          <h1>Keeviqo</h1>
        </div>
        <div class="user-menu">
          <a href="/profile">פרופיל</a>
          <a href="/logout">התנתק</a>
        </div>
      </header>
      
      <div class="container">
        <a href="/dashboard" class="back-button">חזרה לדאשבורד</a>
        
        <div class="category-info">
          <h2>${category.name}</h2>
          <p>${category.description || 'No description available'}</p>
          ${category.smartFeatures ? `<p><strong>פיצ'רים חכמים:</strong> ${category.smartFeatures}</p>` : ''}
          ${category.includes ? `<p><strong>כולל:</strong> ${category.includes}</p>` : ''}
        </div>
        
        <h2>תתי-קטגוריות</h2>
        <div class="subcategories-grid">
          ${subcategoriesHtml}
        </div>
      </div>
      
      <footer>
        <p>Keeviqo &copy; 2023 | <a href="/about">אודות</a> | <a href="/privacy">מדיניות פרטיות</a> | <a href="/terms">תנאי שימוש</a> | <a href="/contact">צור קשר</a></p>
      </footer>
    </body>
    </html>
  `);
});

app.get('/subcategory/:categoryId/:subcategoryId', authenticate, (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const subcategoryId = parseInt(req.params.subcategoryId);
  
  const category = categoriesData.find(cat => cat.id === categoryId);
  if (!category) {
    return res.status(404).send('Category not found');
  }
  
  const subcategory = category.subcategories ? category.subcategories.find(sub => sub.id === subcategoryId) : null;
  if (!subcategory) {
    return res.status(404).send('Subcategory not found');
  }
  
  const featuresHtml = subcategory.features ? subcategory.features.map(feature => {
    let featureUrl;
    
    if (feature.type === 'external_link' && feature.url) {
      featureUrl = feature.url;
    } else {
      featureUrl = `/feature/${feature.type}/${categoryId}/${subcategoryId}/${feature.id}`;
    }
    
    return `
      <div class="feature-card feature-${feature.type}" onclick="location.href='${featureUrl}'">
        <h3>${feature.label}</h3>
        <p class="feature-type">${getFeatureTypeHebrew(feature.type)}</p>
      </div>
    `;
  }).join('') : '<p>No features available</p>';

  res.send(`
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - ${subcategory.name}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          direction: rtl;
        }
        header {
          background-color: #2c3e50;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo h1 {
          margin: 0;
          font-size: 24px;
        }
        .user-menu {
          display: flex;
          align-items: center;
        }
        .user-menu a {
          color: white;
          text-decoration: none;
          margin-left: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .feature-card {
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          color: white;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .feature-card h3 {
          margin-top: 0;
        }
        .feature-type {
          opacity: 0.8;
          font-size: 14px;
        }
        .feature-upload { background-color: #1976D2; }
        .feature-reminder { background-color: #388E3C; }
        .feature-external_link { background-color: #7B1FA2; }
        .feature-form { background-color: #F57C00; }
        .subcategory-info {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .back-button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 8px 15px;
          border-radius: 5px;
          text-decoration: none;
          margin-bottom: 20px;
        }
        footer {
          background-color: #2c3e50;
          color: white;
          text-align: center;
          padding: 15px;
          margin-top: 40px;
        }
        footer a {
          color: #3498db;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">
          <h1>Keeviqo</h1>
        </div>
        <div class="user-menu">
          <a href="/profile">פרופיל</a>
          <a href="/logout">התנתק</a>
        </div>
      </header>
      
      <div class="container">
        <a href="/category/${categoryId}" class="back-button">חזרה לקטגוריה</a>
        
        <div class="subcategory-info">
          <h2>${subcategory.name}</h2>
          <p>קטגוריה: ${category.name}</p>
        </div>
        
        <h2>פעולות זמינות</h2>
        <div class="features-grid">
          ${featuresHtml}
        </div>
      </div>
      
      <footer>
        <p>Keeviqo &copy; 2023 | <a href="/about">אודות</a> | <a href="/privacy">מדיניות פרטיות</a> | <a href="/terms">תנאי שימוש</a> | <a href="/contact">צור קשר</a></p>
      </footer>
    </body>
    </html>
  `);
});

app.get('/feature/:type/:categoryId/:subcategoryId/:featureId', authenticate, (req, res) => {
  const { type, categoryId, subcategoryId, featureId } = req.params;
  const categoryIdNum = parseInt(categoryId);
  const subcategoryIdNum = parseInt(subcategoryId);
  const featureIdNum = parseInt(featureId);
  
  const category = categoriesData.find(cat => cat.id === categoryIdNum);
  if (!category) {
    return res.status(404).send('Category not found');
  }
  
  const subcategory = category.subcategories ? category.subcategories.find(sub => sub.id === subcategoryIdNum) : null;
  if (!subcategory) {
    return res.status(404).send('Subcategory not found');
  }
  
  const feature = subcategory.features ? subcategory.features.find(feat => feat.id === featureIdNum) : null;
  if (!feature) {
    return res.status(404).send('Feature not found');
  }
  
  let featureContent;
  
  switch (type) {
    case 'upload':
      featureContent = `
        <div class="feature-content">
          <h3>העלאת מסמך</h3>
          <form action="/api/upload" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="categoryId" value="${categoryIdNum}">
            <input type="hidden" name="subcategoryId" value="${subcategoryIdNum}">
            <input type="hidden" name="featureId" value="${featureIdNum}">
            
            <div class="form-group">
              <label for="documentName">שם המסמך</label>
              <input type="text" id="documentName" name="documentName" required>
            </div>
            
            <div class="form-group">
              <label for="documentFile">בחר קובץ</label>
              <input type="file" id="documentFile" name="documentFile" required>
            </div>
            
            <div class="form-group">
              <label for="documentDescription">תיאור (אופציונלי)</label>
              <textarea id="documentDescription" name="documentDescription" rows="3"></textarea>
            </div>
            
            <button type="submit" class="submit-button">העלה מסמך</button>
          </form>
        </div>
      `;
      break;
      
    case 'reminder':
      featureContent = `
        <div class="feature-content">
          <h3>הגדרת תזכורת</h3>
          <form action="/api/reminder" method="POST">
            <input type="hidden" name="categoryId" value="${categoryIdNum}">
            <input type="hidden" name="subcategoryId" value="${subcategoryIdNum}">
            <input type="hidden" name="featureId" value="${featureIdNum}">
            
            <div class="form-group">
              <label for="reminderTitle">כותרת</label>
              <input type="text" id="reminderTitle" name="reminderTitle" required>
            </div>
            
            <div class="form-group">
              <label for="reminderDate">תאריך</label>
              <input type="date" id="reminderDate" name="reminderDate" required>
            </div>
            
            <div class="form-group">
              <label for="reminderTime">שעה</label>
              <input type="time" id="reminderTime" name="reminderTime" required>
            </div>
            
            <div class="form-group">
              <label for="reminderDescription">תיאור</label>
              <textarea id="reminderDescription" name="reminderDescription" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label for="reminderFrequency">תדירות</label>
              <select id="reminderFrequency" name="reminderFrequency">
                <option value="once">פעם אחת</option>
                <option value="daily">יומי</option>
                <option value="weekly">שבועי</option>
                <option value="monthly">חודשי</option>
                <option value="yearly">שנתי</option>
              </select>
            </div>
            
            <button type="submit" class="submit-button">הגדר תזכורת</button>
          </form>
        </div>
      `;
      break;
      
    case 'form':
      featureContent = `
        <div class="feature-content">
          <h3>טופס: ${feature.label}</h3>
          <form action="/api/form" method="POST">
            <input type="hidden" name="categoryId" value="${categoryIdNum}">
            <input type="hidden" name="subcategoryId" value="${subcategoryIdNum}">
            <input type="hidden" name="featureId" value="${featureIdNum}">
            
            <div class="form-group">
              <label for="formField1">שדה 1</label>
              <input type="text" id="formField1" name="formField1" required>
            </div>
            
            <div class="form-group">
              <label for="formField2">שדה 2</label>
              <input type="text" id="formField2" name="formField2">
            </div>
            
            <div class="form-group">
              <label for="formField3">שדה 3</label>
              <textarea id="formField3" name="formField3" rows="3"></textarea>
            </div>
            
            <button type="submit" class="submit-button">שלח טופס</button>
          </form>
        </div>
      `;
      break;
      
    case 'external_link':
      featureContent = `
        <div class="feature-content">
          <h3>קישור חיצוני: ${feature.label}</h3>
          <p>אתה עומד להיות מועבר לאתר חיצוני: ${feature.url || 'URL לא זמין'}</p>
          <div class="button-group">
            <a href="${feature.url}" target="_blank" class="submit-button">המשך לאתר החיצוני</a>
            <a href="/subcategory/${categoryIdNum}/${subcategoryIdNum}" class="cancel-button">חזרה</a>
          </div>
        </div>
      `;
      break;
      
    default:
      featureContent = `
        <div class="feature-content">
          <h3>סוג פיצ'ר לא נתמך</h3>
          <p>הסוג ${type} אינו נתמך כרגע.</p>
          <a href="/subcategory/${categoryIdNum}/${subcategoryIdNum}" class="back-button">חזרה</a>
        </div>
      `;
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - ${feature.label}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          direction: rtl;
        }
        header {
          background-color: #2c3e50;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo h1 {
          margin: 0;
          font-size: 24px;
        }
        .user-menu {
          display: flex;
          align-items: center;
        }
        .user-menu a {
          color: white;
          text-decoration: none;
          margin-left: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .feature-container {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }
        .feature-content h3 {
          margin-top: 0;
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #34495e;
        }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        .form-group textarea {
          resize: vertical;
        }
        .submit-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          display: inline-block;
          text-decoration: none;
        }
        .cancel-button {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          display: inline-block;
          text-decoration: none;
          margin-right: 10px;
        }
        .button-group {
          margin-top: 20px;
        }
        .back-button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 8px 15px;
          border-radius: 5px;
          text-decoration: none;
          margin-bottom: 20px;
        }
        footer {
          background-color: #2c3e50;
          color: white;
          text-align: center;
          padding: 15px;
          margin-top: 40px;
        }
        footer a {
          color: #3498db;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">
          <h1>Keeviqo</h1>
        </div>
        <div class="user-menu">
          <a href="/profile">פרופיל</a>
          <a href="/logout">התנתק</a>
        </div>
      </header>
      
      <div class="container">
        <a href="/subcategory/${categoryIdNum}/${subcategoryIdNum}" class="back-button">חזרה לתת-קטגוריה</a>
        
        <div class="feature-container">
          ${featureContent}
        </div>
      </div>
      
      <footer>
        <p>Keeviqo &copy; 2023 | <a href="/about">אודות</a> | <a href="/privacy">מדיניות פרטיות</a> | <a href="/terms">תנאי שימוש</a> | <a href="/contact">צור קשר</a></p>
      </footer>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Keeviqo server running on port ${PORT}`);
});

export default app;
