import express from 'express';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads/qrcodes');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post('/generate', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }
    
    const filename = `${uuidv4()}.png`;
    const filePath = path.join(uploadsDir, filename);
    
    await QRCode.toFile(filePath, data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
    });
    
    const qrCodeUrl = `/uploads/qrcodes/${filename}`;
    
    res.json({ qrCodeUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export default router;
