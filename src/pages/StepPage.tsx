
import React from "react";
import { motion } from "framer-motion";
import OfflineToast from "@/components/OfflineToast";
import StepProgress from "@/components/StepProgress";
import { STEP_CONFIG } from "@/config/stepConfig";
import { PositioningProvider } from "@/providers/PositioningProvider";
import { usePositioning } from "@/contexts/PositioningContext";
import PositioningStep from "@/components/positioning/PositioningStep";

const PositioningContent = () => {
  const { 
    activeStep, 
    completedSteps, 
    openSteps, 
    setOpenSteps,
    positioningComplete,
    setPositioningComplete 
  } = usePositioning();
  
  const toggleStep = (stepId: string) => {
    if (openSteps.includes(stepId)) {
      setOpenSteps(openSteps.filter(id => id !== stepId));
    } else {
      setOpenSteps([...openSteps, stepId]);
    }
  };
  
  // Modified to always return true - allow opening any step
  const canOpenStep = (stepId: string) => {
    return true;
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground pb-12">
      <OfflineToast />
      
      <StepProgress currentStep="all" />
      
      <div className="text-center pt-[48px] mb-8">
        <motion.h1
          className="text-[32px] font-bold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Positioning Module
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Complete all sections below to define your brand positioning.
        </motion.p>
      </div>
      
      <div className="grid-12-columns max-w-[950px] mx-auto">
        {STEP_CONFIG.map((stepConfig, index) => {
          const Component = stepConfig.component;
          const isCompleted = completedSteps.includes(stepConfig.id);
          const isActive = activeStep === stepConfig.id;
          const isOpen = openSteps.includes(stepConfig.id);
          const canOpen = canOpenStep(stepConfig.id);
          
          return (
            <PositioningStep
              key={stepConfig.id}
              id={stepConfig.id}
              title={stepConfig.name}
              index={index}
              isCompleted={isCompleted}
              isActive={isActive}
              isOpen={isOpen}
              canOpen={canOpen}
              onToggle={() => toggleStep(stepConfig.id)}
            >
              <Component />
            </PositioningStep>
          );
        })}
      </div>
    </div>
  );
};

const StepPage = () => (
  <PositioningProvider>
    <PositioningContent />
  </PositioningProvider>
);

export default StepPage;
