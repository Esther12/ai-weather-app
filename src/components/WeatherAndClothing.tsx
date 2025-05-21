import React, { useState, useCallback, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import type { ForecastItem } from '../types/weatherTypes';
import { weatherService } from '../services/weatherService';
import { getNext12HoursForecast, getClothingRecommendations } from '../utils/weatherUtils';
import Cookies from 'js-cookie';
import ClothingRecommendationDisplay from './ClothingRecommendationDisplay';

interface WeatherSummary {
    currentTemp: number;
    feelsLike: number;
    currentCondition: string;
    currentIcon: string;
    timeRange: string;
    minTemp: number;
    maxTemp: number;
    weatherChanges: Array<{
        description: string;
        icon: string;
    }>;
    recommendations: {
        tops: string[];
        bottoms: string[];
        accessories: string[];
    };
}

const getSummary = (forecasts: ForecastItem[]): WeatherSummary => {
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + (12 * 60 * 60 * 1000)); // 12 hours from now
    
    // Find the closest forecast to current time
    const currentForecast = forecasts.reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.dt_txt).getTime() - currentTime.getTime());
        const currDiff = Math.abs(new Date(curr.dt_txt).getTime() - currentTime.getTime());
        return prevDiff < currDiff ? prev : curr;
    });
    
    const temps = forecasts.map(f => f.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    
    // Track unique weather changes with their icons, removing duplicates
    const weatherChanges = Array.from(new Set(forecasts.map(f => f.weather[0].description)))
        .map(description => {
            const forecast = forecasts.find(f => f.weather[0].description === description);
            return {
                description,
                icon: forecast!.weather[0].icon
            };
        });

    // Get recommendations based on current conditions and forecast
    const worstWeather = forecasts.find(f => 
        f.weather[0].main === 'Rain' || 
        f.weather[0].main === 'Snow' ||
        f.weather[0].main === 'Thunderstorm'
    ) || currentForecast;

    // Format the time range to show "Now until [12 hours from now]"
    const timeRangeStr = `Now until ${endTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    })}`;

    return {
        currentTemp: currentForecast.main.temp,
        feelsLike: currentForecast.main.feels_like,
        currentCondition: currentForecast.weather[0].description,
        currentIcon: currentForecast.weather[0].icon,
        timeRange: timeRangeStr,
        minTemp,
        maxTemp,
        weatherChanges,
        recommendations: getClothingRecommendations(worstWeather)
    };
};

