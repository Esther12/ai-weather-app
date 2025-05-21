import type { FC } from 'react';

export type ClothingType = 'top' | 'bottom' | 'outerwear' | 'accessory';
export type MaterialType = 'cotton' | 'wool' | 'polyester' | 'denim' | 'wool-mix' | 'plastic-metal';
export type WeightType = 'light' | 'medium' | 'heavy';
export type WeatherCondition = 
  | 'sunny' 
  | 'clear' 
  | 'partly_cloudy' 
  | 'cloudy' 
  | 'windy' 
  | 'cool' 
  | 'rainy' 
  | 'snow' 
  | 'freezing' 
  | 'hot' 
  | 'mild' 
  | 'cold' 
  | 'bright' 
  | 'light_rain' 
  | 'heavy_rain';

// Thickness level from 0 (very thin) to 5 (very thick)
export type ThicknessLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface ClothingItem {
  name: string;
  type: ClothingType;
  material: MaterialType;
  weight?: WeightType;
  thickness: ThicknessLevel;  // Replaces suitable_temp_range
  suitable_conditions: WeatherCondition[];
  layering_order?: number;
  description: string;
  imagePath: string;  // Path to the clothing image
}

export interface ClothingCategory {
  [key: string]: ClothingItem;
}

export interface ClothingData {
  clothing: {
    tops: ClothingCategory;
    bottoms: ClothingCategory;
    accessories: ClothingCategory;
  };
}

export interface ClothingItemProps {
    item: string;
    type: string;
}

export interface ClothingRecommendation {
    tops: string[];
    bottoms: string[];
    accessories: string[];
}

export type ClothingComponent = FC<ClothingItemProps>; 