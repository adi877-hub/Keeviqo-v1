import express from 'express';
const router = express.Router();

// reminder 1 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 1 data' });
});

export default router;
