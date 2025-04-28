
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePersonality } from '@/providers/PersonalityProvider';
import PersonalityNavigation from './PersonalityNavigation';
import { Slider } from '@/components/ui/slider';

const PersonalitySliders: React.FC = () => {
  const { sliders, updateSliderValue, resetSliders } = usePersonality();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  
  const getTooltipText = (slider: any) => {
    if (slider.value <= 0) return "";
    
    // Value is 0-10, so we need to map to array index 0-9
    const index = Math.min(Math.floor(slider.value - 1), 9);
    return slider.tooltips[index];
  };

  return (
    <div className="container mx-auto px-[120px] pt-8 pb-20">
      <PersonalityNavigation type="top" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Position your brand personality.</h1>
        <p className="text-lg text-muted-foreground">
          Drag the sliders to define where your brand sits between these polarities.
        </p>
      </motion.div>
      
      <div className="space-y-16 w-[900px] mx-auto">
        {sliders.map((slider, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
            onMouseEnter={() => setActiveTooltip(index)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <div className="flex justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#333] rounded-md flex items-center justify-center text-lg font-bold">
                  {slider.leftBrand.charAt(0)}
                </div>
                <span className="ml-2 text-sm">{slider.leftBrand}</span>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2 text-sm">{slider.rightBrand}</span>
                <div className="w-8 h-8 bg-[#333] rounded-md flex items-center justify-center text-lg font-bold">
                  {slider.rightBrand.charAt(0)}
                </div>
              </div>
            </div>
            
            <div className="relative mb-2">
              <Slider
                value={[slider.value]}
                min={1}
                max={10}
                step={1}
                onValueChange={(values) => updateSliderValue(slider.axis, values[0])}
                className="my-4"
              />
              
              {/* Current position marker */}
              <div 
                className="absolute top-0 w-0 h-0 transform -translate-x-1/2"
                style={{ 
                  left: `${(slider.value - 1) / 9 * 100}%`,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '8px solid #7DF9FF'
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{slider.axis.split(' ↔ ')[0]}</span>
              <span>{slider.axis.split(' ↔ ')[1]}</span>
            </div>
            
            {/* Tooltip */}
            {activeTooltip === index && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#444] text-sm p-3 rounded-md mt-2 text-center"
              >
                {getTooltipText(slider)}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      <PersonalityNavigation />
    </div>
  );
};

export default PersonalitySliders;
