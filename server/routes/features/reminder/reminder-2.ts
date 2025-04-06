import express from 'express';
const router = express.Router();

// reminder 2 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 2 data' });
});

export default router;
