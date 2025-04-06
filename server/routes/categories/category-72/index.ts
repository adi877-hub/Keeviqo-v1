import express from 'express';
const router = express.Router();

// Category 72 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 72 data' });
});

export default router;
