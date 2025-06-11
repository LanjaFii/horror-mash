import { Request, Response } from 'express';
import { jsPDF } from 'jspdf';
import Pitch from '../models/Pitch';
import User from '../models/User';

export const exportPitchToPDF = async (req: Request, res: Response) => {
  try {
    console.log('Début génération PDF'); // Log de débogage
    
    const pitch = await Pitch.findById(req.params.id);
    if (!pitch) {
      console.log('Pitch non trouvé:', req.params.id);
      return res.status(404).send('Pitch not found');
    }

    let owner: any = null;
    if (pitch.createdBy) {
      owner = await User.findById(pitch.createdBy);
    }

    const doc = new jsPDF();
    doc.setProperties({
      title: `Pitch HorrorMash - ${pitch.title}`,
      creator: 'HorrorMash'
    });
    doc.setFontSize(20);
    doc.text(pitch.title, 105, 20, { align: 'center' });
    let y = 40;
    const addSection = (title: string, content: string) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title + ':', 20, y);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 30, y + 7);
      y += lines.length * 7 + 15;
    };

    // Si c'est un pitch IA (description non vide), on ajoute prompts + pitch + infos user
    if (pitch.description && pitch.description.length > 0) {
      addSection('Pitch IA généré', pitch.description);
      addSection('Genre', pitch.genre);
      addSection('Personnage', pitch.character);
      addSection('Lieu', pitch.location);
      addSection('Antagoniste', pitch.threat);
      addSection('Twist final', pitch.twist);
      if (owner) {
        addSection('Propriétaire', `${owner.username} (${owner.email})`);
      }
    } else {
      addSection('Genre', pitch.genre);
      addSection('Personnage', pitch.character);
      addSection('Lieu', pitch.location);
      addSection('Menace', pitch.threat);
      addSection('Twist final', pitch.twist);
    }

    // Générer le PDF
    const pdfBuffer = doc.output('arraybuffer');
    console.log('PDF généré - Taille:', pdfBuffer.byteLength); // Log de débogage

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=horrormash-${pitch._id}.pdf`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Erreur génération PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};