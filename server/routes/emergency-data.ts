import express from 'express';
import { db } from '../utils/db.js';
import * as schema from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const emergencyData = {
      user: {
        name: 'דוד כהן',
        id: '123456789',
        dateOfBirth: '1985-05-15',
        address: 'רחוב הרצל 123, תל אביב',
        phone: '052-1234567',
      },
      medicalInfo: {
        bloodType: 'A+',
        allergies: ['פניצילין', 'אגוזים', 'לקטוז'],
        medications: ['אומפרזול 20mg', 'סימבסטטין 10mg'],
        conditions: ['אסתמה', 'לחץ דם גבוה'],
        doctorName: 'ד"ר שרה לוי',
        doctorPhone: '03-7654321',
        insuranceProvider: 'כללית',
        insuranceNumber: '987654321',
      },
      documents: [
        {
          id: 1,
          name: 'כרטיס חבר קופת חולים',
          type: 'PDF',
          url: '/uploads/health_card.pdf',
        },
        {
          id: 2,
          name: 'מרשמים קבועים',
          type: 'PDF',
          url: '/uploads/prescriptions.pdf',
        },
        {
          id: 3,
          name: 'סיכום ביקור אחרון',
          type: 'PDF',
          url: '/uploads/last_visit.pdf',
        },
      ],
    };
    
    res.json(emergencyData);
  } catch (error) {
    console.error('Error fetching emergency data:', error);
    res.status(500).json({ error: 'Failed to fetch emergency data' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { data } = req.body;
    
    
    res.json(data);
  } catch (error) {
    console.error('Error updating emergency data:', error);
    res.status(500).json({ error: 'Failed to update emergency data' });
  }
});

export default router;
