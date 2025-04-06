import express from 'express';
const router = express.Router();

// Category 50 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 50 data' });
});

export default router;
