import express from 'express';
const router = express.Router();

// form 2 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 2 data' });
});

export default router;
