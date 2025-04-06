import express from 'express';
const router = express.Router();

// form 9 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 9 data' });
});

export default router;
