export interface WeatherData {
  temperature: number;
  feelsLike: number;
  maxTemp: number;
  minTemp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface ClothingRecommendation {
  tops: string[];
  bottoms: string[];
  accessories: string[];
  description: string;
}

export interface Location {
  city: string;
  country: string;
}

export interface WeatherChange {
  description: string;
  icon: string;
}

export interface WeatherSummary {
  currentTemp: number;
  feelsLike: number;
  currentCondition: string;
  currentIcon: string;
  timeRange: string;
  minTemp: number;
  maxTemp: number;
  weatherChanges: WeatherChange[];
  recommendations: ClothingRecommendation;
}

export interface WeatherAndClothingProps {
  postalCode: string;
  onSearch?: (fetchWeatherData: (code: string) => Promise<void>, loading: boolean) => void;
}

export interface CacheData {
  data: WeatherSummary;
  timestamp: number;
} 