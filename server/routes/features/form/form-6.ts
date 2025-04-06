import express from 'express';
const router = express.Router();

// form 6 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 6 data' });
});

export default router;
