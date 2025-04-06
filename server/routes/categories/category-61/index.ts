import express from 'express';
const router = express.Router();

// Category 61 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 61 data' });
});

export default router;
