
import React from "react";
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
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="mt-8 flex justify-end">
      <Button
        onClick={handleNext}
        disabled={isButtonDisabled}
        className="bg-white text-black border border-border/40 hover:bg-cyan hover:text-black shadow-sm transition-colors disabled:opacity-50"
      >
        {nextButtonLabel}
      </Button>
    </div>
  );
};

export default StepNavBar;
