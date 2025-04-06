import express from 'express';
const router = express.Router();

// Category 3 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 3 data' });
});

export default router;
