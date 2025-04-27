
import React from "react";
import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";

interface TopBarProps {
  currentStep: number;
  completedSteps: number[];
}

const TimelineTopBar: React.FC<TopBarProps> = ({ currentStep, completedSteps }) => {
  const totalSteps = 14;
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-[88px] bg-background/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-[120px] z-30"
      initial={{ y: -88 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-cyan rounded-full"></div>
        <h1 className="inter-font text-[18px] font-medium tracking-wide text-foreground/90">
          North of Zero
        </h1>
      </div>
      
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;
          
          return (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                isCompleted 
                  ? 'w-8 bg-cyan' 
                  : isCurrent 
                    ? 'w-8 bg-foreground'
                    : 'w-4 bg-border/70'
              }`}
            />
          );
        })}
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-sm">Draft #041</span>
        <div className="w-8 h-8 rounded-full bg-secondary/80 border border-border/60 flex items-center justify-center text-xs text-muted-foreground/70 backdrop-blur-sm">
          <span>A</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineTopBar;
