import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import AuthPage from './pages/Auth/AuthPage';
import HomePage from './pages/Home/HomePage';
import GeneratorPage from './pages/Generator/GeneratorPage';
import SearchPage from './pages/Search/SearchPage';
import StatisticsPage from './pages/Statistics/StatisticsPage';

const App = () => {
  const { isAuthenticated, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={!isAuthenticated ? 
          <AuthPage onLogin={login} /> : 
          <Navigate to="/" replace />} 
      />
      <Route 
        path="/" 
        element={isAuthenticated ? 
          <HomePage onLogout={logout} /> : 
          <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/generate" 
        element={isAuthenticated ? 
          <GeneratorPage /> : 
          <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/search" 
        element={isAuthenticated ? 
          <SearchPage /> : 
          <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/stats" 
        element={isAuthenticated ? 
          <StatisticsPage /> : 
          <Navigate to="/auth" replace />} 
      />
    </Routes>
  );
};

export default App;