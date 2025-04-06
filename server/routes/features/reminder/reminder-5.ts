import express from 'express';
const router = express.Router();

// reminder 5 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 5 data' });
});

export default router;
