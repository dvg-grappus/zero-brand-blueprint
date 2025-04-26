import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepNavBarProps {
  title: string;
  nextStep: string;
  nextButtonLabel: string;
  isButtonDisabled: boolean;
  onNext?: () => void;
}

const StepNavBar: React.FC<StepNavBarProps> = ({
  title,
  nextStep,
  nextButtonLabel,
  isButtonDisabled,
  onNext
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    const currentPath = window.location.pathname;
    
    if (currentPath.endsWith("brief")) {
      navigate("/timeline");
    } else if (currentPath.endsWith("golden-circle")) {
      navigate("/step/1/brief");
    } else if (currentPath.endsWith("opportunities-challenges")) {
      navigate("/step/1/golden-circle");
    } else if (currentPath.endsWith("roadmap")) {
      navigate("/step/1/opportunities-challenges");
    } else if (currentPath.endsWith("values")) {
      navigate("/step/1/roadmap");
    } else if (currentPath.endsWith("differentiators")) {
      navigate("/step/1/values");
    } else if (currentPath.endsWith("statements")) {
      navigate("/step/1/differentiators");
    } else {
      navigate("/timeline");
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigate(nextStep, { replace: true });
    }
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-[#E0E0E0] flex items-center justify-between px-[120px] z-30"
      initial={{ y: 64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Button 
        variant="ghost" 
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>
      
      <div className="font-medium text-[15px] text-gray-600">
        {title}
      </div>
      
      <Button 
        onClick={handleNext} 
        disabled={isButtonDisabled}
        className="bg-black text-white hover:bg-cyan hover:text-black transition-colors"
      >
        {nextButtonLabel}
      </Button>
    </motion.div>
  );
};

export default StepNavBar;
