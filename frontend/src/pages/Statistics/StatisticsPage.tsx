import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  CircularProgress,
  Select,
  Grid,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#ff5722', '#f44336', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'];

const StatisticsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/statistics?range=${timeRange}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [timeRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography>Aucune donnée statistique disponible</Typography>;
  }

  const genreData = Object.entries(stats.genresDistribution).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Statistiques
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Aperçu" />
          <Tab label="Genres" />
          <Tab label="Activité" />
        </Tabs>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Période</InputLabel>
          <Select
            value={timeRange}
            label="Période"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="day">Aujourd'hui</MenuItem>
            <MenuItem value="week">Cette semaine</MenuItem>
            <MenuItem value="month">Ce mois</MenuItem>
            <MenuItem value="year">Cette année</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Pitchs générés
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.totalPitches}
              </Typography>
              <Typography variant="body2">
                +{stats.pitchesGrowth}% par rapport à la période précédente
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Likes totaux
              </Typography>
              <Typography variant="h3" color="secondary">
                {stats.totalLikes}
              </Typography>
              <Typography variant="body2">
                +{stats.likesGrowth}% par rapport à la période précédente
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Genres populaires
              </Typography>
              <Typography variant="h5">
                1. {genreData[0]?.name} ({genreData[0]?.value})
              </Typography>
              <Typography variant="body1">
                2. {genreData[1]?.name} ({genreData[1]?.value})
              </Typography>
              <Typography variant="body1">
                3. {genreData[2]?.name} ({genreData[2]?.value})
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Box sx={{ height: 400, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Répartition par genre
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={false} // Suppression des légendes aux extrémités des aiguilles
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}

      {tabValue === 2 && (
        <Box sx={{ height: 400, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Activité récente
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.activityData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pitches" 
                stroke="#ff5722" 
                name="Pitchs générés" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="#f44336" 
                name="Likes" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default StatisticsPage;