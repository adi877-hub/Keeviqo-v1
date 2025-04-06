import express from 'express';
const router = express.Router();

// Category 31 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 31 data' });
});

export default router;
