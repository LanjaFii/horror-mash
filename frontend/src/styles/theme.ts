import { createTheme } from '@mui/material/styles';

const horrorMashTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5722',
      dark: '#e64a19',
    },
    secondary: {
      main: '#f44336',
      dark: '#d32f2f',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: [
      '"Roboto"',
      '"Helvetica"',
      '"Arial"',
      'sans-serif'
    ].join(','),
  },
});

export default horrorMashTheme;