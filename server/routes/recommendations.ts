import express from 'express';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { requirePermission, PermissionLevel } from '../middleware/role-based-access';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const recommendations = [
      {
        id: 'health-checkup-reminder',
        title: 'Annual Health Checkup',
        description: 'It\'s been almost a year since your last health checkup. Schedule an appointment with your doctor.',
        category: 'Health',
        priority: 'high',
        actionType: 'reminder',
        actionPath: '/feature/reminder/new?title=Annual%20Health%20Checkup',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      },
      {
        id: 'tax-documents-upload',
        title: 'Tax Documents',
        description: 'Tax filing season is approaching. Start uploading your tax documents to keep them organized.',
        category: 'Finance',
        priority: 'medium',
        actionType: 'document',
        actionPath: '/feature/upload/new?category=Finance',
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days from now
      },
      {
        id: 'passport-renewal',
        title: 'Passport Renewal',
        description: 'Your passport will expire in 6 months. Start the renewal process now to avoid travel issues.',
        category: 'Travel',
        priority: 'medium',
        actionType: 'form',
        actionPath: '/feature/form/passport-renewal',
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 180 days from now
      },
      {
        id: 'home-insurance-review',
        title: 'Home Insurance Review',
        description: 'It\'s a good time to review your home insurance policy to ensure you have adequate coverage.',
        category: 'Insurance',
        priority: 'low',
        actionType: 'link',
        actionPath: '/feature/external_link/insurance-review',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
      },
      {
        id: 'child-education-grant',
        title: 'Education Grant Opportunity',
        description: 'Based on your child\'s age, you may be eligible for an education grant. Apply now before the deadline.',
        category: 'Children',
        priority: 'high',
        actionType: 'grant',
        actionPath: '/grants/education',
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days from now
      }
    ];
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

router.post('/', requirePermission('recommendations', PermissionLevel.WRITE), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      actionType,
      actionPath,
      expiresAt
    } = req.body;
    
    if (!title || !category || !actionType || !actionPath) {
      return res.status(400).json({ error: 'Title, category, actionType, and actionPath are required' });
    }
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const newRecommendation = {
      id: `custom-${Date.now()}`,
      title,
      description,
      category,
      priority: priority || 'medium',
      actionType,
      actionPath,
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default 30 days
    };
    
    res.status(201).json(newRecommendation);
  } catch (error) {
    console.error('Error creating recommendation:', error);
    res.status(500).json({ error: 'Failed to create recommendation' });
  }
});

router.post('/:id/dismiss', async (req, res) => {
  try {
    const { id } = req.params;
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    
    res.json({ success: true, message: 'Recommendation dismissed' });
  } catch (error) {
    console.error('Error dismissing recommendation:', error);
    res.status(500).json({ error: 'Failed to dismiss recommendation' });
  }
});

export default router;
