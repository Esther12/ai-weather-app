import dotenv from 'dotenv';
import type { EnvConfig } from './env.example';
import { defaultConfig } from './env.example';

// Load environment variables from .env file
dotenv.config();

function validateConfig(config: Partial<EnvConfig>): config is EnvConfig {
  const requiredFields: (keyof EnvConfig)[] = [
    'WEATHER_API_KEY',
    'WEATHER_API_BASE_URL',
    'PORT',
    'NODE_ENV'
  ];

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required environment variable: ${field}`);
    }
  }

  return true;
}

function parseEnvValue(value: string | undefined, defaultValue: any): any {
  if (value === undefined) {
    return defaultValue;
  }

  // Parse arrays
  if (Array.isArray(defaultValue)) {
    return value.split(',').map(item => item.trim());
  }

  // Parse numbers
  if (typeof defaultValue === 'number') {
    return Number(value);
  }

  // Parse booleans
  if (typeof defaultValue === 'boolean') {
    return value.toLowerCase() === 'true';
  }

  return value;
}

function loadConfig(): EnvConfig {
  const config: Partial<EnvConfig> = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    WEATHER_API_BASE_URL: process.env.WEATHER_API_BASE_URL || defaultConfig.WEATHER_API_BASE_URL,
    PORT: parseEnvValue(process.env.PORT, defaultConfig.PORT),
    NODE_ENV: (process.env.NODE_ENV || defaultConfig.NODE_ENV) as EnvConfig['NODE_ENV'],
    DB_HOST: process.env.DB_HOST || defaultConfig.DB_HOST,
    DB_PORT: parseEnvValue(process.env.DB_PORT, defaultConfig.DB_PORT),
    DB_NAME: process.env.DB_NAME || defaultConfig.DB_NAME,
    DB_USER: process.env.DB_USER || defaultConfig.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD || defaultConfig.DB_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET || defaultConfig.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || defaultConfig.JWT_EXPIRATION,
    ALLOWED_ORIGINS: parseEnvValue(process.env.ALLOWED_ORIGINS, defaultConfig.ALLOWED_ORIGINS),
  };

  if (!validateConfig(config)) {
    throw new Error('Invalid configuration');
  }

  return config;
}

// Export the configuration
export const config = loadConfig();

// Export specific configurations for different parts of the application
export const weatherConfig = {
  apiKey: config.WEATHER_API_KEY,
  baseUrl: config.WEATHER_API_BASE_URL,
};

export const serverConfig = {
  port: config.PORT,
  nodeEnv: config.NODE_ENV,
};

export const dbConfig = {
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
};

export const securityConfig = {
  jwtSecret: config.JWT_SECRET,
  jwtExpiration: config.JWT_EXPIRATION,
};

export const corsConfig = {
  allowedOrigins: config.ALLOWED_ORIGINS,
}; 