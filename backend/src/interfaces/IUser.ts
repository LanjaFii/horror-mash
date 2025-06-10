// src/interfaces/IUser.ts
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  favoritePitches: string[];
  createdAt: Date;
}