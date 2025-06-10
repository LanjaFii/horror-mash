import { Router } from 'express';
import { exportPitchToPDF } from '../controllers/exportController';

const router = Router();

// Solution 1: Envelopper dans une fonction middleware standard
router.get('/pdf/:id', (req, res, next) => {
  exportPitchToPDF(req, res).catch(next);
});

// Solution alternative 2: Si vous préférez une approche plus concise
// router.get('/pdf/:id', (req, res) => exportPitchToPDF(req, res));

export default router;