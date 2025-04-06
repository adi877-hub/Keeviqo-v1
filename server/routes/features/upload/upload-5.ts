import express from 'express';
const router = express.Router();

// upload 5 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 5 data' });
});

export default router;
