import express from 'express';
const router = express.Router();

// upload 8 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 8 data' });
});

export default router;
