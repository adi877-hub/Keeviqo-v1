import express from 'express';
const router = express.Router();

// Category 64 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 64 data' });
});

export default router;
