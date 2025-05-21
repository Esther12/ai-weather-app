// Geocoding API Response Interface
export interface GeocodingResponse {
    zip: string;
    name: string;
    lat: number;
    lon: number;
    country: string;
}

// Weather Forecast API Response Interfaces
export interface WeatherForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastItem[];
    city: City;
}

export interface ForecastItem {
    dt: number;
    main: MainWeather;
    weather: Weather[];
    clouds: Clouds;
    wind: Wind;
    visibility: number;
    pop: number;
    rain?: Rain;
    sys: Sys;
    dt_txt: string;
}

export interface MainWeather {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface Clouds {
    all: number;
}

export interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

export interface Rain {
    "3h": number;
}

export interface Sys {
    pod: string;  // part of day ('d' for day, 'n' for night)
}

export interface City {
    id: number;
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
} 