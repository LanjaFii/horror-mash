import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Card, CardContent, Avatar, IconButton, CardActions } from '@mui/material';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { Favorite } from '@mui/icons-material';

// Fonction utilitaire pour la couleur d'avatar (copiée du header)
const getAvatarColor = (username: string) => {
  if (!username) return '#789262';
  const name = username.toLowerCase();
  if (name === 'lanja') return '#FFD600';
  if (name.startsWith('a')) return '#43A047';
  if (name.startsWith('m')) return '#E53935';
  if (name.startsWith('s')) return '#1E88E5';
  if (name.startsWith('c')) return '#8E24AA';
  const colors = ['#FF7043', '#26A69A', '#FFB300', '#8D6E63', '#789262'];
  return colors[username.charCodeAt(0) % colors.length];
};

const PitchCard = ({ pitch }: { pitch: any }) => (
  <Card sx={{ background: '#181818', color: 'white', borderRadius: 3, boxShadow: 3, width: '100%', maxWidth: 600, mx: 'auto' }}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Avatar sx={{ bgcolor: pitch.createdBy?.username ? getAvatarColor(pitch.createdBy.username) : '#888', width: 36, height: 36, fontWeight: 700 }}>
          {pitch.createdBy?.username ? pitch.createdBy.username.charAt(0).toUpperCase() : '?'}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
          {pitch.createdBy?.username || 'Anonyme'}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>{pitch.title}</Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>{pitch.description}</Typography>
      <Typography variant="caption" color="secondary" sx={{ fontStyle: 'italic' }}>
        {pitch.genre} | {pitch.location}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <IconButton color="error" size="small" disabled>
        <Favorite sx={{ fontSize: 20 }} /> {pitch.likes}
      </IconButton>
    </CardActions>
  </Card>
);

const MesPitchsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pitchs, setPitchs] = useState([]);

  useEffect(() => {
    const fetchMyPitchs = async () => {
      if (!user) {
        console.warn('Utilisateur non connecté ou token manquant.');
        return;
      }
      console.log('Token utilisateur avant la requête :', user.token); // Log supplémentaire pour déboguer
      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem('token'); // Récupérer le token depuis localStorage si absent dans user
        console.log('Token utilisé pour la requête :', token); // Log pour déboguer

        if (!token) {
          console.warn('Token manquant. Impossible de récupérer les pitchs.');
          return;
        }

        const res = await axios.get(`/api/pitch/mes-pitchs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ajout de logs pour diagnostiquer les requêtes et réponses
        console.log('Token utilisateur :', user?.token);
        console.log('Réponse reçue de /mes-pitchs :', res.data);

        let data = res.data;
        if (!Array.isArray(data)) {
          console.warn('Réponse inattendue de /mes-pitchs:', data);
          data = [];
        }
        console.log('Pitchs récupérés:', data);
        setPitchs(data);
      } catch (e) {
        console.error('Erreur lors de la récupération des pitchs:', e);
        setPitchs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPitchs();
  }, [user]);

  if (!user) return <Typography>Veuillez vous connecter.</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Mes pitchs publiés</Typography>
      {loading ? (
        <CircularProgress />
      ) : pitchs.length === 0 ? (
        <Typography>Aucun pitch publié pour l'instant.</Typography>
      ) : (
        <Grid container spacing={2} direction="column" alignItems="center">
          {pitchs.map((pitch: any) => (
            <div key={pitch._id} style={{ width: '100%' }}>
              <PitchCard pitch={pitch} />
            </div>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MesPitchsPage;
