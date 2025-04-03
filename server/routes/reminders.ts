import express from 'express';
import { db } from '../utils/db.js';
import * as schema from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { title, description, frequency, date, featureId } = req.body;
    
    const userId = 1;
    
    const reminder = await db.insert(schema.reminders).values({
      title,
      description,
      frequency,
      date: new Date(date),
      userId,
      featureId: parseInt(featureId),
      completed: false,
    }).returning();
    
    res.status(201).json(reminder[0]);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

router.get('/feature/:id', async (req, res) => {
  try {
    const reminders = await db.select().from(schema.reminders)
      .where(eq(schema.reminders.featureId, parseInt(req.params.id)));
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, frequency, date, completed } = req.body;
    
    const reminder = await db.update(schema.reminders)
      .set({
        title,
        description,
        frequency,
        date: new Date(date),
        completed,
      })
      .where(eq(schema.reminders.id, parseInt(req.params.id)))
      .returning();
    
    if (!reminder || reminder.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json(reminder[0]);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

export default router;
