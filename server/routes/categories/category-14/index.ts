import express from 'express';
const router = express.Router();

// Category 14 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 14 data' });
});

export default router;
