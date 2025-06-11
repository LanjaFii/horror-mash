import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Logout,
  Favorite,
  Share,
  Add
} from '@mui/icons-material';
import axios from 'axios';
import horrorMashTheme from '../../styles/theme';

interface Pitch {
  _id: string;
  title: string;
  character: string;
  location: string;
  threat: string;
  twist: string;
  genre: string;
  likes: number;
  createdAt: string;
}

interface HomePageProps {
  onLogout: () => void;
}

const HomePage = ({ onLogout }: HomePageProps) => {
  const [user, setUser] = useState<any>(null);
  const [popularPitches, setPopularPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token) {
          navigate('/auth');
          return;
        }

        setUser(userData);

        const response = await axios.get('http://localhost:5000/api/pitches/popular', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setPopularPitches(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    try {
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLike = async (pitchId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/pitches/like/${pitchId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPopularPitches(popularPitches.map(pitch => 
        pitch._id === pitchId ? { ...pitch, likes: response.data.likes } : pitch
      ));
    } catch (error) {
      console.error('Error liking pitch:', error);
    }
  };

  // Fonction pour choisir une couleur selon l'username
  const getAvatarColor = (username: string) => {
    if (!username) return horrorMashTheme.palette.secondary.main;
    const name = username.toLowerCase();
    if (name === 'lanja') return '#FFD600'; // Jaune vif
    if (name.startsWith('a')) return '#43A047'; // Vert foncé
    if (name.startsWith('m')) return '#E53935'; // Rouge
    if (name.startsWith('s')) return '#1E88E5'; // Bleu
    if (name.startsWith('c')) return '#8E24AA'; // Violet
    // Hash simple pour d'autres cas
    const colors = ['#FF7043', '#26A69A', '#FFB300', '#8D6E63', '#789262'];
    return colors[username.charCodeAt(0) % colors.length];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 4
      }}>
        <Typography variant="h3" component="h1" sx={{ 
          color: horrorMashTheme.palette.primary.main,
          fontWeight: 'bold'
        }}>
          HorrorMash
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <Avatar sx={{ bgcolor: horrorMashTheme.palette.secondary.main }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Bienvenue{user ? `, ${user.username}` : ''} !
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Découvrez les pitchs de films d'horreur les plus populaires ou créez le vôtre.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/generate-ai')}
          sx={{ mt: 2 }}
        >
          Créer un nouveau pitch
        </Button>
      </Box>

      <Typography variant="h4" sx={{ mb: 3, mt: 5 }}>
        Pitchs Populaires
      </Typography>
      
      <Grid container spacing={3} justifyContent="center" alignItems="center" direction="column">
        {popularPitches.map((pitch) => (
          <Grid item xs={12} key={pitch._id} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{
              width: 700,
              minWidth: 600,
              maxWidth: 800,
              margin: '0 auto',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `4px solid ${horrorMashTheme.palette.primary.main}`
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  {pitch.createdBy && pitch.createdBy.username && (
                    <>
                      <Avatar sx={{ bgcolor: getAvatarColor(pitch.createdBy.username), width: 40, height: 40, fontSize: 22 }}>
                        {pitch.createdBy.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {pitch.createdBy.username}
                      </Typography>
                    </>
                  )}
                  <Typography variant="h6" gutterBottom sx={{ ml: pitch.createdBy?.username ? 1 : 0 }}>
                    {pitch.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Genre: {pitch.genre}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>{pitch.character}</strong> dans <strong>{pitch.location}</strong> face à <strong>{pitch.threat}</strong>.
                </Typography>
                <Typography variant="body2" paragraph sx={{ fontStyle: 'italic' }}>
                  Twist: {pitch.twist}
                </Typography>
              </CardContent>
              
              <CardActions sx={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(0,0,0,0.1)',
                pt: 1
              }}>
                <Box display="flex" alignItems="center">
                  <IconButton 
                    aria-label="like" 
                    onClick={() => handleLike(pitch._id)}
                    color="error"
                  >
                    <Favorite />
                  </IconButton>
                  <Typography>{pitch.likes}</Typography>
                </Box>
                
                <Button 
                  size="small" 
                  onClick={() => navigate(`/pitch/${pitch._id}`)}
                >
                  Voir plus
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;