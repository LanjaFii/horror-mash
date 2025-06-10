import { Router } from 'express';
import pitchRoutes from './pitchRoutes';
import authRoutes from './authRoutes';
import statisticsRoutes from './statisticsRoutes';
import exportRoutes from './exportRoutes';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pitches', pitchRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/export', exportRoutes);

export default router;