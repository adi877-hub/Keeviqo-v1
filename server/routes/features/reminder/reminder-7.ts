import express from 'express';
const router = express.Router();

// reminder 7 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 7 data' });
});

export default router;
