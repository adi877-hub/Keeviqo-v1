import express from 'express';
const router = express.Router();

// Category 27 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 27 data' });
});

export default router;
