import express from 'express';
const router = express.Router();

// upload 9 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 9 data' });
});

export default router;
