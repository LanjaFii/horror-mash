import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token extrait des en-têtes :', token); // Log pour déboguer

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const decoded = verifyToken(token) as { id: string };
    console.log('Token validé, utilisateur ID :', decoded.id); // Log pour déboguer
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Erreur de validation du token :', error); // Log pour déboguer
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};