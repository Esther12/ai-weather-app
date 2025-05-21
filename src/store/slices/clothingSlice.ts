import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ClothingRecommendation } from '../../types/weather';

interface ClothingState {
  recommendations: ClothingRecommendation | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ClothingState = {
  recommendations: null,
  isLoading: false,
  error: null,
};

const clothingSlice = createSlice({
  name: 'clothing',
  initialState,
  reducers: {
    setRecommendations: (state, action: PayloadAction<ClothingRecommendation>) => {
      state.recommendations = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.recommendations = null;
    },
  },
});

export const { setRecommendations, setLoading, setError } = clothingSlice.actions;
export default clothingSlice.reducer; 