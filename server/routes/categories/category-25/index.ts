import express from 'express';
const router = express.Router();

// Category 25 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 25 data' });
});

export default router;
