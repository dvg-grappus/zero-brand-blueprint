
import React, { useState, useEffect, useRef } from "react";
import { Step } from "@/types/timeline";
import { motion } from "framer-motion";

interface TimelineCarouselProps {
  steps: Step[];
  onBegin: (id: number) => void;
}

const TimelineCarousel3D: React.FC<TimelineCarouselProps> = ({ steps, onBegin }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle wheel event for navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Determine scroll direction and change active index
      if (e.deltaY > 0) {
        // Scroll down - go to next step
        setActiveIndex((prev) => (prev + 1) % steps.length);
      } else {
        // Scroll up - go to previous step
        setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
      }
    };
    
    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Clean up
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [steps.length]);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveIndex((prev) => (prev + 1) % steps.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        onBegin(steps[activeIndex].id);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [steps, activeIndex, onBegin]);
  
  // Handle touch events for mobile
  const touchStartRef = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touchDiff = touchStartRef.current - e.touches[0].clientY;
    
    if (Math.abs(touchDiff) > 30) {
      if (touchDiff > 0) {
        // Swipe up - go to next step
        setActiveIndex((prev) => (prev + 1) % steps.length);
      } else {
        // Swipe down - go to previous step
        setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
      }
      touchStartRef.current = e.touches[0].clientY;
    }
  };
  
  // Calculate positions for cards
  const getCardStyle = (index: number) => {
    // Calculate relative index position
    const relativeIndex = (index - activeIndex + steps.length) % steps.length;
    
    // Calculate position based on relative index
    switch (relativeIndex) {
      case 0: // Active card
        return {
          zIndex: 10,
          opacity: 1,
          rotateY: '0deg',
          translateZ: '0px',
          translateX: '0%'
        };
      case 1: // Next card
        return {
          zIndex: 9,
          opacity: 0.9,
          rotateY: '-20deg',
          translateZ: '-200px',
          translateX: '40%'
        };
      case 2: // Card after next
        return {
          zIndex: 8,
          opacity: 0.7,
          rotateY: '-30deg',
          translateZ: '-400px',
          translateX: '60%'
        };
      case steps.length - 1: // Previous card
        return {
          zIndex: 9,
          opacity: 0.9,
          rotateY: '20deg',
          translateZ: '-200px',
          translateX: '-40%'
        };
      case steps.length - 2: // Card before previous
        return {
          zIndex: 8,
          opacity: 0.7,
          rotateY: '30deg',
          translateZ: '-400px',
          translateX: '-60%'
        };
      default:
        // Hidden cards
        const isOnRightSide = relativeIndex < steps.length / 2;
        return {
          zIndex: 1,
          opacity: 0,
          rotateY: isOnRightSide ? '-40deg' : '40deg',
          translateZ: '-800px',
          translateX: isOnRightSide ? '100%' : '-100%'
        };
    }
  };
  
  return (
    <div 
      className="w-full h-[600px] relative overflow-hidden"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{ perspective: '1200px', touchAction: 'none' }}
    >
      <div className="absolute w-full h-full flex items-center justify-center">
        {steps.map((step, index) => {
          const style = getCardStyle(index);
          const isActive = activeIndex === index;
          
          return (
            <motion.div
              key={step.id}
              className="absolute"
              initial={false}
              animate={{
                zIndex: style.zIndex,
                opacity: style.opacity,
                rotateY: style.rotateY,
                translateZ: style.translateZ,
                translateX: style.translateX,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30
              }}
              style={{
                width: '320px',
                height: '480px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className={`w-full h-full rounded-lg shadow-lg p-8 flex flex-col justify-between transform-gpu ${isActive ? 'cursor-pointer' : ''}`}
                style={{
                  backgroundColor: getCardColor(index),
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
                onClick={() => isActive && onBegin(step.id)}
              >
                {/* Card Header */}
                <div className="text-left">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-black/70">{step.id}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-black">{step.title}</h3>
                  <p className="text-black/80 mb-4">{step.description}</p>
                </div>
                
                {/* Card Footer */}
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-black/70">{step.duration}</span>
                  
                  {isActive && (
                    <motion.button
                      className="px-4 py-1.5 bg-black/10 rounded-full text-sm font-medium hover:bg-black/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Begin
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-muted-foreground flex items-center space-x-2">
        <span>Use</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="m7 15 5 5 5-5"/>
          <path d="m7 9 5-5 5 5"/>
        </svg>
        <span>keys or mousewheel to navigate</span>
      </div>
    </div>
  );
};

// Function to generate pastel colors based on index
function getCardColor(index: number) {
  const colors = [
    "#e0f7fa", // Cyan
    "#f3e5f5", // Purple
    "#e8f5e9", // Green
    "#fff8e1", // Amber
    "#e1f5fe", // Light Blue
    "#fce4ec", // Pink
    "#f1f8e9", // Light Green
    "#fff3e0", // Orange
    "#e8eaf6", // Indigo
    "#ffebee", // Red
    "#e0f2f1", // Teal
    "#ede7f6", // Deep Purple
    "#f9fbe7", // Lime
    "#fffde7"  // Yellow
  ];
  
  return colors[index % colors.length];
}

export default TimelineCarousel3D;
