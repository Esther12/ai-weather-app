import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import clothingReducer from './slices/clothingSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    clothing: clothingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['clothing/setRecommendations', 'weather/setWeatherData'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['clothing.recommendations', 'weather.currentWeather'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 