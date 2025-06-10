import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './pages/Auth/AuthPage';
import HomePage from './pages/Home/HomePage';
import GeneratorPage from './pages/Generator/GeneratorPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage setIsAuthenticated={setIsAuthenticated} />} />
      <Route 
        path="/" 
        element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/generate" 
        element={isAuthenticated ? <GeneratorPage /> : <Navigate to="/auth" replace />} 
      />
      {/* Autres routes */}
    </Routes>
  );
}

export default App;