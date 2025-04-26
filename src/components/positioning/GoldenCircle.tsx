
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import StickyNote from "./StickyNote";
import CircleSegment from "./CircleSegment";
import { Button } from "@/components/ui/button";
import { PositioningContext } from "@/pages/StepPage";

// Reduced mock data
const mockIdeas = {
  why: [
    "To democratize professional design tools",
    "To empower non-designers with agency",
    "To make branding accessible to all"
  ],
  how: [
    "Through AI-powered creative assistance",
    "With step-by-step guided pathways",
    "Using pre-validated design patterns"
  ],
  what: [
    "A brand identity system generator",
    "An AI branding platform",
    "A visual identity automation suite"
  ]
};

const GoldenCircle: React.FC = () => {
  const { selectedGoldenCircle, setSelectedGoldenCircle, completeStep } = useContext(PositioningContext);
  const [activeSegment, setActiveSegment] = useState<'why' | 'how' | 'what'>('why');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (type: 'why' | 'how' | 'what', idea: string) => {
    setSelectedGoldenCircle(prev => ({
      ...prev,
      [type]: prev[type].includes(idea) 
        ? prev[type].filter(i => i !== idea)
        : [...prev[type], idea]
    }));
  };

  const handleSegmentClick = (segment: 'why' | 'how' | 'what') => {
    setActiveSegment(segment);
  };

  // Only show up to 4 cards for the active segment
  const getVisibleIdeas = (type: 'why' | 'how' | 'what') => {
    const ideas = mockIdeas[type];
    return ideas.slice(0, 4);
  };

  // Calculate positions for the sticky notes in a circle arrangement
  const getPositionForIndex = (index: number, total: number) => {
    // Place cards at specific positions for better layout
    const angleOffset = Math.PI / 2; // Start from top (90 degrees)
    const angle = angleOffset + (index / total) * (2 * Math.PI);
    
    // Distance from center depends on the active segment
    let distance = 180;
    
    if (activeSegment === 'what') {
      distance = 220;
    } else if (activeSegment === 'how') {
      distance = 140;
    } else {
      distance = 100;
    }
    
    return {
      left: 300 + Math.cos(angle) * distance,
      top: 300 + Math.sin(angle) * distance
    };
  };

  return (
    <div className="text-center">
      <motion.h2
        className="text-[24px] font-bold mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Golden Circle
      </motion.h2>
      
      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        Start with purpose, not outputs.
      </motion.p>
      
      <div className="relative flex justify-center items-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-[180px] h-[220px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
            <p className="text-gray-500">Still shaping ideas... one second.</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <div className="flex justify-center">
              {/* SVG Container with fixed dimensions */}
              <div className="relative w-[600px] h-[600px]">
                {/* Interactive Circle SVG */}
                <svg width="600" height="600" viewBox="0 0 600 600" className="absolute">
                  <CircleSegment
                    label="WHAT"
                    radius={220}
                    isActive={activeSegment === 'what'}
                    onClick={() => handleSegmentClick('what')}
                  />
                  <CircleSegment
                    label="HOW"
                    radius={140}
                    isActive={activeSegment === 'how'}
                    onClick={() => handleSegmentClick('how')}
                  />
                  <CircleSegment
                    label="WHY"
                    radius={80}
                    isActive={activeSegment === 'why'}
                    onClick={() => handleSegmentClick('why')}
                  />
                </svg>
                
                {/* Display cards for active segment */}
                <div className="absolute top-0 left-0 w-full h-full">
                  {getVisibleIdeas(activeSegment).map((idea, index) => {
                    const totalIdeas = getVisibleIdeas(activeSegment).length;
                    const position = getPositionForIndex(index, totalIdeas);
                    
                    return (
                      <motion.div
                        key={`${activeSegment}-${index}`}
                        className="absolute"
                        style={{
                          left: `${position.left - 70}px`,  // Center the card (half of card width)
                          top: `${position.top - 80}px`,    // Center the card (half of card height)
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StickyNote
                          id={`${activeSegment}-${index}`}
                          content={idea}
                          isSelected={selectedGoldenCircle[activeSegment].includes(idea)}
                          isDiscarded={false}
                          onClick={() => handleSelect(activeSegment, idea)}
                          onDiscard={() => {}}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Button
          onClick={() => completeStep && completeStep("golden-circle")}
          className="bg-white text-black border border-border/40 hover:bg-cyan hover:text-black shadow-sm transition-colors"
        >
          Complete & Continue
        </Button>
      </div>
    </div>
  );
};

export default GoldenCircle;
