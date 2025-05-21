import React, { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setRecommendations, setLoading, setError } from '../store/slices/clothingSlice';
import { generateClothingRecommendations } from '../utils/clothingRecommendations';
import type { WeatherCondition } from '../types/clothing';
import clothingData from '../data/clothing-details.json';
import './ClothingRecommendations.css';

const ClothingRecommendations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { recommendations, isLoading, error } = useAppSelector(state => state.clothing);
  const weather = useAppSelector(state => state.weather.currentWeather);

  console.log('ClothingRecommendations render:', { recommendations, weather, isLoading, error });

  const generateRecommendations = useCallback(async () => {
    if (!weather) return;

    try {
      // Set loading state first
      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = generateClothingRecommendations({
        temperature: weather.temperature,
        feelsLike: weather.feelsLike,
        maxTemp: weather.maxTemp,
        minTemp: weather.minTemp,
        conditions: [weather.condition as WeatherCondition],
        isRaining: weather.condition.includes('rain'),
        isSnowing: weather.condition.includes('snow'),
        isSunny: ['sunny', 'clear'].includes(weather.condition),
        isWindy: weather.windSpeed > 15
      });

      // Update recommendations
      dispatch(setRecommendations({
        tops: result.recommendations.tops.map(item => item.name),
        bottoms: result.recommendations.bottoms.map(item => item.name),
        accessories: result.recommendations.accessories.map(item => item.name),
        description: result.description + (result.layering ? ` ${result.layering}` : '')
      }));
    } catch (err) {
      console.error('Error generating recommendations:', err);
      dispatch(setError(err instanceof Error ? err.message : 'Failed to generate recommendations'));
    } finally {
      // Always set loading to false at the end
      dispatch(setLoading(false));
    }
  }, [weather, dispatch]);

  useEffect(() => {
    if (weather) {
      generateRecommendations();
    }
  }, [weather, generateRecommendations]);

  if (isLoading) {
    return <div className="clothing-recommendations loading">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="clothing-recommendations error">{error}</div>;
  }

  if (!recommendations || !weather) {
    return <div className="clothing-recommendations empty">No recommendations available</div>;
  }

  const getImagePath = (itemName: string, category: string) => {
    try {
      // Find the item in clothing-details.json
      const items = (clothingData.clothing as any)[category];
      const item = Object.values(items).find((item: any) => item.name === itemName);
      
      if (!item) {
        console.error(`Item not found: ${itemName} in category ${category}`);
        return '';
      }

      return new URL(`../assets/${(item as any).imagePath}`, import.meta.url).href;
    } catch (err) {
      console.error('Error creating image path:', err);
      return '';
    }
  };

  return (
    <div className="clothing-recommendations">
      <h2>Weather Details</h2>
      <div className="weather-details">
        <p>Current: {weather.temperature}°C</p>
        <p>Feels Like: {weather.feelsLike}°C</p>
        <p>Range: {weather.minTemp}°C - {weather.maxTemp}°C</p>
      </div>
      
      <p className="description">{recommendations.description}</p>
      
      <div className="recommendations-container">
        <section className="clothing-section">
          <h3>Tops</h3>
          <div className="clothing-items">
            {recommendations.tops.map((item, index) => (
              <div key={`top-${index}`} className="clothing-item">
                <img 
                  src={getImagePath(item, 'tops')}
                  alt={item}
                  onError={(e) => {
                    console.error(`Failed to load image for ${item}`);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.textContent = item;
                  }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="clothing-section">
          <h3>Bottoms</h3>
          <div className="clothing-items">
            {recommendations.bottoms.map((item, index) => (
              <div key={`bottom-${index}`} className="clothing-item">
                <img 
                  src={getImagePath(item, 'bottoms')}
                  alt={item}
                  onError={(e) => {
                    console.error(`Failed to load image for ${item}`);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.textContent = item;
                  }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="clothing-section">
          <h3>Accessories</h3>
          <div className="clothing-items">
            {recommendations.accessories.map((item, index) => (
              <div key={`accessory-${index}`} className="clothing-item">
                <img 
                  src={getImagePath(item, 'accessories')}
                  alt={item}
                  onError={(e) => {
                    console.error(`Failed to load image for ${item}`);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.textContent = item;
                  }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClothingRecommendations; 