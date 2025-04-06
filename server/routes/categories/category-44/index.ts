import express from 'express';
const router = express.Router();

// Category 44 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 44 data' });
});

export default router;
