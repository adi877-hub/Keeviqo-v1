import express from 'express';
const router = express.Router();

// Category 66 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 66 data' });
});

export default router;
