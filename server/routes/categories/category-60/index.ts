import express from 'express';
const router = express.Router();

// Category 60 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 60 data' });
});

export default router;
