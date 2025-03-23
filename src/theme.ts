import { createTheme } from '@mui/material/styles';

// Gen Z inspired theme with vibrant colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#7F5AF0', // Vibrant purple
      light: '#9D7BFF',
      dark: '#6942D0',
    },
    secondary: {
      main: '#2CB67D', // Vibrant teal
      light: '#72F2BF',
      dark: '#24A76C',
    },
    error: {
      main: '#FF5470', // Bright pink for errors
    },
    background: {
      default: '#16161A', // Dark background
      paper: '#242629',   // Slightly lighter dark
    },
    text: {
      primary: '#FFFFFE',
      secondary: '#94A1B2',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 24px',
          fontSize: '0.9rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(127, 90, 240, 0.3)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #7F5AF0 30%, #9D7BFF 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #2CB67D 30%, #72F2BF 90%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 8,
          '&:hover': {
            transform: 'translateX(4px)',
            transition: 'transform 0.2s ease-in-out',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#242629',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme; 