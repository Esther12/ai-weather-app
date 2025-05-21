import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ClothingItem } from './ClothingItem';
import { MobileCarousel } from './MobileCarousel';
import clothingData from '../data/clothing-details.json';

interface ClothingItem {
    name: string;
    type: 'tops' | 'bottoms' | 'accessories';
}

interface ClothingRecommendationDisplayProps {
    recommendations: {
        tops: string[];
        bottoms: string[];
        accessories: string[];
    };
}

const getImageUrl = (itemName: string, category: string) => {
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

const ClothingSection: React.FC<{ title: string; items: string[]; type: string }> = ({ title, items, type }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                {title}
            </Typography>
            {isMobile ? (
                <MobileCarousel items={items} type={type} />
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 2,
                    width: '100%'
                }}>
                    {items.map((item, index) => (
                        <ClothingItem key={index} item={item} type={type} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

const ClothingRecommendationDisplay: React.FC<ClothingRecommendationDisplayProps> = ({ recommendations }) => {
    return (
        <Box sx={{ width: '100%' }}>
            <ClothingSection title="Tops" items={recommendations.tops} type="tops" />
            <ClothingSection title="Bottoms" items={recommendations.bottoms} type="bottoms" />
            <ClothingSection title="Accessories" items={recommendations.accessories} type="accessories" />
        </Box>
    );
};

export default ClothingRecommendationDisplay; 