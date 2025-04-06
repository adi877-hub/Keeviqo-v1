import express from 'express';
const router = express.Router();

// Category 71 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 71 data' });
});

export default router;
