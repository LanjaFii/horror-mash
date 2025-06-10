import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const HomePage = () => {
  const [popularPitches, setPopularPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPitches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pitches/popular');
        setPopularPitches(response.data);
      } catch (error) {
        console.error('Error fetching popular pitches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPitches();
  }, []);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Bienvenue sur HorrorMash
      </Typography>
      <Typography variant="body1" paragraph>
        Générez des pitchs de films d'horreur uniques et découvrez les créations les plus populaires.
      </Typography>

      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Pitchs Populaires
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {popularPitches.map((pitch) => (
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
                    <Button size="small">Voir plus</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HomePage;