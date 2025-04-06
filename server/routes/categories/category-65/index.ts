import express from 'express';
const router = express.Router();

// Category 65 routes
router.get('/', (req, res) => {
  res.json({ message: 'Category 65 data' });
});

export default router;
