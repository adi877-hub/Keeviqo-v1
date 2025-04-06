import express from 'express';
const router = express.Router();

// Category 41 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 41 data' });
});

export default router;
