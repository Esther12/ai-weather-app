import React from 'react';
import { Box, Typography } from '@mui/material';
import type { ClothingComponent } from '../types/clothing';
import clothingData from '../data/clothing-details.json';

const getImageUrl = (itemName: string, category: string) => {
    try {
        // Find the item in clothing-details.json
        const items = (clothingData.clothing as any)[category];
        const item = Object.values(items).find((item: any) => item.name === itemName);
        
        if (!item) {
            console.error(`Item not found: ${itemName} in category ${category}`);
            return '';
        }

        // Use direct path to assets
        const imagePath = `/src/assets/${(item as any).imagePath}`;
        console.log('Image path:', imagePath);
        return imagePath;
    } catch (err) {
        console.error('Error creating image path:', err);
        return '';
    }
};

export const ClothingItem: ClothingComponent = ({ item, type }) => {
    console.log('ClothingItem rendered:', { item, type });
    const imageUrl = getImageUrl(item, type);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            height: '100%',
            minWidth: { xs: '100%', md: 200 },
            maxWidth: { md: 250 }
        }}>
            <Box 
                sx={{
                    width: '100%',
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    borderRadius: 1,
                    overflow: 'hidden'
                }}
            >
                {imageUrl ? (
                    <img 
                        src={imageUrl}
                        alt={item}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            console.error(`Failed to load image for ${item}`);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.textContent = item;
                        }}
                    />
                ) : (
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                        {item}
                    </Typography>
                )}
            </Box>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                {item}
            </Typography>
        </Box>
    );
}; 