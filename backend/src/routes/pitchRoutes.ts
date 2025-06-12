import { Router } from 'express';
import { 
  generatePitch, 
  likePitch, 
  getPopularPitches,
  searchPitches,
  generateAIPitch,
  publishAIPitch 
} from '../controllers/pitchController';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

router.post('/generate', authenticate, generatePitch);
router.put('/like/:id', authenticate, likePitch);
router.get('/popular', getPopularPitches);
router.get('/search', searchPitches);
router.post('/generate-ai', generateAIPitch);
router.post('/publish-ai', authenticate, publishAIPitch);

// Handler séparé pour Express/TS
const getUserPitchs = async (req: AuthenticatedRequest, res: any): Promise<void> => {
  try {
    const userId = req.userId;
    console.log('Route /mes-pitchs appelée');
    console.log('Utilisateur authentifié :', userId);
    if (!userId) {
      res.status(401).json({ message: 'Non authentifié' });
      return;
    }
    const pitchs = await (await import('../models/Pitch')).default.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.json(pitchs);
  } catch (e) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos pitchs.' });
  }
};

// Nouvelle route pour les pitchs de l'utilisateur connecté
router.get('/mes-pitchs', authenticate, getUserPitchs);

export default router;