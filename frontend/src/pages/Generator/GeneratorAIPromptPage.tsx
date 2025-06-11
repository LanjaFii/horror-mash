import { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const genres = [
  'Slasher', 'Psychologique', 'Paranormal', 'Gore', 'Survival', 'Folk', 'Cosmique', 'Zombie'
];

const GeneratorAIPromptPage = () => {
  const [genre, setGenre] = useState('Slasher');
  const [lieu, setLieu] = useState('');
  const [antagoniste, setAntagoniste] = useState('');
  const [protagoniste, setProtagoniste] = useState('');
  const [finHeureuse, setFinHeureuse] = useState('oui');
  const [pitch, setPitch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState('');
  const [publishError, setPublishError] = useState('');
  const [publishedPitchId, setPublishedPitchId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPitch('');
    try {
      const response = await axios.post('http://localhost:5000/api/pitches/generate-ai', {
        genre,
        lieu,
        antagoniste,
        protagoniste,
        finHeureuse: finHeureuse === 'oui'
      });
      setPitch(response.data.pitch);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la génération du pitch.');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async (pitchId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentification requise');
      const response = await axios.get(
        `http://localhost:5000/api/export/pdf/${pitchId}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `horrormash-pitch-${pitchId}.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      setPublishError('Erreur lors de l’export PDF.');
    }
  };

  const handlePublish = async () => {
    setPublishLoading(true);
    setPublishSuccess('');
    setPublishError('');
    setPublishedPitchId(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentification requise');
      const response = await axios.post(
        'http://localhost:5000/api/pitches/publish-ai',
        {
          genre,
          lieu,
          antagoniste,
          protagoniste,
          finHeureuse: finHeureuse === 'oui',
          pitch
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPublishSuccess('Pitch publié avec succès !');
      setPublishedPitchId(response.data._id);
      // Déclenche l'export PDF automatiquement
      await exportPDF(response.data._id);
    } catch (err: any) {
      setPublishError(err.response?.data?.message || 'Erreur lors de la publication.');
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={5}>
      <Typography variant="h4" gutterBottom>Générer un pitch IA personnalisé</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Genre"
          value={genre}
          onChange={e => setGenre(e.target.value)}
          fullWidth
          margin="normal"
        >
          {genres.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </TextField>
        <TextField
          label="Lieu"
          value={lieu}
          onChange={e => setLieu(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Antagoniste"
          value={antagoniste}
          onChange={e => setAntagoniste(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Protagoniste"
          value={protagoniste}
          onChange={e => setProtagoniste(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Fin heureuse ?"
          value={finHeureuse}
          onChange={e => setFinHeureuse(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="oui">Oui</MenuItem>
          <MenuItem value="non">Non</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Générer le pitch'}
        </Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {pitch && (
        <Box mt={4} p={2} bgcolor="#222" borderRadius={2}>
          <Typography variant="h6">Pitch généré :</Typography>
          <Typography>{pitch}</Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={handlePublish}
            disabled={publishLoading}
            fullWidth
          >
            {publishLoading ? <CircularProgress size={20} /> : 'Publier le pitch'}
          </Button>
          {publishSuccess && <Alert severity="success" sx={{ mt: 2 }}>{publishSuccess}</Alert>}
          {publishError && <Alert severity="error" sx={{ mt: 2 }}>{publishError}</Alert>}
        </Box>
      )}
    </Box>
  );
};

export default GeneratorAIPromptPage;
