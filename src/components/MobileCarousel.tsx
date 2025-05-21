import React, { useState } from 'react';
import { Box, Button, Paper, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { ClothingItem } from './ClothingItem';

interface MobileCarouselProps {
    items: string[];
    type: string;
}

export const MobileCarousel: React.FC<MobileCarouselProps> = ({ items, type }) => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = items.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Box sx={{ width: '100%', flexGrow: 1 }}>
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'auto',
                    pl: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Box sx={{ width: '100%', p: 2 }}>
                    <ClothingItem item={items[activeStep]} type={type} />
                </Box>
            </Paper>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{ 
                    flexGrow: 1,
                    justifyContent: 'center',
                    bgcolor: 'background.default'
                }}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button 
                        size="small" 
                        onClick={handleBack} 
                        disabled={activeStep === 0}
                    >
                        <KeyboardArrowLeft />
                        Back
                    </Button>
                }
            />
        </Box>
    );
}; 