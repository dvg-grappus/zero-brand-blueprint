
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TimelineTopBar from "@/components/TimelineTopBar";
import StepCard from "@/components/StepCard";
import HelpDrawer from "@/components/HelpDrawer";
import OfflineToast from "@/components/OfflineToast";

interface Step {
  id: number;
  title: string;
  description: string;
  duration: string;
}

const Timeline: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showHelpDrawer, setShowHelpDrawer] = useState(false);
  
  // Define all steps
  const steps: Step[] = [
    { id: 1, title: "Positioning", description: "Define purpose, edge and long-range roadmap.", duration: "4 min" },
    { id: 2, title: "Audience", description: "Segment target cohorts and mine core insights.", duration: "5 min" },
    { id: 3, title: "Competition", description: "Benchmark rivals to reveal gaps and openings.", duration: "4 min" },
    { id: 4, title: "Market", description: "Surface key stats, trends and cultural currents.", duration: "3 min" },
    { id: 5, title: "Personality", description: "Lock tone, archetype and non-negotiables.", duration: "3 min" },
    { id: 6, title: "Moodboards", description: "Curate visual clusters that capture the vibe.", duration: "6 min" },
    { id: 7, title: "Stylescapes", description: "Assemble a wide board to test cohesion.", duration: "2 min" },
    { id: 8, title: "Logo", description: "Shape marks, wordmarks and usage basics.", duration: "7 min" },
    { id: 9, title: "Voice", description: "Document message pillars and sample copy.", duration: "3 min" },
    { id: 10, title: "Color", description: "Select palette and set contrast rules.", duration: "2 min" },
    { id: 11, title: "Typography", description: "Choose type systems and pairings.", duration: "2 min" },
    { id: 12, title: "Elements", description: "Specify textures, grids, illustration and icon style.", duration: "3 min" },
    { id: 13, title: "Collaterals", description: "Apply the system to merch, print and digital.", duration: "5 min" },
    { id: 14, title: "Brand Book", description: "Bind everything into a polished PDF kit.", duration: "1 min" },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle help drawer with "?"
      if (e.key === "?") {
        setShowHelpDrawer(prev => !prev);
        return;
      }
      
      // Handle Command + Number shortcuts
      if (e.metaKey && !isNaN(Number(e.key)) && Number(e.key) >= 1 && Number(e.key) <= 14) {
        const stepNumber = Number(e.key);
        document.getElementById(`step-card-${stepNumber}`)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  const handleStepView = (stepId: number) => {
    console.log(`onStepView fired for step ${stepId}`);
    // This would typically fire an analytics event
  };
  
  const handleStepBegin = (stepId: number) => {
    console.log(`onBeginStep fired for step ${stepId}`);
    // This would typically fire an analytics event
  };
  
  const getStepStatus = (stepId: number): "todo" | "current" | "done" => {
    if (completedSteps.includes(stepId)) return "done";
    if (stepId === currentStep) return "current";
    return "todo";
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA]">
      <TimelineTopBar currentStep={currentStep} completedSteps={completedSteps} />
      <OfflineToast />
      
      <div className="pt-[136px] pb-[48px] px-[120px]">
        <motion.div
          className="max-w-[640px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="inter-font font-bold text-[32px] text-black mb-2">Your route beyond zero.</h1>
          <p className="inter-font text-[18px] text-gray-600 mb-8">
            Fourteen concise modules. Move in order or jump to what matters.
          </p>
        </motion.div>
        
        {/* Timeline */}
        <div className="flex justify-center">
          <div className="relative">
            {steps.map((step, index) => (
              <StepCard
                key={step.id}
                id={step.id}
                title={step.title}
                description={step.description}
                duration={step.duration}
                status={getStepStatus(step.id)}
                index={index}
                onView={handleStepView}
                onBegin={handleStepBegin}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Help toggle button */}
      <motion.button
        className="fixed right-6 bottom-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-xl font-semibold z-50 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-cyan/40"
        onClick={() => setShowHelpDrawer(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ?
      </motion.button>
      
      {/* Help drawer */}
      <AnimatePresence>
        {showHelpDrawer && (
          <HelpDrawer isOpen={showHelpDrawer} onClose={() => setShowHelpDrawer(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
