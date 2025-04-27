import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showHelpDrawer, setShowHelpDrawer] = useState(false);
  
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

  useEffect(() => {
    console.log("Location state:", location.state);
    const fromPositioning = location.state && location.state.fromPositioning;
    if (fromPositioning) {
      setCompletedSteps(prev => {
        if (!prev.includes(1)) {
          return [...prev, 1];
        }
        return prev;
      });
      setCurrentStep(2);
    }
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?") {
        setShowHelpDrawer(prev => !prev);
        return;
      }
      
      if (e.metaKey && !isNaN(Number(e.key)) && Number(e.key) >= 1 && Number(e.key) <= 14) {
        const stepNumber = Number(e.key);
        document.getElementById(`step-card-${stepNumber}`)?.scrollIntoView({ 
          behavior: "smooth",
          block: "center"
        });
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  const handleStepView = (stepId: number) => {
    console.log(`onStepView fired for step ${stepId}`);
  };
  
  const handleStepBegin = (stepId: number) => {
    console.log(`onBeginStep fired for step ${stepId}`);
  };
  
  const getStepStatus = (stepId: number): "todo" | "current" | "done" => {
    if (completedSteps.includes(stepId)) return "done";
    if (stepId === currentStep) return "current";
    return "todo";
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <TimelineTopBar currentStep={currentStep} completedSteps={completedSteps} />
      <OfflineToast />
      
      <div className="pt-[136px] pb-[48px] px-[120px]">
        <motion.div
          className="max-w-[640px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="inter-font font-bold text-[32px] text-foreground mb-2">Your route beyond zero.</h1>
          <p className="inter-font text-[18px] text-muted-foreground mb-10">
            Fourteen concise modules. Move in order or jump to what matters.
          </p>
        </motion.div>
        
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
      
      <motion.button
        className="fixed right-6 bottom-6 w-12 h-12 bg-secondary/80 text-secondary-foreground rounded-full shadow-md flex items-center justify-center text-xl font-semibold z-50 border border-border/40 backdrop-blur-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={() => setShowHelpDrawer(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ?
      </motion.button>
      
      <AnimatePresence>
        {showHelpDrawer && (
          <HelpDrawer isOpen={showHelpDrawer} onClose={() => setShowHelpDrawer(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
