const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;

// Load categories data
let categoriesData = [];
try {
  const filePath = path.join(__dirname, 'categories_full_72.json');
  if (fs.existsSync(filePath)) {
    console.log('Loading categories from categories_full_72.json...');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    
    if (parsedData.categories) {
      categoriesData = parsedData.categories;
    } else if (Array.isArray(parsedData)) {
      categoriesData = parsedData;
    }
    
    console.log(`Successfully loaded ${categoriesData.length} categories`);
  } else {
    throw new Error('categories_full_72.json not found');
  }
} catch (error) {
  console.error('Error loading categories:', error);
  categoriesData = [
    { id: 1, name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
    { id: 2, name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" },
    { id: 3, name: "חינוך", icon: "school", description: "תעודות, קורסים, והשכלה" }
  ];
}

// Main dashboard page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keeviqo - ניהול מידע אישי</title>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        body {
          font-family: Arial, sans-serif;
          direction: rtl;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .header {
          background-color: #1976D2;
          color: white;
          padding: 16px;
          text-align: center;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .categories {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .category-card {
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .category-name {
          font-weight: bold;
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Keeviqo Dashboard</h1>
      </div>
      <div class="container">
        <h2>קטגוריות (${categoriesData.length})</h2>
        <div class="categories">
          ${categoriesData.map(category => `
            <div class="category-card">
              <div class="category-name">
                <span class="material-icons">${category.icon || 'folder'}</span>
                ${category.name}
              </div>
              <div class="category-description">${category.description || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
