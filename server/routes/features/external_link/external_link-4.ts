import express from 'express';
const router = express.Router();

// external_link 4 routes
router.get('/', (req, res) => {
  res.json({ message: 'external_link 4 data' });
});

export default router;
