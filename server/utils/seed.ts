import { db } from './db';
import * as schema from '../../shared/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedCategories() {
  try {
    const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../categories.json'), 'utf-8'));
    
    for (const category of categoriesData) {
      await db.insert(schema.categories).values({
        id: category.id,
        name: category.name,
        icon: category.icon,
        description: category.description,
        smartFeatures: category.smartFeatures,
        includes: category.includes,
        parentId: category.parentId || null,
      }).returning();
      
      console.log(`Inserted category: ${category.name}`);
    }
    
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

async function main() {
  try {
    await seedCategories();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

main();
