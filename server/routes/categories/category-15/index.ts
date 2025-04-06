import express from 'express';
const router = express.Router();

// Category 15 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 15 data' });
});

export default router;
