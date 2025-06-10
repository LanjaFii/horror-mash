import { Router } from 'express';
import { 
  register,
  login,
  getCurrentUser
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Correction des types pour les handlers
router.post('/register', (req, res, next) => {
  register(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  login(req, res).catch(next);
});

router.get('/me', authenticate, (req, res, next) => {
  getCurrentUser(req, res).catch(next);
});

export default router;