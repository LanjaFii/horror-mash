import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  HowToReg as RegisterIcon
} from '@mui/icons-material';
import axios from 'axios';
import horrorMashTheme from '../../styles/theme';

const RegisterForm = ({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { 
        username,
        email, 
        password 
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        label="Nom d'utilisateur"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Confirmer le mot de passe"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        sx={{ mb: 3 }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        disabled={loading}
        startIcon={<RegisterIcon />}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          background: horrorMashTheme.palette.secondary.main,
          '&:hover': {
            background: horrorMashTheme.palette.secondary.dark,
          }
        }}
      >
        {loading ? 'Inscription en cours...' : "S'inscrire"}
      </Button>
    </Box>
  );
};

export default RegisterForm;