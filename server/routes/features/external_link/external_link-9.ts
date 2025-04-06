import express from 'express';
const router = express.Router();

// external_link 9 routes
router.get('/', (req, res) => {
  res.json({ message: 'external_link 9 data' });
});

export default router;
