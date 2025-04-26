
import React from "react";
import { motion } from "framer-motion";

interface TopBarProps {
  currentStep: number;
  completedSteps: number[];
}

const TimelineTopBar: React.FC<TopBarProps> = ({ currentStep, completedSteps }) => {
  const totalSteps = 14;
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-[88px] bg-white flex items-center justify-between px-[120px] z-30 shadow-topbar"
      initial={{ y: -88 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <div className="satoshi-font font-bold text-[20px] tracking-[0.5em] text-black">
        North of Zero
      </div>
      
      {/* Progress Squares */}
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;
          
          let bgColor = "";
          if (isCompleted) bgColor = "bg-cyan";
          else if (isCurrent) bgColor = "bg-black";
          
          return (
            <div
              key={i}
              className={`w-5 h-5 border border-[#E0E0E0] ${bgColor} transition-colors duration-300`}
            />
          );
        })}
      </div>
      
      {/* Draft Info and Avatar */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Draft #041</span>
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
      </div>
    </motion.div>
  );
};

export default TimelineTopBar;
