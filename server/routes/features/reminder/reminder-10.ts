import express from 'express';
const router = express.Router();

// reminder 10 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 10 data' });
});

export default router;
