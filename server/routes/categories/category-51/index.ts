import express from 'express';
const router = express.Router();

// Category 51 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 51 data' });
});

export default router;
