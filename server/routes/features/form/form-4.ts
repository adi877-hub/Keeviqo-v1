import express from 'express';
const router = express.Router();

// form 4 routes
router.get('/', (req, res) => {
  res.json({ message: 'form 4 data' });
});

export default router;
