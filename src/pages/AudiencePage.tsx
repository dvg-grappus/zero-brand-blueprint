
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import TimelineTopBar from "@/components/TimelineTopBar";
import StepProgress from "@/components/StepProgress";
import OfflineToast from "@/components/OfflineToast";
import AIAssistantPanel from "@/components/audience/AIAssistantPanel";
import InsightPoolDrawer from "@/components/audience/InsightPoolDrawer";
import { AudienceProvider } from "@/providers/AudienceProvider";
import { Lightbulb } from "lucide-react";

// Import all sub-step components
import CohortCanvas from "@/components/audience/CohortCanvas";
import CohortBoard from "@/components/audience/CohortBoard";
import PersonaGallery from "@/components/audience/PersonaGallery";
import PersonaDetail from "@/components/audience/PersonaDetail";
import SimulationHub from "@/components/audience/SimulationHub";
import InsightReview from "@/components/audience/InsightReview";

const AudienceContent = () => {
  const { substep, personaId } = useParams();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("cohort-canvas");

  // Update current step when route changes
  useEffect(() => {
    if (substep) {
      setCurrentStep(substep);
    }
  }, [substep]);

  // Mark a step as completed
  const completeStep = (stepName: string) => {
    if (!completedSteps.includes(stepName)) {
      setCompletedSteps(prev => [...prev, stepName]);
    }
  };

  // Navigate to the next step
  const goToNextStep = () => {
    const steps = [
      "cohort-canvas",
      "cohort-board",
      "persona-gallery",
      "simulations",
      "insight-review"
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      navigate(`/step/2/${nextStep}`);
    } else {
      // Complete the audience module and go back to timeline
      // This would trigger onModuleComplete('audience')
      navigate("/timeline", { state: { fromAudience: true } });
    }
  };

  // Toggle the insight drawer
  const toggleInsightDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Determine which component to render based on the substep
  const renderSubStep = () => {
    if (personaId) {
      // Always render PersonaDetail if personaId is present in URL
      return <PersonaDetail personaId={personaId} onBack={() => navigate("/step/2/persona-gallery")} />;
    }
    
    switch (substep) {
      case "cohort-canvas":
        return <CohortCanvas onComplete={() => { completeStep("cohort-canvas"); goToNextStep(); }} />;
      case "cohort-board":
        return <CohortBoard onComplete={() => { completeStep("cohort-board"); goToNextStep(); }} />;
      case "persona-gallery":
        return <PersonaGallery onComplete={() => { completeStep("persona-gallery"); goToNextStep(); }} />;
      case "simulations":
        return <SimulationHub onComplete={() => { completeStep("simulations"); goToNextStep(); }} />;
      case "insight-review":
        return <InsightReview onComplete={() => { completeStep("insight-review"); goToNextStep(); }} />;
      default:
        return <CohortCanvas onComplete={() => { completeStep("cohort-canvas"); goToNextStep(); }} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground pb-12">
      <TimelineTopBar currentStep={2} completedSteps={[1]} />
      <OfflineToast />
      
      <StepProgress currentStep="audience" />
      
      <motion.button
        className="fixed top-28 right-6 z-50 w-12 h-12 bg-secondary/80 text-secondary-foreground rounded-full shadow-md flex items-center justify-center text-xl font-semibold border border-border/40 backdrop-blur-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={toggleInsightDrawer}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Lightbulb size={20} />
      </motion.button>
      
      <div className="flex px-8 pt-[96px]">
        {/* Left side - Audience step content */}
        <div className="w-[70%] pr-6">
          <div className="max-w-[800px] mx-auto">
            {renderSubStep()}
          </div>
        </div>
        
        {/* Right side - AI Assistant */}
        <div className="w-[30%] sticky top-24 h-[calc(100vh-180px)]">
          <AIAssistantPanel currentStep={currentStep} />
        </div>
      </div>
      
      {/* Insight Pool Drawer */}
      <InsightPoolDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

const AudiencePage = () => (
  <AudienceProvider>
    <AudienceContent />
  </AudienceProvider>
);

export default AudiencePage;
