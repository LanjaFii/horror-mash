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
  Login as LoginIcon
} from '@mui/icons-material';
import axios from 'axios';
import horrorMashTheme from '../../styles/theme';

interface LoginFormProps {
  onSuccess: (token: string, userData: any) => void;
  onError: (message: string) => void;
}

const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      onSuccess(response.data.token, response.data.user);
    } catch (error) {
      onError(error.response?.data?.message || 'Échec de la connexion');
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
        sx={{ mb: 3 }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        startIcon={<LoginIcon />}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          background: horrorMashTheme.palette.primary.main,
          '&:hover': {
            background: horrorMashTheme.palette.primary.dark,
          }
        }}
      >
        {loading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>
    </Box>
  );
};

export default LoginForm;