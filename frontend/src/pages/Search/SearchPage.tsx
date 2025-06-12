import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Grid,
  Card,
  CardContent,
  Typography 
} from '@mui/material';
import axios from 'axios';

const genres = [
  'Tous',
  'Slasher',
  'Psychologique',
  'Paranormal',
  'Gore',
  'Survival',
  'Folk',
  'Cosmique',
  'Zombie'
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  const [results, setResults] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pitches/search', {
        params: {
          query: searchTerm,
          genre: selectedGenre === 'Tous' ? null : selectedGenre,
          startDate: startDate || null,
          endDate: endDate || null
        }
      });
      // Ajout de logs pour diagnostiquer les requêtes et réponses
      console.log('Requête envoyée :', {
        query: searchTerm,
        genre: selectedGenre === 'Tous' ? null : selectedGenre,
        startDate,
        endDate
      });
      console.log('Réponse reçue :', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching pitches:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Recherche de Pitchs
      </Typography>

      <Box display="flex" gap={2} sx={{ mb: 4 }}>
        <TextField
          label="Rechercher"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={selectedGenre}
            label="Genre"
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Date de début"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ minWidth: 150 }}
        />

        <TextField
          label="Date de fin"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ minWidth: 150 }}
        />

        <Button 
          variant="contained" 
          onClick={handleSearch}
          sx={{ px: 4 }}
        >
          Rechercher
        </Button>
      </Box>

      <Grid container spacing={3}>
        {results.map((pitch) => (
          <div key={pitch._id} style={{ width: '100%' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{pitch.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {pitch.genre} • {new Date(pitch.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {pitch.character} dans {pitch.location} face à {pitch.threat}. {pitch.twist}
                </Typography>
                <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                  <Typography variant="body2">❤️ {pitch.likes} likes</Typography>
                  <Button size="small">Exporter PDF</Button>
                </Box>
              </CardContent>
            </Card>
          </div>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchPage;