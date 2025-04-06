import express from 'express';
const router = express.Router();

// reminder 9 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 9 data' });
});

export default router;
