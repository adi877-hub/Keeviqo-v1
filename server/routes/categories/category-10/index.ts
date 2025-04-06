import express from 'express';
const router = express.Router();

// Category 10 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 10 data' });
});

export default router;
