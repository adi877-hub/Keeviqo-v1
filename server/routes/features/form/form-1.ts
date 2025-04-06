import express from 'express';
const router = express.Router();

// form 1 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 1 data' });
});

export default router;
