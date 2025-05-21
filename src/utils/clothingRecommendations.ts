import type { 
  WeatherCondition, 
  ClothingData, 
  ClothingItem,
  ThicknessLevel 
} from '../types/clothing';
import clothingData from '../data/clothing-details.json';

interface WeatherParams {
  temperature: number;
  feelsLike: number;
  maxTemp: number;
  minTemp: number;
  conditions: WeatherCondition[];
  isRaining: boolean;
  isSnowing: boolean;
  isSunny: boolean;
  isWindy: boolean;
}

// Define temperature ranges for thickness levels considering feels like temperature
const getRecommendedThickness = (
  actualTemp: number,
  feelsLike: number,
  maxTemp: number,
  minTemp: number
): ThicknessLevel[] => {
  // Use feels like temperature as the primary factor
  const effectiveTemp = feelsLike;
  
  // Calculate temperature variation throughout the day
  const tempVariation = maxTemp - minTemp;
  
  // Base thickness recommendations
  let recommendations: ThicknessLevel[] = [];
  
  // Core thickness based on feels like temperature
  if (effectiveTemp >= 30) recommendations = [0];
  else if (effectiveTemp >= 25) recommendations = [0, 1];
  else if (effectiveTemp >= 20) recommendations = [1, 2];
  else if (effectiveTemp >= 15) recommendations = [2, 3];
  else if (effectiveTemp >= 10) recommendations = [2, 3, 4];
  else if (effectiveTemp >= 5) recommendations = [3, 4];
  else if (effectiveTemp >= 0) recommendations = [3, 4, 5];
  else recommendations = [4, 5];

  // Adjust for temperature variation
  if (tempVariation > 10) {
    // Add lighter options for high temp and thicker options for low temp
    const minThickness = Math.min(...recommendations);
    const maxThickness = Math.max(...recommendations);
    
    // Add one level lighter if not already at minimum
    if (minThickness > 0) {
      recommendations.push(minThickness - 1 as ThicknessLevel);
    }
    
    // Add one level thicker if not already at maximum
    if (maxThickness < 5) {
      recommendations.push(maxThickness + 1 as ThicknessLevel);
    }
  }

  // If feels like is significantly different from actual temperature, adjust recommendations
  const tempDiff = Math.abs(actualTemp - feelsLike);
  if (tempDiff > 5) {
    // Add intermediate thickness levels
    const sortedThickness = Array.from(new Set(recommendations)).sort((a, b) => a - b);
    if (sortedThickness.length > 1) {
      for (let i = 0; i < sortedThickness.length - 1; i++) {
        const current = sortedThickness[i];
        const next = sortedThickness[i + 1];
        if (next - current > 1) {
          recommendations.push((current + 1) as ThicknessLevel);
        }
      }
    }
  }

  return Array.from(new Set(recommendations)).sort((a, b) => a - b);
};

// Helper function to check if arrays have any common elements
const hasCommonElement = (arr1: any[], arr2: any[]): boolean => {
  return arr1.some(item => arr2.includes(item));
};

export const generateClothingRecommendations = (weather: WeatherParams) => {
  const data = clothingData as ClothingData;
  const recommendedThickness = getRecommendedThickness(
    weather.temperature,
    weather.feelsLike,
    weather.maxTemp,
    weather.minTemp
  );
  
  // Create weather conditions array based on current weather
  const currentConditions: WeatherCondition[] = [
    ...(weather.isRaining ? ['rainy', 'light_rain', 'heavy_rain'] as WeatherCondition[] : []),
    ...(weather.isSnowing ? ['snow', 'freezing'] as WeatherCondition[] : []),
    ...(weather.isSunny ? ['sunny', 'clear', 'bright'] as WeatherCondition[] : []),
    ...(weather.isWindy ? ['windy'] as WeatherCondition[] : []),
    ...(weather.feelsLike > 25 ? ['hot'] as WeatherCondition[] : []),
    ...(weather.feelsLike < 10 ? ['cold'] as WeatherCondition[] : []),
    ...(weather.feelsLike >= 10 && weather.feelsLike <= 25 ? ['mild'] as WeatherCondition[] : []),
    ...weather.conditions
  ];

  // Helper function to filter clothing items
  const filterClothingItems = (items: Record<string, ClothingItem>) => {
    return Object.values(items).filter(item => {
      // Check if the item's thickness matches the recommended range
      const thicknessMatch = recommendedThickness.includes(item.thickness);
      
      // Check if the item is suitable for current weather conditions
      const conditionsMatch = hasCommonElement(item.suitable_conditions, currentConditions);
      
      return thicknessMatch && conditionsMatch;
    });
  };

  // Get recommendations for each category
  const recommendations = {
    tops: filterClothingItems(data.clothing.tops),
    bottoms: filterClothingItems(data.clothing.bottoms),
    accessories: filterClothingItems(data.clothing.accessories),
  };

  // Sort tops by layering order if multiple items are recommended
  recommendations.tops.sort((a, b) => (a.layering_order || 0) - (b.layering_order || 0));

  // Generate description based on weather conditions
  let description = `Weather conditions: ${weather.temperature}°C (feels like ${weather.feelsLike}°C), `;
  description += `Range: ${weather.minTemp}°C to ${weather.maxTemp}°C, `;
  if (weather.isRaining) description += "rainy, ";
  if (weather.isSnowing) description += "snowing, ";
  if (weather.isSunny) description += "sunny, ";
  if (weather.isWindy) description += "windy, ";
  description = description.slice(0, -2); // Remove last comma and space

  // Generate layering advice based on temperature variation
  let layeringAdvice = recommendations.tops.length > 1 
    ? "Consider layering these items for better insulation. "
    : "";
  
  const tempVariation = weather.maxTemp - weather.minTemp;
  if (tempVariation > 10) {
    layeringAdvice += "Due to significant temperature variation throughout the day, " +
      "consider bringing extra layers that you can add or remove as needed.";
  }

  return {
    recommendations,
    description,
    layering: layeringAdvice || undefined
  };
};

// Example usage:
/*
const recommendations = generateClothingRecommendations({
  temperature: 15,
  feelsLike: 12,
  maxTemp: 20,
  minTemp: 10,
  conditions: ['cloudy'],
  isRaining: false,
  isSnowing: false,
  isSunny: false,
  isWindy: true
});
*/ 