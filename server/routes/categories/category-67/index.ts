import express from 'express';
const router = express.Router();

// Category 67 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 67 data' });
});

export default router;
