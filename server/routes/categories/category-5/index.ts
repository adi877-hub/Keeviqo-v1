import express from 'express';
const router = express.Router();

// Category 5 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 5 data' });
});

export default router;
