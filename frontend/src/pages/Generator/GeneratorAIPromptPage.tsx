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
        </Box>
      )}
    </Box>
  );
};

export default GeneratorAIPromptPage;
