
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
  return (
    <div className="mt-8 flex justify-end">
      <Button
        onClick={onNext}
        className="bg-white text-black border border-gray-300 hover:bg-gray-50 shadow-sm transition-colors"
      >
        {nextButtonLabel}
      </Button>
    </div>
  );
};

export default StepNavBar;
