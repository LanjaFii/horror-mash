import { Schema, model } from 'mongoose';
import { IStatistics } from '../interfaces/IStatistics';

const statisticsSchema = new Schema<IStatistics>({
  date: { type: Date, required: true, unique: true, default: Date.now },
  pitchesGenerated: { type: Number, default: 0 },
  genresDistribution: {
    Slasher: { type: Number, default: 0 },
    Psychologique: { type: Number, default: 0 },
    Paranormal: { type: Number, default: 0 },
    Gore: { type: Number, default: 0 },
    Survival: { type: Number, default: 0 },
    Folk: { type: Number, default: 0 },
    Cosmique: { type: Number, default: 0 },
    Zombie: { type: Number, default: 0 }
  },
  totalLikes: { type: Number, default: 0 }
});

export default model<IStatistics>('Statistics', statisticsSchema);