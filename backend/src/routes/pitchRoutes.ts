import { Router } from 'express';
import { 
  generatePitch, 
  likePitch, 
  getPopularPitches,
  searchPitches,
  generateAIPitch,
  publishAIPitch 
} from '../controllers/pitchController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/generate', authenticate, generatePitch);
router.put('/like/:id', authenticate, likePitch);
router.get('/popular', getPopularPitches);
router.get('/search', searchPitches);
router.post('/generate-ai', generateAIPitch);
router.post('/publish-ai', authenticate, publishAIPitch);

export default router;