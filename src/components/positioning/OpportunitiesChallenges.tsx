
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import StickyNote from "./StickyNote";
import StepNavBar from "./StepNavBar";
import { PositioningContext } from "@/pages/StepPage";

// Mock data for development - in production this would come from GPT API
const mockOpportunities = [
  "Growing market for AI tools in design",
  "Underserved small business segment",
  "Trend toward DIY branding solutions",
  "Remote work increasing need for digital assets",
  "Design democratization movement gaining traction",
  "Rise of solopreneurs needing visual identity"
];

const mockChallenges = [
  "Maintaining design quality with automation",
  "Changing perception of AI-generated design",
  "Competing with established design services",
  "Technical barriers to quality generation",
  "Educating users on brand fundamentals",
  "Balancing customization vs simplicity"
];

interface DraggableNoteProps {
  id: string;
  content: string;
  isSelected: boolean;
  isDiscarded: boolean;
  onSelect: () => void;
  onDiscard: () => void;
  onMove: () => void;
  section: 'opportunities' | 'challenges';
}

const DraggableNote: React.FC<DraggableNoteProps> = ({
  id,
  content,
  isSelected,
  isDiscarded,
  onSelect,
  onDiscard,
  onMove,
  section
}) => {
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <StickyNote
        id={id}
        content={content}
        isSelected={isSelected}
        isDiscarded={isDiscarded}
        onClick={onSelect}
        onDiscard={onDiscard}
      />
      <button 
        onClick={onMove}
        className="mt-2 w-full text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-gray-700 flex items-center justify-center"
      >
        Move to {section === 'opportunities' ? 'Challenges' : 'Opportunities'} ↔
      </button>
    </motion.div>
  );
};

const OpportunitiesChallenges: React.FC = () => {
  const { selectedOpportunities, setSelectedOpportunities, selectedChallenges, setSelectedChallenges } = useContext(PositioningContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  
  const [discardedOpportunities, setDiscardedOpportunities] = useState<string[]>([]);
  const [discardedChallenges, setDiscardedChallenges] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulate GPT API call
    const timer = setTimeout(() => {
      // Here you would make the actual API call
      setOpportunities(mockOpportunities);
      setChallenges(mockChallenges);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSelectOpportunity = (opportunity: string) => {
    setSelectedOpportunities(prev => 
      prev.includes(opportunity) 
        ? prev.filter(o => o !== opportunity)
        : [...prev, opportunity]
    );
  };
  
  const handleDiscardOpportunity = (opportunity: string) => {
    setDiscardedOpportunities(prev => 
      prev.includes(opportunity)
        ? prev.filter(o => o !== opportunity)
        : [...prev, opportunity]
    );
  };
  
  const handleSelectChallenge = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge)
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };
  
  const handleDiscardChallenge = (challenge: string) => {
    setDiscardedChallenges(prev => 
      prev.includes(challenge)
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };
  
  // Move item from opportunities to challenges
  const moveToChallenge = (opportunity: string) => {
    setOpportunities(prev => prev.filter(item => item !== opportunity));
    setChallenges(prev => [...prev, opportunity]);
    
    // Update selection states
    setSelectedOpportunities(prev => prev.filter(item => item !== opportunity));
    setDiscardedOpportunities(prev => prev.filter(item => item !== opportunity));
  };
  
  // Move item from challenges to opportunities
  const moveToOpportunity = (challenge: string) => {
    setChallenges(prev => prev.filter(item => item !== challenge));
    setOpportunities(prev => [...prev, challenge]);
    
    // Update selection states
    setSelectedChallenges(prev => prev.filter(item => item !== challenge));
    setDiscardedChallenges(prev => prev.filter(item => item !== challenge));
  };
  
  const validateSelection = () => {
    if (selectedOpportunities.length < 2 || selectedChallenges.length < 2) {
      toast.error("Select at least 2 items from each column");
      return false;
    }
    return true;
  };
  
  const handleNext = () => {
    if (validateSelection()) {
      window.location.href = "/step/1/roadmap";
    }
  };
  
  return (
    <>
      <div className="col-span-12">
        <motion.p
          className="text-gray-500 text-sm mb-1 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Spot tailwinds and tripwires.
        </motion.p>
        
        <motion.h1
          className="text-[32px] font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Opportunities & Challenges
        </motion.h1>
        
        <div className="flex gap-8">
          {/* Opportunities Column */}
          <div className="flex-1">
            <motion.h2
              className="text-[20px] font-bold mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Opportunities
            </motion.h2>
            
            <div className="p-4 bg-white rounded-lg shadow-sm min-h-[500px]" id="opportunities">
              {isLoading ? (
                <div className="flex flex-col items-center mt-8">
                  <div className="w-[180px] h-[220px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
                  <p className="text-gray-500">Still shaping ideas... one second.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {opportunities.map((opportunity, index) => (
                    <DraggableNote
                      key={`opportunities-${index}`}
                      id={`opportunities-${index}`}
                      content={opportunity}
                      isSelected={selectedOpportunities.includes(opportunity)}
                      isDiscarded={discardedOpportunities.includes(opportunity)}
                      onSelect={() => handleSelectOpportunity(opportunity)}
                      onDiscard={() => handleDiscardOpportunity(opportunity)}
                      onMove={() => moveToChallenge(opportunity)}
                      section="opportunities"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Challenges Column */}
          <div className="flex-1">
            <motion.h2
              className="text-[20px] font-bold mb-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Challenges
            </motion.h2>
            
            <div className="p-4 bg-white rounded-lg shadow-sm min-h-[500px]" id="challenges">
              {isLoading ? (
                <div className="flex flex-col items-center mt-8">
                  <div className="w-[180px] h-[220px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
                  <p className="text-gray-500">Still shaping ideas... one second.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {challenges.map((challenge, index) => (
                    <DraggableNote
                      key={`challenges-${index}`}
                      id={`challenges-${index}`}
                      content={challenge}
                      isSelected={selectedChallenges.includes(challenge)}
                      isDiscarded={discardedChallenges.includes(challenge)}
                      onSelect={() => handleSelectChallenge(challenge)}
                      onDiscard={() => handleDiscardChallenge(challenge)}
                      onMove={() => moveToOpportunity(challenge)}
                      section="challenges"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <StepNavBar 
        title="Opportunities & Challenges"
        nextStep="/step/1/roadmap"
        nextButtonLabel="Confirm context →"
        isButtonDisabled={isLoading || selectedOpportunities.length < 2 || selectedChallenges.length < 2}
        onNext={handleNext}
      />
    </>
  );
};

export default OpportunitiesChallenges;
