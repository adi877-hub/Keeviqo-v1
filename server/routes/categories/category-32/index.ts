import express from 'express';
const router = express.Router();

// Category 32 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 32 data' });
});

export default router;
