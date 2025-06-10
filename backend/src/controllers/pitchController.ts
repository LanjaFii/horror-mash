import { Request, Response } from 'express';
import Pitch from '../models/Pitch';
import { AuthenticatedRequest } from '../middlewares/auth';

// Éléments aléatoires étendus
const characters = [
  'Adolescent rebelle', 'Journaliste curieux', 'Scientifique fou', 
  'Détective privé', 'Famille en vacances', 'Groupe d\'amis'
];
const locations = [
  'Maison abandonnée', 'Petite ville isolée', 'Hôpital psychiatrique', 
  'Forêt maudite', 'Station spatiale', 'Village côtier'
];
const threats = [
  'Tueur masqué', 'Esprit vengeur', 'Secte secrète', 
  'Expérience scientifique', 'Malédiction ancienne', 'Aliens'
];
const twists = [
  'Le héros était mort depuis le début', 'C\'était un rêve', 
  'Le monstre était en lui', 'Tout était un plan du gouvernement',
  'Le vrai monstre était l\'humanité', 'Ils étaient dans une boucle temporelle'
];

export const generatePitch = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    const randomTwist = twists[Math.floor(Math.random() * twists.length)];
    
    const genres = ['Slasher', 'Psychologique', 'Paranormal', 'Gore', 'Survival', 'Folk'];
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    
    const title = `Horreur à ${randomLocation}`;
    const description = `Un ${randomCharacter} se retrouve dans ${randomLocation}, confronté à ${randomThreat}. ${randomTwist}!`;
    
    const newPitch = new Pitch({
      title,
      character: randomCharacter,
      location: randomLocation,
      threat: randomThreat,
      twist: randomTwist,
      genre: randomGenre,
      description,
      createdBy: req.userId // Lier le pitch à l'utilisateur si connecté
    });
    
    await newPitch.save();
    
    res.status(201).json(newPitch);
  } catch (error) {
    res.status(500).json({ message: 'Error generating pitch', error });
  }
};



export const likePitch = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    const pitchId = req.params.id;
    const userId = req.userId; // Peut être undefined si non connecté
    const userIp = req.ip; // Normalement toujours défini par Express

    if (!userIp) {
      res.status(400).json({ message: 'Unable to identify request origin' });
      return;
    }

    const pitch = await Pitch.findById(pitchId);
    if (!pitch) {
      res.status(404).json({ message: 'Pitch not found' });
      return;
    }

    // Utilisation de l'userId si connecté, sinon userIp
    const identifier = userId || userIp;

    // Vérification que identifier est bien une string
    if (typeof identifier !== 'string') {
      res.status(400).json({ message: 'Invalid identifier' });
      return;
    }

    const hasLiked = pitch.likedBy.includes(identifier);

    if (hasLiked) {
      pitch.likes -= 1;
      pitch.likedBy = pitch.likedBy.filter(id => id !== identifier);
    } else {
      pitch.likes += 1;
      pitch.likedBy.push(identifier);
    }

    await pitch.save();
    res.json({ likes: pitch.likes, hasLiked: !hasLiked });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Error updating like', error });
  }
};


export const searchPitches = async (req: Request, res: Response) => {
  try {
    const { query, genre, sortBy } = req.query;
    
    const filter: any = {};
    
    if (query) {
      filter.$text = { $search: query };
    }
    
    if (genre && genre !== 'Tous') {
      filter.genre = genre;
    }
    
    let sortOption: any = { createdAt: -1 }; // Par défaut: plus récents d'abord
    
    if (sortBy === 'popular') {
      sortOption = { likes: -1 };
    } else if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    }
    
    const pitches = await Pitch.find(filter)
      .sort(sortOption)
      .limit(50);
    
    res.json(pitches);
  } catch (error) {
    res.status(500).json({ message: 'Error searching pitches', error });
  }
};


export const getPopularPitches = async (req: Request, res: Response) => {
  try {
    const popularPitches = await Pitch.find()
      .sort({ likes: -1 })
      .limit(5);
    
    res.json(popularPitches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular pitches', error });
  }
};