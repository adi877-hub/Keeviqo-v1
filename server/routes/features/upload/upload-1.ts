import express from 'express';
const router = express.Router();

// upload 1 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 1 data' });
});

export default router;
