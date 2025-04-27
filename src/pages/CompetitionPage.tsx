
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CompetitionHeader } from "@/components/competition/CompetitionHeader";
import { CompetitionFooter } from "@/components/competition/CompetitionFooter";
import { CompetitorDiscovery } from "@/components/competition/CompetitorDiscovery";
import { KeyTakeaways } from "@/components/competition/KeyTakeaways";
import { TrendsPatterns } from "@/components/competition/TrendsPatterns";
import { LandscapeCanvas } from "@/components/competition/LandscapeCanvas";
import { InsightDigest } from "@/components/competition/InsightDigest";
import { AIAssistantPanel } from "@/components/competition/AIAssistantPanel";
import { SecondaryInsightPool } from "@/components/competition/SecondaryInsightPool";
import { CompetitionProvider } from "@/providers/CompetitionProvider";
import { AudienceProvider } from "@/providers/AudienceProvider";

const CompetitionPage: React.FC = () => {
  const { substep = "discovery" } = useParams<{ substep: string }>();
  const [showSecondaryInsights, setShowSecondaryInsights] = useState(false);
  const navigate = useNavigate();
  
  const subSteps = [
    { id: "discovery", label: "Discovery" },
    { id: "takeaways", label: "Takeaways" },
    { id: "trends", label: "Trends" },
    { id: "landscape", label: "Landscape" },
    { id: "review", label: "Review" },
  ];

  const currentStepIndex = subSteps.findIndex(step => step.id === substep);

  const renderCurrentStep = () => {
    switch (substep) {
      case "discovery":
        return <CompetitorDiscovery />;
      case "takeaways":
        return <KeyTakeaways />;
      case "trends":
        return <TrendsPatterns />;
      case "landscape":
        return <LandscapeCanvas />;
      case "review":
        return <InsightDigest />;
      default:
        return <CompetitorDiscovery />;
    }
  };

  const navigateToStep = (stepId: string) => {
    navigate(`/step/3/${stepId}`);
  };
  
  const toggleSecondaryInsights = () => {
    setShowSecondaryInsights(!showSecondaryInsights);
  };

  return (
    <AudienceProvider>
      <CompetitionProvider>
        <div className="min-h-screen bg-background text-foreground flex">
          <div className="flex-1 flex flex-col">
            <CompetitionHeader 
              currentStep={currentStepIndex} 
              steps={subSteps} 
              onToggleSecondaryInsights={toggleSecondaryInsights} 
            />
            
            <motion.div 
              className="flex-1 px-[120px] pt-8 pb-24 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
            
            <CompetitionFooter 
              currentStep={currentStepIndex} 
              steps={subSteps} 
              onNavigate={navigateToStep} 
            />
          </div>
          
          <div className="w-[320px] border-l border-border/40 min-h-screen">
            <AIAssistantPanel currentStep={substep} />
          </div>
          
          <SecondaryInsightPool 
            isOpen={showSecondaryInsights} 
            onClose={() => setShowSecondaryInsights(false)} 
          />
        </div>
      </CompetitionProvider>
    </AudienceProvider>
  );
};

export default CompetitionPage;
