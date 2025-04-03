import express from 'express';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userId = 1; // Default to user 1 for demo
    
    const contacts = await db.select().from(schema.emergencyContacts)
      .where(eq(schema.emergencyContacts.userId, userId));
    
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    res.status(500).json({ error: 'Failed to fetch emergency contacts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { contacts } = req.body;
    
    if (!Array.isArray(contacts)) {
      return res.status(400).json({ error: 'Invalid contacts data' });
    }
    
    const userId = 1; // Default to user 1 for demo
    
    await db.delete(schema.emergencyContacts)
      .where(eq(schema.emergencyContacts.userId, userId));
    
    const savedContacts = [];
    for (const contact of contacts) {
      const [savedContact] = await db.insert(schema.emergencyContacts)
        .values({
          userId,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          relationship: contact.relationship,
          accessLevel: contact.accessLevel,
        })
        .returning();
      
      savedContacts.push(savedContact);
    }
    
    res.status(201).json(savedContacts);
  } catch (error) {
    console.error('Error saving emergency contacts:', error);
    res.status(500).json({ error: 'Failed to save emergency contacts' });
  }
});

export default router;
