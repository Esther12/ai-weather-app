import React from 'react';
import type { WeatherData } from '../types/weather';

interface WeatherDisplayProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, isLoading }) => {
  if (isLoading) {
    return <div className="weather-display loading">Loading weather data...</div>;
  }

  if (!weather) {
    return <div className="weather-display empty">No weather data available</div>;
  }

  return (
    <div className="weather-display">
      <h2>Current Weather</h2>
      <div className="weather-info">
        <div className="temperature">
          <span className="value">{weather.temperature}°C</span>
        </div>
        <div className="condition">
          <span className="label">Condition:</span>
          <span className="value">{weather.condition}</span>
        </div>
        <div className="details">
          <div className="humidity">
            <span className="label">Humidity:</span>
            <span className="value">{weather.humidity}%</span>
          </div>
          <div className="wind">
            <span className="label">Wind Speed:</span>
            <span className="value">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay; 