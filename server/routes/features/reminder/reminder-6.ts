import express from 'express';
const router = express.Router();

// reminder 6 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 6 data' });
});

export default router;