const WeatherSummaryCard: React.FC<{ summary: WeatherSummary }> = ({ summary }) => {
    return (
        <Card className="card-container" sx={{ 
            width: '100%',
            borderRadius: 3,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            bgcolor: 'var(--card-bg)'
        }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" gutterBottom sx={{ 
                    textAlign: 'center', 
                    mb: 3,
                    color: 'var(--avocado-dark)',
                    fontWeight: 600,
                    position: 'relative'
                }}>
                    12-Hour Forecast
                </Typography>

                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    <Box>
                        <Typography variant="h6" sx={{ 
                            textAlign: 'center', 
                            color: 'var(--avocado-main)',
                            fontWeight: 500,
                            mb: 2
                        }}>
                            Current Conditions
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mb: 1 
                        }}>
                            <Typography 
                                className="temperature-display"
                                variant="h3" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    textAlign: 'center',
                                    color: 'var(--avocado-text)'
                                }}
                            >
                                {Math.round(summary.currentTemp)}°C
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                ml: 1, 
                                color: 'var(--avocado-dark)',
                                opacity: 0.8
                            }}>
                                (feels like {Math.round(summary.feelsLike)}°C)
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}>
                            <img 
                                className="weather-icon"
                                src={`http://openweathermap.org/img/wn/${summary.currentIcon}@2x.png`}
                                alt={summary.currentCondition}
                                style={{ width: '50px', height: '50px' }}
                            />
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    textTransform: 'capitalize',
                                    color: 'var(--avocado-text)',
                                    opacity: 0.8
                                }}
                            >
                                {summary.currentCondition}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Forecast Section */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ 
                            textAlign: 'center', 
                            color: 'var(--avocado-text)', 
                            mb: 1 
                        }}>
                            {summary.timeRange}
                        </Typography>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'center', 
                            mb: 2,
                            color: 'var(--avocado-text)'
                        }}>
                            {Math.round(summary.minTemp)}°C - {Math.round(summary.maxTemp)}°C
                        </Typography>
                        {summary.weatherChanges.length > 1 && (
                            <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 1,
                                justifyContent: 'center'
                            }}>
                                {summary.weatherChanges.map((condition, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            bgcolor: 'var(--avocado-accent)',
                                            color: 'var(--avocado-dark)',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            border: '1px solid var(--avocado-main)',
                                            boxShadow: '0 2px 4px rgba(113, 131, 85, 0.1)'
                                        }}
                                    >
                                        <img 
                                            src={`http://openweathermap.org/img/wn/${condition.icon}.png`}
                                            alt={condition.description}
                                            style={{ width: '24px', height: '24px', marginRight: '4px' }}
                                        />
                                        <Typography 
                                            variant="body1"
                                            sx={{
                                                textTransform: 'capitalize',
                                                color: 'var(--avocado-dark)',
                                                fontWeight: 500
                                            }}
                                        >
                                            {condition.description}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

interface WeatherAndClothingProps {
    postalCode: string;
    onSearch?: (fetchWeatherData: (code: string) => Promise<void>, loading: boolean) => void;
}

interface CacheData {
    data: WeatherSummary;
    timestamp: number;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const COOKIE_KEY = 'weather_cache';

const getWeatherCache = (): Record<string, CacheData> => {
    const cache = Cookies.get(COOKIE_KEY);
    return cache ? JSON.parse(cache) : {};
};

const setWeatherCache = (cache: Record<string, CacheData>) => {
    Cookies.set(COOKIE_KEY, JSON.stringify(cache), { expires: 1 }); // Expires in 1 day
};

const WeatherAndClothing: React.FC<WeatherAndClothingProps> = ({ postalCode, onSearch }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weatherSummary, setWeatherSummary] = useState<WeatherSummary | null>(null);
    const [lastSearchedCode, setLastSearchedCode] = useState<string>('');

    const getCachedData = useCallback((code: string) => {
        const weatherCache = getWeatherCache();
        const cachedData = weatherCache[code];
        if (!cachedData) return null;

        const now = Date.now();
        if (now - cachedData.timestamp > CACHE_DURATION) {
            // Cache expired, remove it
            const newCache = { ...weatherCache };
            delete newCache[code];
            setWeatherCache(newCache);
            return null;
        }

        return cachedData.data;
    }, []);

    const fetchWeatherData = useCallback(async (code: string) => {
        if (!code || code === lastSearchedCode) return;

        // Check cookie cache first
        const cachedData = getCachedData(code);
        if (cachedData) {
            setWeatherSummary(cachedData);
            setLastSearchedCode(code);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await weatherService.getWeatherByPostalCode(code);
            const next12Hours = getNext12HoursForecast(response.list);
            const summary = getSummary(next12Hours);
            
            // Update cookie cache
            const weatherCache = getWeatherCache();
            const newCache = {
                ...weatherCache,
                [code]: {
                    data: summary,
                    timestamp: Date.now()
                }
            };
            setWeatherCache(newCache);

            setWeatherSummary(summary);
            setLastSearchedCode(code);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
            setWeatherSummary(null);
        } finally {
            setLoading(false);
        }
    }, [lastSearchedCode]);

    // Handle search functionality and expose search function to parent
    useEffect(() => {
        // Expose search function to parent
        if (onSearch) {
            onSearch(fetchWeatherData, loading);
        }

        // Perform initial search when postal code is provided
        if (postalCode && postalCode.length >= 3) {
            fetchWeatherData(postalCode);
        }
    }, [onSearch, fetchWeatherData, loading, postalCode]);

    if (loading) {
        return (
            <Box sx={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4
            }}>
                <Typography 
                    color="error" 
                    sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        bgcolor: 'error.light',
                        borderRadius: 1,
                        maxWidth: 600
                    }}
                >
                    {error}
                </Typography>
            </Box>
        );
    }

    return weatherSummary ? (
        <Box sx={{ 
            width: '100%',
            maxWidth: '1440px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            p: { xs: 2, sm: 3 },
            gap: 3
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' }
            }}>
                <Box sx={{ 
                    flex: { md: 1 },
                    width: '100%',
                    maxWidth: { xs: '100%', md: 600 }
                }}>
                    <WeatherSummaryCard summary={weatherSummary} />
                </Box>
                <Box sx={{ 
                    flex: { md: 1 },
                    width: '100%',
                    maxWidth: { xs: '100%', md: 600 }
                }}>
                    <Card className="card-container" sx={{ 
                        width: '100%',
                        borderRadius: 3,
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        bgcolor: 'var(--card-bg)',
                        p: { xs: 2, sm: 3 }
                    }}>
                        <Typography variant="h5" gutterBottom sx={{ 
                            textAlign: 'center', 
                            mb: 3,
                            color: 'var(--avocado-dark)',
                            fontWeight: 600
                        }}>
                            Recommended Clothing
                        </Typography>
                        <ClothingRecommendationDisplay recommendations={weatherSummary.recommendations} />
                    </Card>
                </Box>
            </Box>
        </Box>
    ) : null;
};

export default WeatherAndClothing; 