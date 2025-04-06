import express from 'express';
const router = express.Router();

// Category 21 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 21 data' });
});

export default router;
