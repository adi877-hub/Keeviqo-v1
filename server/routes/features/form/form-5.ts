import express from 'express';
const router = express.Router();

// form 5 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 5 data' });
});

export default router;
