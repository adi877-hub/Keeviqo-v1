import express from 'express';
const router = express.Router();

// upload 3 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 3 data' });
});

export default router;
