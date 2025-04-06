import express from 'express';
const router = express.Router();

// Category 23 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 23 data' });
});

export default router;
