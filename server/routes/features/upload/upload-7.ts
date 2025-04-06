import express from 'express';
const router = express.Router();

// upload 7 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 7 data' });
});

export default router;
