import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import GeneratorPage from './pages/Generator/GeneratorPage';
import SearchPage from './pages/Search/SearchPage';
import StatisticsPage from './pages/Statistics/StatisticsPage';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HorrorMash
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<GeneratorPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;