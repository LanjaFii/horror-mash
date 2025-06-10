import { Document } from 'mongoose';

export interface IStatistics extends Document {
  date: Date;
  pitchesGenerated: number;
  genresDistribution: {
    Slasher: number;
    Psychologique: number;
    Paranormal: number;
    Gore: number;
    Survival: number;
    Folk: number;
    Cosmique: number;
    Zombie: number;
  };
  totalLikes: number;
}