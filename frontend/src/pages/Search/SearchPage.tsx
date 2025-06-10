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

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pitches/search', {
        params: {
          query: searchTerm,
          genre: selectedGenre === 'Tous' ? null : selectedGenre
        }
      });
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
          <Grid item xs={12} sm={6} md={4} key={pitch._id}>
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchPage;