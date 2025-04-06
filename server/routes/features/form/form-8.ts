import express from 'express';
const router = express.Router();

// form 8 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 8 data' });
});

export default router;
