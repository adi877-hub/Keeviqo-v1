import express from 'express';
const router = express.Router();

// Category 6 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 6 data' });
});

export default router;
