import { useState } from 'react';
import { Box, Tab, Tabs, Paper, Snackbar, Alert } from '@mui/material';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';

interface AuthPageProps {
  onLogin: (token: string, userData: any) => void;
  onRegister?: (token: string, userData: any) => void;
}

const AuthPage = ({ onLogin, onRegister }: AuthPageProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = (token: string, userData: any) => {
    onLogin(token, userData);
  };

  const handleRegisterSuccess = (token: string, userData: any) => {
    onRegister?.(token, userData);
    setTabValue(0); // Basculer vers l'onglet de connexion après inscription
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)'
    }}>
      <Paper elevation={10} sx={{ width: 400, p: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => {
            setTabValue(newValue);
            setError(null); // Réinitialiser les erreurs lors du changement d'onglet
          }}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Connexion" />
          <Tab label="Inscription" />
        </Tabs>

        {tabValue === 0 ? (
          <LoginForm 
            onSuccess={handleLoginSuccess} 
            onError={handleError}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleRegisterSuccess} 
            onError={handleError}
          />
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default AuthPage;