
import React from "react";
import { motion } from "framer-motion";

const stepMap: Record<string, number> = {
  "brief": 0,
  "golden-circle": 1,
  "opportunities-challenges": 2,
  "roadmap": 3,
  "values": 4,
  "differentiators": 5,
  "statements": 6
};

interface StepProgressProps {
  currentStep: string;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const currentIndex = stepMap[currentStep] || 0;
  const totalSteps = 6; // Total number of steps
  
  return (
    <motion.div 
      className="fixed top-[32px] right-[120px] flex gap-3 z-30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        
        let bgColor = "";
        if (isCompleted) bgColor = "bg-cyan";
        else if (isCurrent) bgColor = "bg-black";
        
        return (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full border border-[#E0E0E0] ${bgColor} transition-colors duration-300`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          />
        );
      })}
    </motion.div>
  );
};

export default StepProgress;
