import express from 'express';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { data, featureId } = req.body;
    
    const userId = 1;
    
    const formData = await db.insert(schema.formData).values({
      data,
      userId,
      featureId: parseInt(featureId),
    }).returning();
    
    res.status(201).json(formData[0]);
  } catch (error) {
    console.error('Error submitting form data:', error);
    res.status(500).json({ error: 'Failed to submit form data' });
  }
});

router.get('/feature/:id', async (req, res) => {
  try {
    const formData = await db.select().from(schema.formData)
      .where(eq(schema.formData.featureId, parseInt(req.params.id)));
    res.json(formData);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ error: 'Failed to fetch form data' });
  }
});

export default router;
