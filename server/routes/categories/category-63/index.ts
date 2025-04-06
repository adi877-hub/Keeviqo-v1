import express from 'express';
const router = express.Router();

// Category 63 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 63 data' });
});

export default router;
