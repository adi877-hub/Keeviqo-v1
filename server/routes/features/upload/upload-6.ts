import express from 'express';
const router = express.Router();

// upload 6 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 6 data' });
});

export default router;
