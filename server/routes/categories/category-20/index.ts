import express from 'express';
const router = express.Router();

// Category 20 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 20 data' });
});

export default router;
