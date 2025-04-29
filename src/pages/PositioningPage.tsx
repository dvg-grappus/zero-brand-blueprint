
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import TimelineTopBar from "@/components/TimelineTopBar";
import BriefIntake from "@/components/positioning/BriefIntake";
import PositioningStep from "@/components/positioning/PositioningStep";
import GoldenCircle from "@/components/positioning/GoldenCircle";
import OpportunitiesChallenges from "@/components/positioning/OpportunitiesChallenges";
import Values from "@/components/positioning/Values";
import Roadmap from "@/components/positioning/Roadmap";
import Differentiators from "@/components/positioning/Differentiators";
import Statements from "@/components/positioning/Statements";
import { PositioningProvider } from "@/providers/PositioningProvider";
import { STEP_CONFIG } from "@/config/stepConfig";
import { usePositioning } from "@/contexts/PositioningContext";

// Wrapper component that provides the positioning context
const PositioningPageContent: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activeStep, 
    openSteps, 
    setOpenSteps,
    completedSteps,
    completeStep,
    positioningComplete
  } = usePositioning();

  const handleToggleStep = (stepId: string) => {
    setOpenSteps(prev => 
      prev.includes(stepId)
        ? prev.filter(step => step !== stepId)
        : [...prev, stepId]
    );
  };

  useEffect(() => {
    if (positioningComplete) {
      navigate('/timeline', { state: { fromPositioning: true } });
    }
  }, [positioningComplete, navigate]);

  const handleCompleteStep = () => {
    navigate('/timeline', { state: { fromPositioning: true } });
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-foreground">
      <TimelineTopBar currentStep={1} completedSteps={[]} />
      
      <div className="pt-[88px] px-6 md:px-[60px] lg:px-[120px] pb-20">
        <h1 className="text-[32px] font-bold mb-6">Positioning Module</h1>
        
        <div className="grid grid-cols-12 gap-6">
          {STEP_CONFIG.map((step, index) => (
            <PositioningStep
              key={step.id}
              id={step.id}
              title={step.name}
              index={index}
              isCompleted={completedSteps.includes(step.id)}
              isActive={activeStep === step.id}
              isOpen={openSteps.includes(step.id)}
              canOpen={
                completedSteps.includes(step.id) ||
                activeStep === step.id ||
                index === 0
              }
              onToggle={() => handleToggleStep(step.id)}
            >
              {step.id === 'brief' && <BriefIntake onComplete={() => completeStep('brief')} />}
              {step.id === 'golden-circle' && <GoldenCircle />}
              {step.id === 'opportunities-challenges' && <OpportunitiesChallenges />}
              {step.id === 'values' && <Values />}
              {step.id === 'roadmap' && <Roadmap />}
              {step.id === 'differentiators' && <Differentiators />}
              {step.id === 'statements' && <Statements />}
            </PositioningStep>
          ))}
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

// Wrapper component that provides the positioning context
const PositioningPage: React.FC = () => {
  return (
    <PositioningProvider>
      <PositioningPageContent />
    </PositioningProvider>
  );
};

export default PositioningPage;
