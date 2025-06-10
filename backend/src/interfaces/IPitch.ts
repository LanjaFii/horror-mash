import { Document } from 'mongoose';

export interface IPitch extends Document {
  title: string;
  character: string;
  location: string;
  threat: string;
  twist: string;
  genre: string;
  description?: string; // Ajout d'un champ description
  likes: number;
  likedBy: string[]; // IPs ou user IDs
  createdBy?: string; // ID de l'utilisateur si connecté
  createdAt: Date;
}