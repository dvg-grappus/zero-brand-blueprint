
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StepCardProps {
  id: number;
  title: string;
  description: string;
  duration: string;
  status: "todo" | "current" | "done";
  index: number;
  onView: (id: number) => void;
  onBegin: (id: number) => void;
}

const StepCard: React.FC<StepCardProps> = ({ 
  id, 
  title, 
  description, 
  duration, 
  status, 
  index,
  onView,
  onBegin
}) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [inView, setInView] = useState(false);
  const isFirstCard = id === 1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          if (!inView && entries[0].intersectionRatio >= 0.6) {
            onView(id);
          }
        }
      },
      { threshold: 0.6 }
    );

    const currentElement = document.getElementById(`step-card-${id}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [id, onView, inView]);

  const handleButtonClick = () => {
    onBegin(id);
    if (isFirstCard) {
      // Add blur to other cards
      document.querySelectorAll('.step-card:not(.step-card-1)').forEach(card => {
        (card as HTMLElement).style.opacity = '0.3';
        (card as HTMLElement).style.filter = 'blur(10px)';
      });
      
      // Navigate after delay
      setTimeout(() => {
        navigate(`/step/${id}`);
      }, 300);
    } else {
      setShowPreview(!showPreview);
    }
  };

  const getMarkerIcon = () => {
    if (status === "done") {
      return <Check className="w-4 h-4 text-black" />;
    }
    if (status === "current") {
      return <ArrowRight className="w-4 h-4 text-white" />;
    }
    return null;
  };

  const keyboardShortcut = `⌘ + ${id}`;

  return (
    <TooltipProvider>
      <motion.div
        id={`step-card-${id}`}
        className={cn(
          "step-card relative mb-6 transition-all duration-300", 
          `step-card-${id}`
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: index * 0.03, 
          duration: 0.6,
          ease: "easeOut" 
        }}
        whileHover={{ y: -6 }}
      >
        {/* Card Spine */}
        <div className="absolute left-[32px] top-0 bottom-0 w-0.5 bg-spineLine group-hover:bg-black transition-colors duration-300"></div>
        
        {/* Card Container */}
        <div className="ml-16 w-[560px] bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-start gap-4">
              {/* Marker Circle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute left-[24px] -translate-x-1/2 top-6 w-6 h-6 rounded-full flex items-center justify-center border border-spineLine transition-colors duration-300">
                    <div 
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        status === "current" && "bg-black",
                        status === "done" && "bg-cyan"
                      )}
                    >
                      {getMarkerIcon()}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{keyboardShortcut}</TooltipContent>
              </Tooltip>
              
              {/* Title and Description */}
              <div className="flex-1">
                <h3 className="inter-font font-semibold text-[20px] mb-1">{title}</h3>
                <p className="inter-font text-[15px] text-gray-700 line-clamp-2">{description}</p>
              </div>
            </div>
            
            {/* Duration Pill */}
            <div className="bg-lightGrey text-[13px] px-3 py-1 rounded-lg">
              {duration}
            </div>
          </div>
          
          {/* Preview Content */}
          {showPreview && (
            <motion.div 
              className="mt-4 h-[280px] bg-gray-100 rounded-md flex items-center justify-center"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 280, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-[150px] h-[240px] bg-gray-200 rounded-md flex items-center justify-center">
                    Preview slide {i}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Card Footer with Button */}
          <div className="mt-4 flex justify-end">
            <button 
              className="bg-white text-black hover:bg-cyan rounded-full py-2 px-8 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan/40"
              style={{ width: 104, height: 40 }}
              onClick={handleButtonClick}
            >
              {isFirstCard ? "Begin" : (showPreview ? "Close preview" : "Preview")}
            </button>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default StepCard;
