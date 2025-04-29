import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import TimelineTopBar from "@/components/TimelineTopBar";
import HelpDrawer from "@/components/HelpDrawer";
import OfflineToast from "@/components/OfflineToast";
import TimelineCarousel3D from "@/components/TimelineCarousel3D";
import { Step } from "@/types/timeline";

const Timeline: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
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
    const fromAudience = location.state && location.state.fromAudience;
    const fromCompetition = location.state && location.state.fromCompetition;
    const fromMarket = location.state && location.state.fromMarket;
    const fromPersonality = location.state && location.state.fromPersonality;
    const fromMoodboards = location.state && location.state.fromMoodboards;
    const fromStylescapes = location.state && location.state.fromStylescapes;
    
    if (fromPositioning) {
      setCompletedSteps(prev => {
        if (!prev.includes(1)) {
          return [...prev, 1]; 
        }
        return prev;
      });
      setCurrentStep(2);
    }
    
    if (fromAudience) {
      setCompletedSteps(prev => {
        if (!prev.includes(2)) {
          return [...prev, 2];
        }
        return prev;
      });
      setCurrentStep(3);
    }
    
    if (fromCompetition) {
      setCompletedSteps(prev => {
        if (!prev.includes(3)) {
          return [...prev, 3];
        }
        return prev;
      });
      setCurrentStep(4);
    }
    
    if (fromMarket) {
      setCompletedSteps(prev => {
        if (!prev.includes(4)) {
          return [...prev, 4];
        }
        return prev;
      });
      setCurrentStep(5);
    }
    
    if (fromPersonality) {
      setCompletedSteps(prev => {
        if (!prev.includes(5)) {
          return [...prev, 5];
        }
        return prev;
      });
      setCurrentStep(6);
    }
    
    if (fromMoodboards) {
      setCompletedSteps(prev => {
        if (!prev.includes(6)) {
          return [...prev, 6];
        }
        return prev;
      });
      setCurrentStep(7);
    }
    
    if (fromStylescapes) {
      setCompletedSteps(prev => {
        if (!prev.includes(7)) {
          return [...prev, 7];
        }
        return prev;
      });
      setCurrentStep(8);
    }
    
    if (completedSteps.length === 0 && !fromPositioning && !fromAudience && !fromCompetition && !fromMarket && !fromPersonality && !fromMoodboards && !fromStylescapes) {
      setCurrentStep(1);
    }
  }, [location, completedSteps.length]);

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
  
  const handleStepBegin = (stepId: number) => {
    console.log(`onBeginStep fired for step ${stepId}`);
    
    // Add subtle animation before navigation
    document.body.style.opacity = '0.8';
    setTimeout(() => {
      document.body.style.opacity = '1';
      
      // Navigation logic for each step - now handling all steps
      switch(stepId) {
        case 1:
          navigate("/step/1");
          break;
        case 2:
          navigate("/step/2");
          break;
        case 3:
          navigate("/step/3");
          break;
        case 4:
          navigate("/step/4");
          break;
        case 5:
          navigate("/step/4/archetype");
          break;
        case 6:
          console.log('Timeline: Navigating to moodboards /step/5/attributes');
          navigate("/step/5/attributes");
          break;
        case 7:
          console.log('Timeline: Navigating to stylescapes /step/6/craft');
          navigate("/step/6/craft");
          break;
        case 8:
          navigate("/step/8");
          break;
        case 9:
          navigate("/step/9");
          break;
        case 10:
          navigate("/step/10");
          break;
        case 11:
          navigate("/step/11");
          break;
        case 12:
          navigate("/step/12");
          break;
        case 13:
          navigate("/step/13");
          break;
        case 14:
          navigate("/step/14");
          break;
        default:
          navigate(`/step/${stepId}`);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden">
      {/* Simple subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-background to-background/95 z-0"></div>
      
      <TimelineTopBar currentStep={currentStep} completedSteps={completedSteps} />
      <OfflineToast />
      
      <div className="pt-[100px] pb-[48px] px-4 max-w-[1200px] mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="inter-font font-bold text-[42px] text-foreground mb-3">Your route beyond zero.</h1>
          <p className="inter-font text-[20px] text-muted-foreground max-w-2xl mx-auto">
            Fourteen concise modules. Move in order or jump to what matters.
          </p>
        </motion.div>
        
        <TimelineCarousel3D 
          steps={steps}
          onBegin={handleStepBegin}
        />
      </div>
      
      <motion.button
        className="fixed right-6 bottom-6 w-12 h-12 bg-black/80 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-semibold z-50 border border-white/10 backdrop-blur-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-cyan/40"
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
