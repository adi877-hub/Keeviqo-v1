import express from 'express';
const router = express.Router();

// Category 13 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 13 data' });
});

export default router;
