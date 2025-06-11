import { Schema, model } from 'mongoose';
import { IPitch } from '../interfaces/IPitch';

const pitchSchema = new Schema<IPitch>({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  character: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [50, 'Le personnage ne peut pas dépasser 50 caractères']
  },
  location: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [50, 'Le lieu ne peut pas dépasser 50 caractères']
  },
  threat: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [50, 'La menace ne peut pas dépasser 50 caractères']
  },
  twist: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [200, 'Le twist ne peut pas dépasser 200 caractères']
  },
  genre: { 
    type: String, 
    required: true,
    enum: {
      values: ['Slasher', 'Psychologique', 'Paranormal', 'Gore', 'Survival', 'Folk', 'Cosmique', 'Zombie'],
      message: 'Genre non valide'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
    default: ''
  },
  likes: { 
    type: Number, 
    default: 0,
    min: [0, 'Le nombre de likes ne peut pas être négatif']
  },
  likedBy: { 
    type: [String], 
    default: [],
    select: false // Masqué par défaut dans les résultats
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true // Ne peut pas être modifié après création
  }
}, {
  toJSON: { virtuals: true }, // Pour inclure les virtuals lors de la conversion en JSON
  toObject: { virtuals: true } // Pour inclure les virtuals lors de la conversion en objet
});

// Index pour les recherches fréquentes
pitchSchema.index({ title: 'text', description: 'text' });
pitchSchema.index({ genre: 1 });
pitchSchema.index({ likes: -1 });

// Virtual pour calculer si un pitch est populaire
pitchSchema.virtual('isPopular').get(function() {
  return this.likes >= 10;
});

// Middleware pour mettre à jour les statistiques après sauvegarde
pitchSchema.post('save', async function(doc) {
  // Ici vous pourriez ajouter la logique pour mettre à jour les statistiques
});

export default model<IPitch>('Pitch', pitchSchema);