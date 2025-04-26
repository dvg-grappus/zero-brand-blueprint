
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OfflineToast from "@/components/OfflineToast";
import StepProgress from "@/components/StepProgress";
import BriefIntake from "@/components/positioning/BriefIntake";
import GoldenCircle from "@/components/positioning/GoldenCircle";
import OpportunitiesChallenges from "@/components/positioning/OpportunitiesChallenges";
import Roadmap from "@/components/positioning/Roadmap";
import Values from "@/components/positioning/Values";
import Differentiators from "@/components/positioning/Differentiators";
import Statements from "@/components/positioning/Statements";
import { toast } from "sonner";

// Create context for sharing state between steps
export const PositioningContext = React.createContext<{
  briefContext: string;
  setBriefContext: React.Dispatch<React.SetStateAction<string>>;
  selectedGoldenCircle: {
    why: string[];
    how: string[];
    what: string[];
  };
  setSelectedGoldenCircle: React.Dispatch<React.SetStateAction<{
    why: string[];
    how: string[];
    what: string[];
  }>>;
  selectedOpportunities: string[];
  setSelectedOpportunities: React.Dispatch<React.SetStateAction<string[]>>;
  selectedChallenges: string[];
  setSelectedChallenges: React.Dispatch<React.SetStateAction<string[]>>;
  roadmapMilestones: Record<string, string[]>;
  setRoadmapMilestones: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  pinnedDifferentiators: string[];
  setPinnedDifferentiators: React.Dispatch<React.SetStateAction<string[]>>;
  internalStatement: Record<string, string>;
  setInternalStatement: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedExternalStatement: string;
  setSelectedExternalStatement: React.Dispatch<React.SetStateAction<string>>;
  positioningComplete: boolean;
  setPositioningComplete: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  briefContext: "",
  setBriefContext: () => {},
  selectedGoldenCircle: { why: [], how: [], what: [] },
  setSelectedGoldenCircle: () => {},
  selectedOpportunities: [],
  setSelectedOpportunities: () => {},
  selectedChallenges: [],
  setSelectedChallenges: () => {},
  roadmapMilestones: {},
  setRoadmapMilestones: () => {},
  selectedValues: [],
  setSelectedValues: () => {},
  pinnedDifferentiators: [],
  setPinnedDifferentiators: () => {},
  internalStatement: {},
  setInternalStatement: () => {},
  selectedExternalStatement: "",
  setSelectedExternalStatement: () => {},
  positioningComplete: false,
  setPositioningComplete: () => {},
});

const StepPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  
  // Context state for the entire positioning workflow
  const [briefContext, setBriefContext] = useState<string>("");
  const [selectedGoldenCircle, setSelectedGoldenCircle] = useState<{
    why: string[];
    how: string[];
    what: string[];
  }>({
    why: [],
    how: [],
    what: [],
  });
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [roadmapMilestones, setRoadmapMilestones] = useState<Record<string, string[]>>({
    "Now": [],
    "1 yr": [],
    "3 yr": [],
    "5 yr": [],
    "10 yr": [],
  });
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [pinnedDifferentiators, setPinnedDifferentiators] = useState<string[]>([]);
  const [internalStatement, setInternalStatement] = useState<Record<string, string>>({});
  const [selectedExternalStatement, setSelectedExternalStatement] = useState<string>("");
  const [positioningComplete, setPositioningComplete] = useState<boolean>(false);

  // Determine current sub-step based on URL
  const [currentSubStep, setCurrentSubStep] = useState<string>("brief");

  useEffect(() => {
    // Handle navigation with unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!positioningComplete) {
        e.preventDefault();
        e.returnValue = "You'll lose current selections — continue?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [positioningComplete]);

  useEffect(() => {
    if (stepId === "1") {
      navigate("/step/1/brief");
    } else {
      const subStep = window.location.pathname.split("/").pop() || "brief";
      setCurrentSubStep(subStep);
    }
  }, [stepId, navigate]);

  const handleModuleComplete = () => {
    setPositioningComplete(true);
    toast.success("Positioning module completed!");
    navigate("/timeline");
  };

  const renderSubStep = () => {
    switch (currentSubStep) {
      case "brief":
        return <BriefIntake />;
      case "golden-circle":
        return <GoldenCircle />;
      case "opportunities-challenges":
        return <OpportunitiesChallenges />;
      case "roadmap":
        return <Roadmap />;
      case "values":
        return <Values />;
      case "differentiators":
        return <Differentiators />;
      case "statements":
        return <Statements onComplete={handleModuleComplete} />;
      default:
        return <BriefIntake />;
    }
  };

  return (
    <PositioningContext.Provider value={{
      briefContext,
      setBriefContext,
      selectedGoldenCircle,
      setSelectedGoldenCircle,
      selectedOpportunities,
      setSelectedOpportunities,
      selectedChallenges,
      setSelectedChallenges,
      roadmapMilestones,
      setRoadmapMilestones,
      selectedValues,
      setSelectedValues,
      pinnedDifferentiators,
      setPinnedDifferentiators,
      internalStatement,
      setInternalStatement,
      selectedExternalStatement,
      setSelectedExternalStatement,
      positioningComplete,
      setPositioningComplete,
    }}>
      <div className="min-h-screen w-full bg-[#FAFAFA]">
        <OfflineToast />
        
        {/* Step Progress Indicator */}
        <StepProgress currentStep={currentSubStep} />
        
        {/* Main content area */}
        <motion.div
          className="grid-12-columns pt-[48px] pb-[80px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {renderSubStep()}
        </motion.div>
      </div>
    </PositioningContext.Provider>
  );
};

export default StepPage;
