import { Router } from 'express';
import { 
  generatePitch, 
  likePitch, 
  getPopularPitches,
  searchPitches,
  generateAIPitch 
} from '../controllers/pitchController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/generate', authenticate, generatePitch);
router.put('/like/:id', authenticate, likePitch);
router.get('/popular', getPopularPitches);
router.get('/search', searchPitches);
router.post('/generate-ai', generateAIPitch);

export default router;