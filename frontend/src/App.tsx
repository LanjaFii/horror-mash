import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import AuthPage from './pages/Auth/AuthPage';
import HomePage from './pages/Home/HomePage';
import GeneratorPage from './pages/Generator/GeneratorPage';
import GeneratorAIPromptPage from './pages/Generator/GeneratorAIPromptPage';
import SearchPage from './pages/Search/SearchPage';
import StatisticsPage from './pages/Statistics/StatisticsPage';
import AppHeader from './components/AppHeader';
import MesPitchsPage from './pages/MesPitchsPage';

const App = () => {
  const { isAuthenticated, loading, login, logout, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    isAuthenticated ? (
      <>
        <AppHeader user={user} onLogout={logout} />
        <Routes>
          <Route path="/" element={<HomePage onLogout={logout} />} />
          <Route path="/generate" element={<GeneratorPage />} />
          <Route path="/generate-ai" element={<GeneratorAIPromptPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/mes-pitchs" element={<MesPitchsPage />} />
          <Route path="*" element={<HomePage onLogout={logout} />} />
        </Routes>
      </>
    ) : (
      <Routes>
        <Route path="/auth" element={<AuthPage onLogin={login} />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    )
  );
};

export default App;