import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import StickyNote from "./StickyNote";
import CircleSegment from "./CircleSegment";
import { PositioningContext } from "@/pages/StepPage";

const mockIdeas = {
  why: [
    "To democratize professional design tools",
    "To empower non-designers with agency",
    "To make branding accessible to all",
    "To revolutionize creative workflows",
    "To bridge the design equality gap",
    "To enable brand innovation for everyone"
  ],
  how: [
    "Through AI-powered creative assistance",
    "With step-by-step guided pathways",
    "Using pre-validated design patterns",
    "By automating complex design tasks",
    "Through intuitive brand building tools",
    "With collaborative design workflows"
  ],
  what: [
    "A brand identity system generator",
    "An AI branding platform",
    "A visual identity automation suite",
    "A design democratization tool",
    "A brand strategy assistant",
    "An automated brand builder"
  ]
};

const GoldenCircle: React.FC = () => {
  const { selectedGoldenCircle, setSelectedGoldenCircle } = useContext(PositioningContext);
  const [activeSegment, setActiveSegment] = useState<'why' | 'how' | 'what'>('why');

  const handleSegmentClick = (segment: 'why' | 'how' | 'what') => {
    setActiveSegment(segment);
  };

  const handleSelect = (type: 'why' | 'how' | 'what', idea: string) => {
    setSelectedGoldenCircle(prev => ({
      ...prev,
      [type]: prev[type].includes(idea) 
        ? prev[type].filter(i => i !== idea)
        : [...prev[type], idea]
    }));
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
      
      <div className="relative flex justify-center items-start gap-16">
        <div className="w-1/3">
          <svg width="300" height="300" viewBox="0 0 300 300">
            <CircleSegment
              label="WHY"
              radius={100}
              isActive={activeSegment === 'why'}
              onClick={() => handleSegmentClick('why')}
            />
            <CircleSegment
              label="HOW"
              radius={75}
              isActive={activeSegment === 'how'}
              onClick={() => handleSegmentClick('how')}
            />
            <CircleSegment
              label="WHAT"
              radius={50}
              isActive={activeSegment === 'what'}
              onClick={() => handleSegmentClick('what')}
            />
          </svg>
        </div>
        
        <div className="w-2/3">
          <h3 className="text-lg font-medium mb-4 text-left">
            {activeSegment.toUpperCase()} Statements
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {mockIdeas[activeSegment].map((idea, index) => (
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
