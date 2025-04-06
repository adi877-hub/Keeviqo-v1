import express from 'express';
const router = express.Router();

// Category 18 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 18 data' });
});

export default router;
