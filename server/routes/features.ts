import express from 'express';
import { db } from '../utils/db.js';
import * as schema from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const features = await db.select().from(schema.features);
    res.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

router.get('/subcategory/:id', async (req, res) => {
  try {
    const features = await db.select().from(schema.features)
      .where(eq(schema.features.subcategoryId, parseInt(req.params.id)));
    res.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const feature = await db.select().from(schema.features)
      .where(eq(schema.features.id, parseInt(req.params.id)));
    
    if (!feature || feature.length === 0) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    
    res.json(feature[0]);
  } catch (error) {
    console.error('Error fetching feature:', error);
    res.status(500).json({ error: 'Failed to fetch feature' });
  }
});

export default router;
