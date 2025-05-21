import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ZipCodeSearch from './components/ZipCodeSearch';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', padding: '20px' }}>
        <ZipCodeSearch />
      </div>
    </ThemeProvider>
  );
}

export default App;
