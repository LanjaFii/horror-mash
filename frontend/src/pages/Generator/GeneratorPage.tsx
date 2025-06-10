import { useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { PictureAsPdf } from '@mui/icons-material';

const GeneratorPage = () => {
  const [pitch, setPitch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNewPitch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        'http://localhost:5000/api/pitches/generate',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setPitch(response.data);
    } catch (error) {
      console.error('Error generating pitch:', error);
      setError(error.response?.data?.message || 'Failed to generate pitch');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async (pitchId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      setLoading(true);
      setError(null);

      // Vérification avant requête
      if (!pitchId || !/^[0-9a-fA-F]{24}$/.test(pitchId)) {
        throw new Error('Invalid pitch ID format');
      }

      const response = await axios.get(
        `http://localhost:5000/api/export/pdf/${pitchId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: 15000
        }
      );

      // Vérification robuste de la réponse
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty PDF received');
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `horrormash-pitch-${pitchId}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Nettoyage optimisé
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error('Export error:', error);
      
      // Gestion d'erreur précise
      let errorMsg = 'Export failed';
      if (error.message.includes('Network Error')) {
        errorMsg = 'Server connection failed - try again later';
      } else if (error.response?.status === 401) {
        errorMsg = 'Session expired - please login again';
      } else if (error.message.includes('Empty PDF')) {
        errorMsg = 'PDF generation error - try another pitch';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

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
        
        {pitch && (
          <>
            <Card sx={{ mb: 3 }}>
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
            
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => exportToPDF(pitch._id)}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PictureAsPdf />}
              fullWidth
              sx={{ mb: 3 }}
            >
              {loading ? 'Generation du PDF...' : 'Exporter en PDF'}
            </Button>
          </>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default GeneratorPage;