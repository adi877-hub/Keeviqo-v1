import express from 'express';
const router = express.Router();

// Category 1 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 1 data' });
});

export default router;
