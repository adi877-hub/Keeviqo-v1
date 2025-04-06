import express from 'express';
const router = express.Router();

// Category 22 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 22 data' });
});

export default router;
