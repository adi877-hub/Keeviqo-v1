import express from 'express';
const router = express.Router();

// Category 2 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 2 data' });
});

export default router;
