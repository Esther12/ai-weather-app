import type { ForecastItem } from '../types/weatherTypes';

export interface ClothingRecommendation {
    tops: string[];
    bottoms: string[];
    accessories: string[];
}

export const getNext12HoursForecast = (forecastList: ForecastItem[]): ForecastItem[] => {
    const currentTime = new Date();
    
    // Filter and sort forecasts for the next 12 hours
    return forecastList
        .filter(item => {
            const itemTime = new Date(item.dt_txt);
            const hoursDiff = (itemTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
            // Include forecasts from now up to next 12 hours
            return hoursDiff >= 0 && hoursDiff <= 12;
        })
        .sort((a, b) => new Date(a.dt_txt).getTime() - new Date(b.dt_txt).getTime());
};

export const getClothingRecommendations = (weatherData: ForecastItem): ClothingRecommendation => {
    const { main, weather, wind } = weatherData;
    const temp = main.temp;
    const isRaining = weather[0].main === 'Rain';
    const isSnowing = weather[0].main === 'Snow';
    const isWindy = wind.speed > 5.5; // Consider windy if speed > 5.5 m/s

    const recommendations: ClothingRecommendation = {
        tops: [],
        bottoms: [],
        accessories: []
    };

    // Temperature-based recommendations
    if (temp < 0) {
        recommendations.tops.push('Winter Coat', 'Sweater');
        recommendations.bottoms.push('Pants');
        recommendations.accessories.push('Hat', 'Gloves', 'Scarf');
    } else if (temp < 10) {
        recommendations.tops.push('Winter Coat', 'Sweater');
        recommendations.bottoms.push('Pants');
        recommendations.accessories.push('Gloves');
    } else if (temp < 20) {
        recommendations.tops.push('Blazer', 'Sweater');
        recommendations.bottoms.push('Pants', 'Jeans');
    } else if (temp < 25) {
        recommendations.tops.push('T-Shirt', 'Blazer');
        recommendations.bottoms.push('Jeans', 'Shorts');
    } else {
        recommendations.tops.push('T-Shirt');
        recommendations.bottoms.push('Shorts');
    }

    // Weather condition specific recommendations
    if (isRaining) {
        recommendations.tops.push('Blazer');
        recommendations.accessories.push('Hat');
    }

    if (isSnowing) {
        recommendations.tops.push('Winter Coat');
        recommendations.accessories.push('Gloves');
    }

    if (isWindy) {
        recommendations.tops.push('Blazer');
        recommendations.accessories.push('Hat');
    }

    return recommendations;
}; 