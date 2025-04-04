import express from 'express';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { requirePermission, PermissionLevel } from '../middleware/role-based-access';
import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

const router = express.Router();

router.get('/user/context', async (req, res) => {
  try {
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userContext = {
      recentCategories: ['Health', 'Finance', 'Legal'],
      upcomingEvents: [
        {
          title: 'Health Insurance Renewal',
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
          category: 'Health'
        },
        {
          title: 'Tax Filing Deadline',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          category: 'Finance'
        }
      ],
      documentUpdates: [
        {
          documentId: 1,
          name: 'Passport',
          category: 'Travel',
          lastUpdated: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString() // 200 days ago
        },
        {
          documentId: 2,
          name: 'Will',
          category: 'Legal',
          lastUpdated: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString() // 300 days ago
        }
      ],
      seasonalEvents: [
        'Annual Health Checkup',
        'Car Insurance Renewal',
        'Home Insurance Review'
      ],
      locationBasedSuggestions: [
        'Update Local Emergency Contacts',
        'Review Local Healthcare Providers'
      ]
    };
    
    res.json(userContext);
  } catch (error) {
    console.error('Error fetching user context:', error);
    res.status(500).json({ error: 'Failed to fetch user context' });
  }
});

router.post('/reminders/context-aware', requirePermission('reminders', PermissionLevel.WRITE), async (req, res) => {
  try {
    const {
      title,
      description,
      frequency,
      date,
      priority,
      contextTriggers,
      category,
      relatedDocuments
    } = req.body;
    
    if (!title || !frequency || !date) {
      return res.status(400).json({ error: 'Title, frequency, and date are required' });
    }
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const [newReminder] = await db.insert(schema.reminders).values({
      title,
      description: description || null,
      frequency,
      date: new Date(date),
      userId,
      featureId: null, // This could be linked to a feature if needed
      completed: false,
      metadata: {
        priority,
        contextTriggers,
        category,
        relatedDocuments
      }
    }).returning();
    
    const reminderResponse = {
      id: newReminder.id,
      title: newReminder.title,
      description: newReminder.description,
      frequency: newReminder.frequency,
      date: newReminder.date ? newReminder.date.toISOString() : null,
      completed: newReminder.completed,
      priority: priority || 'medium',
      contextTriggers: contextTriggers || [],
      category,
      relatedDocuments
    };
    
    res.status(201).json(reminderResponse);
  } catch (error) {
    console.error('Error creating context-aware reminder:', error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

router.get('/reminders/user', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userReminders = await db.select().from(schema.reminders)
      .where(eq(schema.reminders.userId, userId))
      .orderBy(desc(schema.reminders.date));
    
    const formattedReminders = userReminders.map(reminder => {
      const metadata = reminder.metadata as any || {};
      
      return {
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        frequency: reminder.frequency,
        date: reminder.date ? reminder.date.toISOString() : null,
        completed: reminder.completed,
        priority: metadata.priority || 'medium',
        contextTriggers: metadata.contextTriggers || [],
        category: metadata.category,
        relatedDocuments: metadata.relatedDocuments
      };
    });
    
    res.json(formattedReminders);
  } catch (error) {
    console.error('Error fetching user reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

router.put('/reminders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const existingReminder = await db.select().from(schema.reminders)
      .where(and(
        eq(schema.reminders.id, parseInt(id)),
        eq(schema.reminders.userId, userId)
      ));
    
    if (!existingReminder || existingReminder.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.frequency !== undefined) updateData.frequency = updates.frequency;
    if (updates.date !== undefined) updateData.date = new Date(updates.date);
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    
    const currentMetadata = existingReminder[0].metadata as any || {};
    let metadataUpdated = false;
    
    if (updates.priority !== undefined) {
      currentMetadata.priority = updates.priority;
      metadataUpdated = true;
    }
    
    if (updates.contextTriggers !== undefined) {
      currentMetadata.contextTriggers = updates.contextTriggers;
      metadataUpdated = true;
    }
    
    if (updates.category !== undefined) {
      currentMetadata.category = updates.category;
      metadataUpdated = true;
    }
    
    if (updates.relatedDocuments !== undefined) {
      currentMetadata.relatedDocuments = updates.relatedDocuments;
      metadataUpdated = true;
    }
    
    if (metadataUpdated) {
      updateData.metadata = currentMetadata;
    }
    
    const [updatedReminder] = await db.update(schema.reminders)
      .set(updateData)
      .where(and(
        eq(schema.reminders.id, parseInt(id)),
        eq(schema.reminders.userId, userId)
      ))
      .returning();
    
    if (!updatedReminder) {
      return res.status(404).json({ error: 'Failed to update reminder' });
    }
    
    const metadata = updatedReminder.metadata as any || {};
    const reminderResponse = {
      id: updatedReminder.id,
      title: updatedReminder.title,
      description: updatedReminder.description,
      frequency: updatedReminder.frequency,
      date: updatedReminder.date ? updatedReminder.date.toISOString() : null,
      completed: updatedReminder.completed,
      priority: metadata.priority || 'medium',
      contextTriggers: metadata.contextTriggers || [],
      category: metadata.category,
      relatedDocuments: metadata.relatedDocuments
    };
    
    res.json(reminderResponse);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

router.delete('/reminders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const deletedCount = await db.delete(schema.reminders)
      .where(and(
        eq(schema.reminders.id, parseInt(id)),
        eq(schema.reminders.userId, userId)
      ));
    
    if (!deletedCount) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

export default router;
