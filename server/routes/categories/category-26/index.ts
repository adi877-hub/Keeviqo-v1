import express from 'express';
const router = express.Router();

// Category 26 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 26 data' });
});

export default router;
