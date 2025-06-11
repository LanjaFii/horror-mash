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

    // Style horreur : fond noir, texte rouge/orange, police monospace, titre stylé
    // Fond noir
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, 210, 297, 'F');

    // Titre stylé sanglant
    doc.setFont('courier', 'bold');
    doc.setTextColor(255, 36, 0); // Rouge sang
    doc.setFontSize(28);
    doc.text(pitch.title.toUpperCase(), 105, 28, { align: 'center' });
    // Effet goutte de sang sous le titre
    doc.setDrawColor(255, 36, 0);
    doc.setFillColor(255, 36, 0);
    doc.ellipse(105, 34, 3, 6, 'FD');

    let y = 50;
    const sectionTitleColor = [255, 87, 34]; // Orange sang
    const sectionTextColor = [255, 255, 255]; // Blanc
    const addSection = (title: string, content: string) => {
      doc.setFont('courier', 'bold');
      doc.setFontSize(11); // plus petit
      doc.setTextColor(sectionTitleColor[0], sectionTitleColor[1], sectionTitleColor[2]);
      doc.text(title + ' :', 20, y);
      doc.setFont('courier', 'normal');
      doc.setFontSize(9); // plus petit
      doc.setTextColor(sectionTextColor[0], sectionTextColor[1], sectionTextColor[2]);
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 30, y + 5);
      y += lines.length * 5 + 10;
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