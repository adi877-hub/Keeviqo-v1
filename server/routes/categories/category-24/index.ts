import express from 'express';
const router = express.Router();

// Category 24 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 24 data' });
});

export default router;
