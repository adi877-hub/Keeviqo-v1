import express from 'express';
const router = express.Router();

// Category 12 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 12 data' });
});

export default router;
