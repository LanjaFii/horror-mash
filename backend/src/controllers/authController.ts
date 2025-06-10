import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Importez IUser
import { generateToken } from '../config/auth';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'Username or email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser: IUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id.toString());
    res.status(201).json({ token, user: { id: newUser._id, username: newUser.username } });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user: IUser | null = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Reverifiez vos identifiants de connexion' });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: IUser | null = await User.findById((req as any).userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};


export const verifyToken = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};