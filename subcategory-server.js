import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Load categories data
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
  } else {
    throw new Error('categories_full_72.json not found');
  }
} catch (error) {
  console.error('Error loading categories:', error);
  categoriesData = [
    { id: 1, name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
    { id: 2, name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" }
  ];
}

// API endpoints
app.get('/api/categories', (req, res) => {
  res.json(categoriesData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Keeviqo server running at http://localhost:${PORT}`);
  console.log(`Total categories loaded: ${categoriesData.length}`);
});
