export interface EnvConfig {
  // Weather API Configuration
  WEATHER_API_KEY: string;
  WEATHER_API_BASE_URL: string;

  // Server Configuration
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';

  // Database Configuration
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;

  // Security
  JWT_SECRET: string;
  JWT_EXPIRATION: string;

  // CORS Configuration
  ALLOWED_ORIGINS: string[];
}

export const defaultConfig: EnvConfig = {
  // Weather API Configuration
  WEATHER_API_KEY: 'your_weather_api_key_here',
  WEATHER_API_BASE_URL: 'https://api.weatherapi.com/v1',

  // Server Configuration
  PORT: 3001,
  NODE_ENV: 'development',

  // Database Configuration
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_NAME: 'weather_dress_db',
  DB_USER: 'your_db_user',
  DB_PASSWORD: 'your_db_password',

  // Security
  JWT_SECRET: 'your_jwt_secret_here',
  JWT_EXPIRATION: '24h',

  // CORS Configuration
  ALLOWED_ORIGINS: ['http://localhost:3000', 'http://localhost:5173']
}; 