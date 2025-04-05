
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, 'dist')));

const indexPath = path.join(__dirname, 'dist', 'index.html');
if (!fs.existsSync(indexPath)) {
  const loginHtml = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - Login</title>
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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #1976D2;
      margin: 0;
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
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
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
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #1565C0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="logo">
      <h1>Keeviqo</h1>
      <p>המערכת החכמה לניהול מידע אישי</p>
    </div>
    
    <form id="loginForm">
      <div class="form-group">
        <label for="username">שם משתמש</label>
        <input type="text" id="username" name="username" required>
      </div>
      
      <div class="form-group">
        <label for="password">סיסמה</label>
        <input type="password" id="password" name="password" required>
      </div>
      
      <button type="submit">התחברות</button>
    </form>
    
    <div class="footer">
      <p>© 2025 Keeviqo. כל הזכויות שמורות.</p>
    </div>
  </div>

  <script>
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (username === 'admin' && password === 'Keeviqo2023!') {
        window.location.href = '/dashboard.html';
      } else {
        alert('שם משתמש או סיסמה שגויים');
      }
    });
  </script>
</body>
</html>
  `;
  
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
  }
  
  const dashboardHtml = `
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
      background-color: #1976D2;
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .user-info {
      display: flex;
      align-items: center;
    }
    .user-info span {
      margin-right: 10px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .welcome-card {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    .footer {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      color: #666;
      font-size: 14px;
    }
  </style>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <div class="header">
    <h1>Keeviqo</h1>
    <div class="user-info">
      <span>שלום, מנהל</span>
      <span class="material-icons">account_circle</span>
    </div>
  </div>
  
  <div class="container">
    <div class="welcome-card">
      <h2>ברוכים הבאים למערכת Keeviqo</h2>
      <p>המערכת החכמה לניהול מידע אישי. בחר קטגוריה להתחלה.</p>
    </div>
    
    <h2>הקטגוריות שלי</h2>
    <div class="categories-grid">
      <div class="category-card">
        <div class="category-icon">
          <span class="material-icons">health_and_safety</span>
        </div>
        <h3>בריאות</h3>
        <p>ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות</p>
      </div>
      
      <div class="category-card">
        <div class="category-icon">
          <span class="material-icons">account_balance</span>
        </div>
        <h3>פיננסים</h3>
        <p>ניהול חשבונות, השקעות, וחסכונות</p>
      </div>
      
      <div class="category-card">
        <div class="category-icon">
          <span class="material-icons">school</span>
        </div>
        <h3>חינוך</h3>
        <p>תעודות, קורסים, והשכלה</p>
      </div>
      
      <div class="category-card">
        <div class="category-icon">
          <span class="material-icons">home</span>
        </div>
        <h3>נדל"ן</h3>
        <p>מסמכי דירה, משכנתא, וחוזי שכירות</p>
      </div>
      
      <div class="category-card">
        <div class="category-icon">
          <span class="material-icons">family_restroom</span>
        </div>
        <h3>משפחה</h3>
        <p>מסמכים משפחתיים, אירועים, ותכנון</p>
      </div>
      
      <div class="category-card">
        <div class="category-icon">
          <span class="material-icons">work</span>
        </div>
        <h3>קריירה</h3>
        <p>קורות חיים, חוזי עבודה, והמלצות</p>
      </div>
    </div>
  </div>
  
  <div class="footer">
    <p>© 2025 Keeviqo. כל הזכויות שמורות.</p>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(indexPath, loginHtml);
  fs.writeFileSync(path.join(__dirname, 'dist', 'dashboard.html'), dashboardHtml);
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Keeviqo preview server running at http://localhost:${PORT}`);
});
