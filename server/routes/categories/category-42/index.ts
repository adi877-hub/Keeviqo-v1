import express from 'express';
const router = express.Router();

// Category 42 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 42 data' });
});

export default router;
