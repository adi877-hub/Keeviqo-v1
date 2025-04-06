import express from 'express';
const router = express.Router();

// Category 8 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 8 data' });
});

export default router;
