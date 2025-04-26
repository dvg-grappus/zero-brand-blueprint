
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
          <div className="flex flex-col md:flex-row gap-10 w-full justify-center">
            {/* Circles on the left */}
            <div className="w-full md:w-1/3 flex justify-center">
              <svg width="200" height="300" viewBox="0 0 200 300" className="relative">
                <CircleSegment
                  label="WHY"
                  radius={60}
                  isActive={activeSegment === 'why'}
                  onClick={() => handleSegmentClick('why')}
                />
                <CircleSegment
                  label="HOW"
                  radius={45}
                  isActive={activeSegment === 'how'}
                  onClick={() => handleSegmentClick('how')}
                />
                <CircleSegment
                  label="WHAT"
                  radius={30}
                  isActive={activeSegment === 'what'}
                  onClick={() => handleSegmentClick('what')}
                />
              </svg>
            </div>
            
            {/* Cards on the right */}
            <div className="w-full md:w-2/3">
              <h3 className="text-lg font-medium mb-4 text-left">
                {activeSegment.toUpperCase()} Statements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getVisibleIdeas(activeSegment).map((idea, index) => (
                  <motion.div
                    key={`${activeSegment}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
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
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Button
          onClick={() => completeStep && completeStep("golden-circle")}
          className="bg-white text-black border border-gray-300 hover:bg-cyan hover:text-black shadow-sm transition-colors"
        >
          Complete & Continue
        </Button>
      </div>
    </div>
  );
};

export default GoldenCircle;
