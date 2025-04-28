
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import TimelineTopBar from "@/components/TimelineTopBar";
import BriefIntake from "@/components/positioning/BriefIntake";

const PositioningPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCompleteStep = () => {
    console.log("Completing positioning step");
    navigate('/timeline', { state: { fromPositioning: true } });
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-foreground">
      <TimelineTopBar currentStep={1} completedSteps={[]} />
      
      <div className="pt-[88px] px-[120px] pb-20">
        <h1 className="text-[32px] font-bold mb-6">Positioning Module</h1>
        
        <div className="bg-card rounded-lg p-6 shadow-md mb-8">
          <BriefIntake onComplete={handleCompleteStep} />
        </div>
        
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleCompleteStep}
            className="bg-cyan text-black hover:bg-cyan/90"
          >
            Complete and continue →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PositioningPage;
