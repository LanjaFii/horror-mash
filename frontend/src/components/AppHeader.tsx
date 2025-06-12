import { AppBar, Toolbar, Box, Typography, Button, IconButton, Tooltip, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Logout from '@mui/icons-material/Logout';
import horrorMashTheme from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface AppHeaderProps {
  user: any;
  onLogout: () => void;
}

const getAvatarColor = (username: string) => {
  if (!username) return horrorMashTheme.palette.secondary.main;
  const name = username.toLowerCase();
  if (name === 'lanja') return '#FFD600';
  if (name.startsWith('a')) return '#43A047';
  if (name.startsWith('m')) return '#E53935';
  if (name.startsWith('s')) return '#1E88E5';
  if (name.startsWith('c')) return '#8E24AA';
  const colors = ['#FF7043', '#26A69A', '#FFB300', '#8D6E63', '#789262'];
  return colors[username.charCodeAt(0) % colors.length];
};

const AppHeader = ({ user, onLogout }: AppHeaderProps) => {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" color="default" elevation={2} sx={{ mb: 4, background: '#181818', zIndex: 1200 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" sx={{ color: horrorMashTheme.palette.primary.main, fontWeight: 700, letterSpacing: 2, cursor: 'pointer' }} onClick={() => navigate('/')}>HorrorMash</Typography>
          <Tooltip title="Accueil">
            <Button color="inherit" sx={{ ml: 2, fontWeight: 600 }} onClick={() => navigate('/')}>Accueil</Button>
          </Tooltip>
          <Tooltip title="Recherche">
            <IconButton color="primary" sx={{ ml: 1 }} onClick={() => navigate('/search')}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Statistiques">
            <IconButton color="primary" onClick={() => navigate('/stats')}>
              <BarChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mes pitchs">
            <IconButton color="secondary" onClick={() => navigate('/mes-pitchs')}>
              <ListAltIcon />
            </IconButton>
          </Tooltip>
          {user && (
            <Avatar sx={{ bgcolor: getAvatarColor(user.username), width: 36, height: 36, fontSize: 18 }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={onLogout}
            sx={{ ml: 1 }}
          >
            Déconnexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
