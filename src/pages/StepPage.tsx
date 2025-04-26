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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

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
  activeStep: string;
  setActiveStep: React.Dispatch<React.SetStateAction<string>>;
  completeStep: (step: string) => void;
  completedSteps: string[];
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
  activeStep: "brief",
  setActiveStep: () => {},
  completeStep: () => {},
  completedSteps: [],
});

const STEP_CONFIG = [
  { id: "brief", name: "Brief Intake", component: BriefIntake, isValid: (ctx: any) => ctx.briefContext.split(/\s+/).filter(Boolean).length >= 20 },
  { id: "golden-circle", name: "Golden Circle", component: GoldenCircle, isValid: (ctx: any) => ctx.selectedGoldenCircle.why.length > 0 && ctx.selectedGoldenCircle.how.length > 0 && ctx.selectedGoldenCircle.what.length > 0 },
  { id: "opportunities-challenges", name: "Opportunities & Challenges", component: OpportunitiesChallenges, isValid: (ctx: any) => ctx.selectedOpportunities.length >= 2 && ctx.selectedChallenges.length >= 2 },
  { id: "roadmap", name: "Roadmap", component: Roadmap, isValid: () => true },
  { id: "values", name: "Values", component: Values, isValid: (ctx: any) => ctx.selectedValues.length >= 3 && ctx.selectedValues.length <= 7 },
  { id: "differentiators", name: "Differentiators", component: Differentiators, isValid: (ctx: any) => ctx.pinnedDifferentiators.length === 3 },
  { id: "statements", name: "Statements", component: Statements, isValid: () => true },
];

const StepPage: React.FC = () => {
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
  
  const [activeStep, setActiveStep] = useState<string>("brief");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [openSteps, setOpenSteps] = useState<string[]>(["brief"]);
  
  const navigate = useNavigate();
  
  const completeStep = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
      
      const currentIndex = STEP_CONFIG.findIndex(s => s.id === step);
      if (currentIndex < STEP_CONFIG.length - 1) {
        const nextStep = STEP_CONFIG[currentIndex + 1].id;
        setActiveStep(nextStep);
        setOpenSteps([...openSteps, nextStep]);
      } else {
        setPositioningComplete(true);
        toast.success("Positioning module completed!");
        navigate("/timeline");
      }
    }
  };
  
  const isStepValid = (stepId: string) => {
    const config = STEP_CONFIG.find(step => step.id === stepId);
    if (!config) return false;
    
    const contextData = {
      briefContext,
      selectedGoldenCircle,
      selectedOpportunities,
      selectedChallenges,
      roadmapMilestones,
      selectedValues,
      pinnedDifferentiators,
      internalStatement,
      selectedExternalStatement
    };
    
    return config.isValid(contextData);
  };
  
  const toggleStep = (stepId: string) => {
    if (openSteps.includes(stepId)) {
      setOpenSteps(openSteps.filter(id => id !== stepId));
    } else {
      setOpenSteps([...openSteps, stepId]);
    }
  };
  
  const canOpenStep = (stepId: string) => {
    const stepIndex = STEP_CONFIG.findIndex(s => s.id === stepId);
    if (stepIndex === 0) return true;
    
    const prevStepId = STEP_CONFIG[stepIndex - 1].id;
    return completedSteps.includes(prevStepId) || activeStep === stepId;
  };
  
  const handleModuleComplete = () => {
    setPositioningComplete(true);
    toast.success("Positioning module completed!");
    navigate("/timeline");
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
      activeStep,
      setActiveStep,
      completeStep,
      completedSteps,
    }}>
      <div className="min-h-screen w-full bg-[#FAFAFA] pb-12">
        <OfflineToast />
        
        <StepProgress currentStep="all" />
        
        <div className="text-center pt-[48px] mb-8">
          <motion.h1
            className="text-[32px] font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Positioning Module
          </motion.h1>
          <motion.p
            className="text-gray-600"
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
            const isStepCompleted = completedSteps.includes(stepConfig.id);
            const isStepActive = activeStep === stepConfig.id;
            const isOpen = openSteps.includes(stepConfig.id);
            const canOpen = canOpenStep(stepConfig.id);
            
            return (
              <div key={stepConfig.id} className="col-span-12 mb-6">
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => canOpen && toggleStep(stepConfig.id)}
                  className="w-full"
                >
                  <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${isStepCompleted ? "bg-cyan text-black" : 
                        isStepActive ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
                    >
                      {isStepCompleted ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{stepConfig.name}</h3>
                    </div>
                    <CollapsibleTrigger disabled={!canOpen} className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {isStepCompleted ? "Completed" : 
                          isOpen ? "Close" : 
                          canOpen ? "Expand" : "Locked"}
                      </span>
                      {isOpen ? 
                        <ChevronUp className={`w-5 h-5 ${canOpen ? "text-gray-500" : "text-gray-300"}`} /> : 
                        <ChevronDown className={`w-5 h-5 ${canOpen ? "text-gray-500" : "text-gray-300"}`} />
                      }
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="pt-6 pb-4 px-4">
                      <Component 
                        onComplete={() => completeStep(stepConfig.id)}
                        isValid={isStepValid(stepConfig.id)}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
          
          <div className="col-span-12 mt-8 flex justify-center">
            <button
              onClick={handleModuleComplete}
              disabled={!completedSteps.includes("statements")}
              className={`px-8 py-3 rounded-full font-medium ${
                completedSteps.includes("statements")
                  ? "bg-black text-white hover:bg-cyan hover:text-black"
                  : "bg-gray-200 text-gray-500"
              } transition-colors`}
            >
              Complete Positioning Module
            </button>
          </div>
        </div>
      </div>
    </PositioningContext.Provider>
  );
};

export default StepPage;
