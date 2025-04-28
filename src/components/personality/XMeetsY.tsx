
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonality } from '@/providers/PersonalityProvider';
import PersonalityNavigation from './PersonalityNavigation';
import { Button } from '@/components/ui/button';
import { Shuffle, Save } from 'lucide-react';

interface BrandLogoProps {
  brand: any;
  onClick?: () => void;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ brand, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-[120px] h-[120px] bg-[#262626] rounded-md flex items-center justify-center cursor-pointer border border-border/30 hover:border-cyan/50"
      onClick={onClick}
    >
      <span className="text-3xl font-bold">{brand.logo}</span>
    </motion.div>
  );
};

const XMeetsY: React.FC = () => {
  const { 
    brands, 
    combination, 
    setBrandA, 
    setBrandB, 
    saveCombination
  } = usePersonality();
  
  const [selectingSlot, setSelectingSlot] = useState<'A' | 'B' | null>(null);
  
  const handleSlotClick = (slot: 'A' | 'B') => {
    setSelectingSlot(slot);
  };
  
  const handleBrandSelect = (brand: any) => {
    if (selectingSlot === 'A') {
      setBrandA(brand);
    } else if (selectingSlot === 'B') {
      setBrandB(brand);
    }
    setSelectingSlot(null);
  };
  
  const handleRandomSelect = () => {
    const randomA = brands[Math.floor(Math.random() * brands.length)];
    let randomB = brands[Math.floor(Math.random() * brands.length)];
    // Make sure we don't pick the same brand twice
    while (randomB === randomA) {
      randomB = brands[Math.floor(Math.random() * brands.length)];
    }
    
    setBrandA(randomA);
    setBrandB(randomB);
  };
  
  return (
    <div className="container mx-auto px-[120px] pt-8 pb-20">
      <PersonalityNavigation type="top" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-4xl font-bold mb-4">X meets Y formula.</h1>
        <p className="text-lg text-muted-foreground">
          Select two brands to create a unique hybrid identity concept.
        </p>
      </motion.div>
      
      {/* Brand combination banner */}
      <motion.div 
        className="w-full bg-[#262626] rounded-xl p-8 mb-8 flex justify-center items-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-4 right-4"
          onClick={handleRandomSelect}
        >
          <Shuffle className="mr-1 h-4 w-4" />
          Shuffle
        </Button>
        
        {/* Slot A */}
        <div 
          onClick={() => handleSlotClick('A')}
          className={`
            w-[140px] h-[60px] rounded-md flex items-center justify-center mx-2
            ${combination.brandA ? 'bg-transparent border-2 border-cyan' : 'bg-[#333] cursor-pointer hover:bg-[#444]'}
          `}
        >
          {combination.brandA ? (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{combination.brandA.logo}</span>
              <span className="text-xs mt-1">{combination.brandA.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Select brand</span>
          )}
        </div>
        
        <div className="mx-4 text-xl font-semibold">meets</div>
        
        {/* Slot B */}
        <div 
          onClick={() => handleSlotClick('B')}
          className={`
            w-[140px] h-[60px] rounded-md flex items-center justify-center mx-2
            ${combination.brandB ? 'bg-transparent border-2 border-cyan' : 'bg-[#333] cursor-pointer hover:bg-[#444]'}
          `}
        >
          {combination.brandB ? (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{combination.brandB.logo}</span>
              <span className="text-xs mt-1">{combination.brandB.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Select brand</span>
          )}
        </div>
      </motion.div>
      
      {/* Generated summary - shown when both brands are selected */}
      <AnimatePresence>
        {combination.brandA && combination.brandB && (
          <motion.div
            className="w-[560px] h-[280px] bg-[#262626] rounded-xl p-6 mx-auto mb-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-3">
              What {combination.brandA.name} × {combination.brandB.name} means
            </h3>
            
            <p className="text-sm mb-4 text-muted-foreground">
              {combination.brandA.name} × {combination.brandB.name} represents a fusion of {combination.brandA.name}'s innovation with {combination.brandB.name}'s approach. This combination creates a brand identity that balances technical excellence with user-friendly design, appealing to customers who value both cutting-edge solutions and seamless experiences.
            </p>
            
            <div className="space-y-2 mb-4">
              <p className="text-xs text-cyan font-medium">IMPLICATIONS</p>
              <ul className="text-xs space-y-1 list-inside list-disc">
                <li>Voice: Adopt {combination.brandA.name}'s clarity with {combination.brandB.name}'s approachability.</li>
                <li>Visual: Blend {combination.brandA.name}'s minimalism with {combination.brandB.name}'s vibrant aesthetic.</li>
                <li>Behavior: Balance {combination.brandA.name}'s precision with {combination.brandB.name}'s customer focus.</li>
              </ul>
            </div>
            
            <Button 
              onClick={saveCombination}
              className="mt-2"
            >
              <Save className="mr-2 h-4 w-4" />
              Save combination
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Brand grid - grayed out when selecting a brand */}
      <div className={`${selectingSlot ? 'opacity-100' : 'opacity-100'}`}>
        {selectingSlot && (
          <motion.div 
            className="mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg">Select a brand for slot {selectingSlot}</p>
          </motion.div>
        )}
        
        <div className="grid grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <BrandLogo 
                brand={brand} 
                onClick={() => selectingSlot ? handleBrandSelect(brand) : null}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      <PersonalityNavigation />
    </div>
  );
};

export default XMeetsY;
