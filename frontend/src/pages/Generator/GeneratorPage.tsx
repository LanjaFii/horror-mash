import { useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';

const GeneratorPage = () => {
  const [pitch, setPitch] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateNewPitch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/pitches/generate');
      setPitch(response.data);
    } catch (error) {
      console.error('Error generating pitch:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async (pitchId: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/export/pdf/${pitchId}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `horrormash-pitch-${pitchId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    // Afficher une notification d'erreur
  }
};

// Utilisation dans un bouton:
<Button onClick={() => exportToPDF(pitch._id)}>Exporter PDF</Button>

  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid item xs={12} md={8}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={generateNewPitch}
          disabled={loading}
          fullWidth
          sx={{ mb: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Générer un nouveau pitch'}
        </Button>
        <Button onClick={() => exportToPDF(pitch._id)}>Exporter PDF</Button>
        
        {pitch && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {pitch.title}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Personnage:</strong> {pitch.character}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Lieu:</strong> {pitch.location}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Menace:</strong> {pitch.threat}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Twist final:</strong> {pitch.twist}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Genre:</strong> {pitch.genre}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default GeneratorPage;