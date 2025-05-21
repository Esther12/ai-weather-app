import React, { useState, useEffect, useCallback } from 'react';
import { TextField, IconButton, Box, Container, Fade, Typography, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WeatherAndClothing from './WeatherAndClothing';

const ZipCodeSearch: React.FC = () => {
    const [zipCode, setZipCode] = useState('');
    const [submittedZipCode, setSubmittedZipCode] = useState('');
    const [error, setError] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchWeather, setSearchWeather] = useState<((code: string) => Promise<void>) | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const setThemeMode = useCallback((isDark: boolean) => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        setIsDarkMode(isDark);
    }, []);

    useEffect(() => {
        // Check if user prefers dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeMode(prefersDark);
    }, [setThemeMode]);

    const toggleTheme = () => {
        setThemeMode(!isDarkMode);
    };

    const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
        if (input.length <= 3) {
            setZipCode(input.toUpperCase());
        } else {
            const formattedInput = input.slice(0, 3).toUpperCase() + input.slice(3);
            setZipCode(formattedInput);
        }
        setError('');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (zipCode.trim() && zipCode.length >= 3) {
            const formattedZipCode = zipCode.slice(0, 3).toUpperCase();
            setSubmittedZipCode(formattedZipCode);
            setShowSearch(false);
            if (searchWeather) {
                searchWeather(formattedZipCode).catch(() => {
                    setShowSearch(true);
                    setError('Failed to fetch weather data');
                });
            }
        } else {
            setError('Please enter a valid postal code');
        }
    };

    const handleWeatherSearch = (search: (code: string) => Promise<void>, loading: boolean) => {
        setSearchWeather(() => search);
        setIsLoading(loading);
    };

    const handleEditLocation = () => {
        setShowSearch(true);
        setZipCode('');
    };

    return (
        <Container maxWidth="lg">
            <IconButton 
                onClick={toggleTheme}
                className="theme-switch"
                aria-label="Toggle theme"
                sx={{
                    '& .MuiSvgIcon-root': {
                        color: isDarkMode ? 'var(--avocado-dark)' : 'var(--avocado-dark)',
                    }
                }}
            >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Title Section - Always visible */}
            <Box sx={{ 
                textAlign: 'center', 
                pt: 4, 
                pb: 3,
                position: 'relative'
            }}>
                <Typography 
                    className="fancy-title" 
                    component="h1" 
                    sx={{ 
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        mb: 0.5
                    }}
                >
                    <span>Dear Drawer,</span>
                </Typography>
                <Typography 
                    className="fancy-title" 
                    component="h2" 
                    sx={{ 
                        color: 'var(--avocado-main)',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        mb: 0
                    }}
                >
                    What Should I Wear?
                </Typography>
            </Box>

            {/* Search Section */}
            <Box sx={{ 
                maxWidth: 400, 
                margin: '0 auto', 
                px: 3,
                pb: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                {showSearch ? (
                    <Fade in={showSearch}>
                        <Box component="form" 
                            onSubmit={handleSubmit} 
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                width: '100%',
                                maxWidth: 300,
                                margin: '0 auto'
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Postal Code"
                                value={zipCode}
                                onChange={handleZipCodeChange}
                                error={!!error}
                                helperText={error || "Enter first 3 characters (e.g., L4J)"}
                                inputProps={{ 
                                    maxLength: 3,
                                    style: { 
                                        textTransform: 'uppercase',
                                        color: 'var(--avocado-text)'
                                    }
                                }}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'var(--avocado-main)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--avocado-dark)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--avocado-dark)',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--avocado-dark)',
                                        '&.Mui-focused': {
                                            color: 'var(--avocado-dark)',
                                        },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        position: 'absolute',
                                        bottom: '-20px',
                                        color: 'var(--avocado-text)',
                                        opacity: 0.8
                                    },
                                    '& .Mui-error': {
                                        color: '#ff6b6b !important'
                                    },
                                    '& .MuiFormHelperText-root.Mui-error': {
                                        color: '#ff6b6b !important'
                                    }
                                }}
                            />
                            <IconButton 
                                type="submit"
                                disabled={zipCode.length < 3 || isLoading}
                                sx={{
                                    bgcolor: 'var(--avocado-main)',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'var(--avocado-dark)',
                                        transform: 'scale(1.05)',
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95)',
                                    },
                                    '&.Mui-disabled': {
                                        bgcolor: 'var(--avocado-accent)',
                                        color: 'var(--avocado-dark)',
                                        opacity: 0.7,
                                    }
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                            </IconButton>
                        </Box>
                    </Fade>
                ) : submittedZipCode && (
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        mb: 2 
                    }}>
                        <Box sx={{ 
                            bgcolor: 'var(--avocado-accent)', 
                            px: 2, 
                            py: 0.5, 
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <span style={{ color: 'var(--avocado-dark)', fontWeight: 500 }}>
                                {submittedZipCode}
                            </span>
                            <IconButton 
                                size="small"
                                onClick={handleEditLocation}
                                sx={{
                                    color: 'var(--avocado-dark)',
                                    p: 0.5,
                                    '&:hover': {
                                        color: 'var(--avocado-main)',
                                    }
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Weather Results Section */}
            {submittedZipCode && (
                <WeatherAndClothing 
                    postalCode={submittedZipCode} 
                    onSearch={handleWeatherSearch}
                />
            )}
        </Container>
    );
};

export default ZipCodeSearch; 