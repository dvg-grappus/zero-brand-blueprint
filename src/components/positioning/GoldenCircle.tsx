
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import StickyNote from "./StickyNote";
import CircleSegment from "./CircleSegment";
import { Button } from "@/components/ui/button";
import { PositioningContext } from "@/pages/StepPage";
import StepNavBar from "./StepNavBar";

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
  const { selectedGoldenCircle, setSelectedGoldenCircle, completeStep } = useContext(PositioningContext);
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

  const handleDiscard = () => {
    // Currently a no-op as requested
  };

  const handleComplete = () => {
    if (completeStep) {
      completeStep("golden-circle");
    }
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
      
      <div className="flex flex-col md:flex-row justify-center items-start gap-8">
        {/* Left side - Circles */}
        <div className="w-full md:w-1/3 flex justify-center">
          <svg width="300" height="300" viewBox="0 0 300 300">
            <g onClick={() => handleSegmentClick('why')}>
              <circle
                cx="150"
                cy="150"
                r="120"
                fill={activeSegment === 'why' ? "rgba(200, 200, 200, 0.2)" : "transparent"}
                className="transition-colors duration-300 cursor-pointer"
              />
              <circle
                cx="150"
                cy="150"
                r="120"
                fill="transparent"
                stroke={activeSegment === 'why' ? "hsl(var(--cyan))" : "#E0E0E0"}
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              <text
                x="150"
                y="60"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={activeSegment === 'why' ? "hsl(var(--cyan))" : "#999999"}
                className="font-semibold text-xl transition-colors duration-300 pointer-events-none"
              >
                WHY
              </text>
            </g>
            
            <g onClick={() => handleSegmentClick('how')}>
              <circle
                cx="150"
                cy="150"
                r="85"
                fill={activeSegment === 'how' ? "rgba(200, 200, 200, 0.2)" : "transparent"}
                className="transition-colors duration-300 cursor-pointer"
              />
              <circle
                cx="150"
                cy="150"
                r="85"
                fill="transparent"
                stroke={activeSegment === 'how' ? "hsl(var(--cyan))" : "#E0E0E0"}
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              <text
                x="150"
                y="95"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={activeSegment === 'how' ? "hsl(var(--cyan))" : "#999999"}
                className="font-semibold text-xl transition-colors duration-300 pointer-events-none"
              >
                HOW
              </text>
            </g>
            
            <g onClick={() => handleSegmentClick('what')}>
              <circle
                cx="150"
                cy="150"
                r="50"
                fill={activeSegment === 'what' ? "rgba(200, 200, 200, 0.2)" : "transparent"}
                className="transition-colors duration-300 cursor-pointer"
              />
              <circle
                cx="150"
                cy="150"
                r="50"
                fill="transparent"
                stroke={activeSegment === 'what' ? "hsl(var(--cyan))" : "#E0E0E0"}
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              <text
                x="150"
                y="150"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={activeSegment === 'what' ? "hsl(var(--cyan))" : "#999999"}
                className="font-semibold text-xl transition-colors duration-300 pointer-events-none"
              >
                WHAT
              </text>
            </g>
          </svg>
        </div>
        
        {/* Right side - Sticky notes */}
        <div className="w-full md:w-2/3">
          <h3 className="text-lg font-medium mb-4 text-left">
            {activeSegment.toUpperCase()} Statements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  onDiscard={handleDiscard}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <StepNavBar
        title="Golden Circle"
        nextStep="opportunities-challenges"
        nextButtonLabel="Complete & Continue"
        isButtonDisabled={
          selectedGoldenCircle.why.length === 0 ||
          selectedGoldenCircle.how.length === 0 ||
          selectedGoldenCircle.what.length === 0
        }
        onNext={handleComplete}
      />
    </div>
  );
};

export default GoldenCircle;
