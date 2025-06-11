import { Router } from 'express';
import { 
  register,
  login,
  getCurrentUser,
  verifyToken
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', (req, res, next) => {
  register(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  login(req, res).catch(next);
});

router.get('/me', authenticate, (req, res, next) => {
  getCurrentUser(req, res).catch(next);
});

// Route de vérification du token pour le frontend
router.get('/verify', authenticate, (req, res) => {
  verifyToken(req, res);
});

export default router;