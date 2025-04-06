import express from 'express';
const router = express.Router();

// form 3 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 3 data' });
});

export default router;
