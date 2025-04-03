import express from 'express';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const subcategories = await db.select().from(schema.subcategories);
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

router.get('/category/:id', async (req, res) => {
  try {
    const subcategories = await db.select().from(schema.subcategories)
      .where(eq(schema.subcategories.categoryId, parseInt(req.params.id)));
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const subcategory = await db.select().from(schema.subcategories)
      .where(eq(schema.subcategories.id, parseInt(req.params.id)));
    
    if (!subcategory || subcategory.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
    const features = await db.select().from(schema.features)
      .where(eq(schema.features.subcategoryId, parseInt(req.params.id)));
    
    const result = {
      ...subcategory[0],
      features: features || []
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ error: 'Failed to fetch subcategory' });
  }
});

export default router;
