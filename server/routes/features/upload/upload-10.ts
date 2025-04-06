import express from 'express';
const router = express.Router();

// upload 10 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 10 data' });
});

export default router;
