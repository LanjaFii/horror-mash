import { useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';

const AuthPage = ({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) => {
  const [tabValue, setTabValue] = useState(0);

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
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Connexion" />
          <Tab label="Inscription" />
        </Tabs>

        {tabValue === 0 ? (
          <LoginForm setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <RegisterForm setIsAuthenticated={setIsAuthenticated} />
        )}
      </Paper>
    </Box>
  );
};

export default AuthPage;