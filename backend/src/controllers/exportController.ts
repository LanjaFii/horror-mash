import { Request, Response } from 'express';
import { jsPDF } from 'jspdf';
import Pitch from '../models/Pitch';

export const exportPitchToPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const pitch = await Pitch.findById(req.params.id);
    
    if (!pitch) {
      res.status(404).json({ message: 'Pitch not found' });
      return;
    }

    const doc = new jsPDF();
    
    // Configuration du PDF...
    doc.text(pitch.title, 105, 20, { align: 'center' });
    // ... (ajoutez le reste de votre logique PDF ici)

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=horrormash-${pitch._id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF', error });
  }
};