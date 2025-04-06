import express from 'express';
const router = express.Router();

// reminder 8 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 8 data' });
});

export default router;
