import express from 'express';
const router = express.Router();

// reminder 3 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 3 data' });
});

export default router;
