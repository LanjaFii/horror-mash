import { Request, Response } from 'express';
import Statistics from '../models/Statistics';
import Pitch from '../models/Pitch';

export const getStatistics = async (req: Request, res: Response) => {
  try {
    // Récupérer ou créer les statistiques du jour
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let stats = await Statistics.findOne({ date: today });
    
    if (!stats) {
      // Calculer les statistiques si elles n'existent pas
      const allPitches = await Pitch.find();
      const genresDistribution = {
        Slasher: 0,
        Psychologique: 0,
        Paranormal: 0,
        Gore: 0,
        Survival: 0,
        Folk: 0,
        Cosmique: 0,
        Zombie: 0
      };
      
      allPitches.forEach(pitch => {
        genresDistribution[pitch.genre as keyof typeof genresDistribution]++;
      });
      
      stats = new Statistics({
        date: today,
        pitchesGenerated: allPitches.length,
        genresDistribution,
        totalLikes: allPitches.reduce((sum, pitch) => sum + pitch.likes, 0)
      });
      
      await stats.save();
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};