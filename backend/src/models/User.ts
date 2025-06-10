import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/IUser'; // Importez l'interface

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoritePitches: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Exportez à la fois le modèle et l'interface
export { IUser };
export default model<IUser>('User', userSchema);