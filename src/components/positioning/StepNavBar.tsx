
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StepNavBarProps {
  title?: string;
  nextStep?: string;
  nextButtonLabel?: string;
  isButtonDisabled?: boolean;
  onNext?: () => void;
}

const StepNavBar: React.FC<StepNavBarProps> = ({
  title,
  nextStep,
  nextButtonLabel = "Next",
  isButtonDisabled = false,
  onNext
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onNext) {
      onNext();
    }
    
    if (nextStep) {
      navigate(nextStep);
    }
  };
  
  return (
    <div className="mt-8 flex justify-end">
      <Button
        onClick={handleClick}
        className="bg-white text-black border border-gray-300 hover:bg-gray-50 shadow-sm transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
        // Remove disabled prop to allow clicking regardless of validation
      >
        {nextButtonLabel}
      </Button>
    </div>
  );
};

export default StepNavBar;
