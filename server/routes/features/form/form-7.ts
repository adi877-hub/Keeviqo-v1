import express from 'express';
const router = express.Router();

// form 7 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 7 data' });
});

export default router;
