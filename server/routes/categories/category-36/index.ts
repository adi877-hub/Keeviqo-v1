import express from 'express';
const router = express.Router();

// Category 36 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 36 data' });
});

export default router;
