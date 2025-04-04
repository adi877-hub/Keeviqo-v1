import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { eq } from 'drizzle-orm';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { featureId, metadata } = req.body;
    
    const userId = 1;
    
    const document = await db.insert(schema.documents).values({
      name: req.file.originalname,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      userId,
      featureId: parseInt(featureId),
      metadata: metadata ? JSON.parse(metadata) : {},
    }).returning();
    
    res.status(201).json(document[0]);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

router.get('/feature/:id', async (req, res) => {
  try {
    const documents = await db.select().from(schema.documents)
      .where(eq(schema.documents.featureId, parseInt(req.params.id)));
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

export default router;
