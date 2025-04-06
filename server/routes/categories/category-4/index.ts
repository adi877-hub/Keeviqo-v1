import express from 'express';
const router = express.Router();

// Category 4 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 4 data' });
});

export default router;
