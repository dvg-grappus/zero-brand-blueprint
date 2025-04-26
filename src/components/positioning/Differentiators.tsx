import React, { useState, useEffect, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PositioningContext } from "@/contexts/PositioningContext";

// Mock data for development - in production this would come from GPT API
const mockDifferentiators = [
  "The only design automation platform that provides brand-specific customization for solopreneurs.",
  "The only AI branding tool that preserves human creative direction while automating technical execution.",
  "The only identity generator that builds complete systems from strategy through assets, not just logos.",
  "The only design platform that provides real-time collaboration between AI and human decision makers.",
  "The only brand toolkit that guides users through strategic positioning before visualizing solutions.",
  "The only design solution that adapts to user skill level from beginner to professional.",
  "The only brand system creator that emphasizes voice and messaging equal to visual elements.",
  "The only identity platform that allows unlimited revisions without cost penalties."
];

interface DifferentiatorCardProps {
  content: string;
  isPinned: boolean;
  onTogglePin: () => void;
  isPinLimited: boolean;
  index: number;
}

const DifferentiatorCard: React.FC<DifferentiatorCardProps> = ({ 
  content, 
  isPinned, 
  onTogglePin, 
  isPinLimited,
  index 
}) => {
  const controls = useAnimation();
  
  useEffect(() => {
    if (isPinned) {
      controls.start({
        y: -20,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      });
    } else {
      controls.start({
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      });
    }
  }, [isPinned, controls]);
  
  return (
    <motion.div
      className={`p-6 rounded-lg mb-4 relative ${
        isPinned ? "bg-cyan shadow-lg ring-1 ring-cyan/50" : "bg-[#E5FBFF]"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      layout
    >
      <div className="text-black text-lg">
        {content}
      </div>
      
      <button
        className={`absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full ${
          isPinned 
            ? "bg-black text-white" 
            : isPinLimited 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
        onClick={onTogglePin}
        disabled={!isPinned && isPinLimited}
      >
        {isPinned ? "📌" : "📍"}
      </button>
    </motion.div>
  );
};

const Differentiators: React.FC = () => {
  const { pinnedDifferentiators, setPinnedDifferentiators, completeStep } = useContext(PositioningContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [differentiators, setDifferentiators] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulate GPT API call
    const timer = setTimeout(() => {
      // Here you would make the actual API call
      setDifferentiators(mockDifferentiators);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTogglePin = (differentiator: string) => {
    setPinnedDifferentiators(prev => {
      // If already pinned, unpin it
      if (prev.includes(differentiator)) {
        return prev.filter(d => d !== differentiator);
      }
      
      // If trying to pin more than 3, show error
      if (prev.length >= 3) {
        toast.error("You can pin a maximum of 3 differentiators");
        return prev;
      }
      
      // Otherwise pin it
      return [...prev, differentiator];
    });
  };
  
  const isPinLimited = pinnedDifferentiators.length >= 3;
  
  const sortedDifferentiators = [...differentiators].sort((a, b) => {
    const aIsPinned = pinnedDifferentiators.includes(a);
    const bIsPinned = pinnedDifferentiators.includes(b);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });
  
  const handleComplete = () => {
    if (pinnedDifferentiators.length === 3 && completeStep) {
      completeStep("differentiators");
    }
  };
  
  return (
    <>
      <div className="col-span-12 max-w-[700px] mx-auto">
        <motion.p
          className="text-gray-500 text-sm mb-1 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Why you, not the rest.
        </motion.p>
        
        <motion.h1
          className="text-[32px] font-bold mb-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Key Differentiators
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Pin your top 3 differentiators that make you truly unique.
        </motion.p>
        
        {isLoading ? (
          <div className="flex flex-col items-center mt-8">
            <div className="w-full h-[100px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
            <div className="w-full h-[100px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
            <div className="w-full h-[100px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
            <p className="text-gray-500 mt-4">Still shaping ideas... one second.</p>
          </div>
        ) : (
          <motion.div layout>
            {sortedDifferentiators.map((differentiator, index) => (
              <DifferentiatorCard
                key={index}
                content={differentiator}
                isPinned={pinnedDifferentiators.includes(differentiator)}
                onTogglePin={() => handleTogglePin(differentiator)}
                isPinLimited={isPinLimited && !pinnedDifferentiators.includes(differentiator)}
                index={index}
              />
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={`inline-block px-4 py-2 rounded-full ${
            pinnedDifferentiators.length === 3 
              ? "bg-green-100 text-green-700" 
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {pinnedDifferentiators.length} of 3 pins used
          </div>
        </motion.div>
      </div>
      
      <div className="mt-6 text-right">
        <Button
          onClick={handleComplete}
          disabled={isLoading || pinnedDifferentiators.length !== 3}
          className="bg-black text-white hover:bg-cyan hover:text-black transition-colors"
        >
          Craft statements
        </Button>
      </div>
    </>
  );
};

export default Differentiators;
