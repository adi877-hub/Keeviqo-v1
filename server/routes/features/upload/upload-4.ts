import express from 'express';
const router = express.Router();

// upload 4 routes
router.get('/', (req, res) => {
  res.json({ message: 'upload 4 data' });
});

export default router;
