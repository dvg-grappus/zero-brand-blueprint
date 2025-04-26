import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import StickyNote from "./StickyNote";
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

interface GoldenCircleProps {}

const GoldenCircle: React.FC = () => {
  const { briefContext, selectedGoldenCircle, setSelectedGoldenCircle, completeStep } = useContext(PositioningContext);
  const [isLoading, setIsLoading] = useState(true);
  const [ideas, setIdeas] = useState(mockIdeas);
  const [discardedIdeas, setDiscardedIdeas] = useState<Record<string, string[]>>({
    why: [],
    how: [],
    what: []
  });

  useEffect(() => {
    // Simulate GPT API call
    const timer = setTimeout(() => {
      // Here you would make the actual API call using briefContext
      console.log("Using brief:", briefContext);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [briefContext]);

  const handleSelect = (section: 'why' | 'how' | 'what', idea: string) => {
    setSelectedGoldenCircle(prev => {
      const newSelected = { ...prev };
      
      if (newSelected[section].includes(idea)) {
        // Deselect if already selected
        newSelected[section] = newSelected[section].filter(i => i !== idea);
      } else {
        // Select new idea
        newSelected[section] = [...newSelected[section], idea];
      }
      
      return newSelected;
    });
  };

  const handleDiscard = (section: 'why' | 'how' | 'what', idea: string) => {
    setDiscardedIdeas(prev => {
      const newDiscarded = { ...prev };
      
      if (newDiscarded[section].includes(idea)) {
        // Un-discard if already discarded
        newDiscarded[section] = newDiscarded[section].filter(i => i !== idea);
      } else {
        // Discard new idea
        newDiscarded[section] = [...newDiscarded[section], idea];
      }
      
      return newDiscarded;
    });
  };

  const validateSelection = () => {
    const hasWhy = selectedGoldenCircle.why.length > 0;
    const hasHow = selectedGoldenCircle.how.length > 0;
    const hasWhat = selectedGoldenCircle.what.length > 0;
    
    if (!hasWhy || !hasHow || !hasWhat) {
      toast.error("Select at least one idea from each ring");
      return false;
    }
    
    return true;
  };

  const handleComplete = () => {
    if (!validateSelection()) return;
    
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
      
      <div className="relative flex justify-center items-center min-h-[500px] max-w-[800px] mx-auto">
        {/* Circle SVG */}
        <svg width="600" height="600" viewBox="0 0 600 600" className="absolute">
          <circle cx="300" cy="300" r="300" fill="none" stroke="#E0E0E0" strokeWidth="1" />
          <circle cx="300" cy="300" r="220" fill="none" stroke="#E0E0E0" strokeWidth="1" />
          <circle cx="300" cy="300" r="140" fill="none" stroke="#E0E0E0" strokeWidth="1" />
          
          <text x="300" y="300" textAnchor="middle" dominantBaseline="middle" 
            fill="#999999" fontFamily="'Satoshi', sans-serif" fontSize="16" fontWeight="600">
            WHY
          </text>
          
          <text x="300" y="140" textAnchor="middle" dominantBaseline="middle" 
            fill="#999999" fontFamily="'Satoshi', sans-serif" fontSize="16" fontWeight="600">
            HOW
          </text>
          
          <text x="300" y="520" textAnchor="middle" dominantBaseline="middle" 
            fill="#999999" fontFamily="'Satoshi', sans-serif" fontSize="16" fontWeight="600">
            WHAT
          </text>
        </svg>
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-[180px] h-[220px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
            <p className="text-gray-500">Still shaping ideas... one second.</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* WHY Cards */}
            {ideas.why.map((idea, index) => (
              <motion.div
                key={`why-${index}`}
                className="absolute"
                style={{
                  left: `${300 + Math.cos(index * Math.PI/1.5) * 80 - 60}px`,
                  top: `${300 + Math.sin(index * Math.PI/1.5) * 80 - 80}px`,
                }}
                initial={{ x: 300 - 60, y: 300 - 80 }}
                animate={{ 
                  x: selectedGoldenCircle.why.includes(idea) ? -8 : 0,
                  y: selectedGoldenCircle.why.includes(idea) ? -8 : 0,
                  boxShadow: selectedGoldenCircle.why.includes(idea) ? "0 0 15px rgba(125, 249, 255, 0.5)" : "none"
                }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <StickyNote
                  id={`why-${index}`}
                  content={idea}
                  isSelected={selectedGoldenCircle.why.includes(idea)}
                  isDiscarded={discardedIdeas.why.includes(idea)}
                  onClick={() => handleSelect('why', idea)}
                  onDiscard={() => handleDiscard('why', idea)}
                />
              </motion.div>
            ))}
            
            {/* HOW Cards */}
            {ideas.how.map((idea, index) => (
              <motion.div
                key={`how-${index}`}
                className="absolute"
                style={{
                  left: `${300 + Math.cos(index * Math.PI/1.5 + Math.PI/4) * 160 - 60}px`,
                  top: `${300 + Math.sin(index * Math.PI/1.5 + Math.PI/4) * 160 - 80}px`,
                }}
                initial={{ x: 300 - 60, y: 300 - 80 }}
                animate={{ 
                  x: selectedGoldenCircle.how.includes(idea) ? -8 : 0,
                  y: selectedGoldenCircle.how.includes(idea) ? -8 : 0,
                  boxShadow: selectedGoldenCircle.how.includes(idea) ? "0 0 15px rgba(125, 249, 255, 0.5)" : "none"
                }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <StickyNote
                  id={`how-${index}`}
                  content={idea}
                  isSelected={selectedGoldenCircle.how.includes(idea)}
                  isDiscarded={discardedIdeas.how.includes(idea)}
                  onClick={() => handleSelect('how', idea)}
                  onDiscard={() => handleDiscard('why', idea)}
                />
              </motion.div>
            ))}
            
            {/* WHAT Cards */}
            {ideas.what.map((idea, index) => (
              <motion.div
                key={`what-${index}`}
                className="absolute"
                style={{
                  left: `${300 + Math.cos(index * Math.PI/1.5 + Math.PI/8) * 240 - 60}px`,
                  top: `${300 + Math.sin(index * Math.PI/1.5 + Math.PI/8) * 240 - 80}px`,
                }}
                initial={{ x: 300 - 60, y: 300 - 80 }}
                animate={{ 
                  x: selectedGoldenCircle.what.includes(idea) ? -8 : 0,
                  y: selectedGoldenCircle.what.includes(idea) ? -8 : 0,
                  boxShadow: selectedGoldenCircle.what.includes(idea) ? "0 0 15px rgba(125, 249, 255, 0.5)" : "none"
                }}
                transition={{ duration: 1, type: "spring" }}
              >
                <StickyNote
                  id={`what-${index}`}
                  content={idea}
                  isSelected={selectedGoldenCircle.what.includes(idea)}
                  isDiscarded={discardedIdeas.what.includes(idea)}
                  onClick={() => handleSelect('what', idea)}
                  onDiscard={() => handleDiscard('how', idea)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-right">
        <Button
          onClick={handleComplete}
          className="bg-black text-white hover:bg-cyan hover:text-black transition-colors"
        >
          Complete & Continue
        </Button>
      </div>
    </div>
  );
};

export default GoldenCircle;
