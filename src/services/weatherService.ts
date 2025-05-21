import axios from 'axios';
import type { GeocodingResponse, WeatherForecastResponse } from '../types/weatherTypes';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const GEO_BASE_URL = import.meta.env.VITE_GEO_API_BASE_URL;
const WEATHER_BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL;
const DEFAULT_COUNTRY = import.meta.env.VITE_DEFAULT_COUNTRY || 'CA';
const UNITS = import.meta.env.VITE_WEATHER_UNITS || 'metric';

class WeatherService {
    // Get location coordinates from postal code
    async getCoordinates(postalCode: string): Promise<GeocodingResponse> {
        try {
            const response = await axios.get<GeocodingResponse>(
                `${GEO_BASE_URL}/zip?zip=${postalCode},${DEFAULT_COUNTRY}&appid=${API_KEY}`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get location coordinates');
            }
            throw error;
        }
    }

    // Get weather forecast using coordinates
    async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecastResponse> {
        try {
            const response = await axios.get<WeatherForecastResponse>(
                `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${API_KEY}`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get weather forecast');
            }
            throw error;
        }
    }

    // Combined function to get weather forecast by postal code
    async getWeatherByPostalCode(postalCode: string): Promise<WeatherForecastResponse> {
        try {
            // First get the coordinates
            const coordinates = await this.getCoordinates(postalCode);
            
            // Then get the weather forecast using the coordinates
            const forecast = await this.getWeatherForecast(coordinates.lat, coordinates.lon);
            
            return forecast;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }
}

export const weatherService = new WeatherService(); 