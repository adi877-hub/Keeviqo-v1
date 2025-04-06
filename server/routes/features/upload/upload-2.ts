import express from 'express';
const router = express.Router();

// upload 2 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 2 data' });
});

export default router;
