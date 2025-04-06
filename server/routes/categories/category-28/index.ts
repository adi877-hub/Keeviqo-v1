import express from 'express';
const router = express.Router();

// Category 28 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 28 data' });
});

export default router;
