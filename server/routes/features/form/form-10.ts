import express from 'express';
const router = express.Router();

// form 10 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 10 data' });
});

export default router;
