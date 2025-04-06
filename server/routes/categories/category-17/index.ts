import express from 'express';
const router = express.Router();

// Category 17 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 17 data' });
});

export default router;
