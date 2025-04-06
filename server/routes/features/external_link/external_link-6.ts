import express from 'express';
const router = express.Router();

// external_link 6 routes
router.get('/', (req, res) => {
  res.json({ message: 'external_link 6 data' });
});

export default router;
