import express from 'express';
const router = express.Router();

// reminder 4 routes
router.get('/', (req, res) => {
  res.json({ message: 'reminder 4 data' });
});

export default router;
