import { Router } from 'express';
import pitchRoutes from './pitchRoutes';
import authRoutes from './authRoutes';
import statisticsRoutes from './statisticsRoutes';
import exportRoutes from './exportRoutes';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Ajout de logs pour diagnostiquer les requêtes
router.use((req, res, next) => {
    console.log('Requête reçue :', req.method, req.url);
    next();
});

router.use('/auth', authRoutes);
router.use('/pitches', pitchRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/export', exportRoutes);

export default router;