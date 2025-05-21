import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WeatherData, Location } from '../../types/weather';

interface WeatherState {
  currentWeather: WeatherData | null;
  location: Location | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: null,
  location: null,
  isLoading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherData: (state, action: PayloadAction<WeatherData>) => {
      state.currentWeather = action.payload;
      state.error = null;
    },
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.currentWeather = null;
    },
  },
});

export const { setWeatherData, setLocation, setLoading, setError } = weatherSlice.actions;
export default weatherSlice.reducer; 