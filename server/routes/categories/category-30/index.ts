import express from 'express';
const router = express.Router();

// Category 30 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 30 data' });
});

export default router;
