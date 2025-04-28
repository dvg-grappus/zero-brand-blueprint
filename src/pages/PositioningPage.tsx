
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import TimelineTopBar from "@/components/TimelineTopBar";

const PositioningPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCompleteStep = () => {
    navigate('/timeline', { state: { fromPositioning: true } });
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-foreground">
      <TimelineTopBar currentStep={1} completedSteps={[]} />
      
      <div className="pt-[88px] min-h-[calc(100vh-88px)] flex flex-col items-center justify-center">
        <h1 className="text-[32px] font-bold mb-6">Positioning Module</h1>
        <p className="text-muted-foreground mb-8">This module is currently in development.</p>
        
        <Button 
          onClick={handleCompleteStep}
          className="bg-cyan text-black hover:bg-cyan/90"
        >
          Complete and continue →
        </Button>
      </div>
    </div>
  );
};

export default PositioningPage;
