
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
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Improved scroll handling with better throttling
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    if (isScrolling) return;
    setIsScrolling(true);
    
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800); // Increased delay for smoother scrolling
    
    // Non-circular navigation - stops at ends
    if (e.deltaY > 0) {
      // Scroll down - next step
      setActiveIndex((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      // Scroll up - previous step
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };
  
  // Handle wheel event for navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [steps.length, isScrolling]);
  
  // Handle keyboard events - non-circular
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setIsScrolling(true);
        setActiveIndex((prev) => Math.min(prev + 1, steps.length - 1));
        
        if (scrollTimer.current) {
          clearTimeout(scrollTimer.current);
        }
        
        scrollTimer.current = setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setIsScrolling(true);
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        
        if (scrollTimer.current) {
          clearTimeout(scrollTimer.current);
        }
        
        scrollTimer.current = setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      } else if (e.key === 'Enter' || e.key === ' ') {
        onBegin(steps[activeIndex].id);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [steps, activeIndex, onBegin, isScrolling]);
  
  // Handle touch events for mobile with non-circular navigation
  const touchStartRef = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isScrolling) return;
    
    e.preventDefault();
    const touchDiff = touchStartRef.current - e.touches[0].clientY;
    
    if (Math.abs(touchDiff) > 50) {
      setIsScrolling(true);
      
      if (touchDiff > 0) {
        // Swipe up - go to next step (with limit)
        setActiveIndex((prev) => Math.min(prev + 1, steps.length - 1));
      } else {
        // Swipe down - go to previous step (with limit)
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
      
      touchStartRef.current = e.touches[0].clientY;
      
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  };

  // Calculate positions for cards with a diagonal, non-overlapping layout
  const getCardStyle = (index: number) => {
    // Calculate relative position from active card
    const diff = index - activeIndex;
    
    // Base styles for all cards
    const baseStyles = {
      zIndex: 50 - Math.abs(diff) * 10,
      opacity: diff === 0 ? 1 : Math.max(0.9 - Math.abs(diff) * 0.15, 0),
      scale: diff === 0 ? 1 : Math.max(0.95 - Math.abs(diff) * 0.05, 0.8)
    };
    
    // Positioning based on difference from active card
    // Improved diagonal layout with better 3D perspective
    if (diff === 0) {
      // Active card
      return {
        ...baseStyles,
        rotateY: '-10deg',
        rotateX: '5deg',
        translateZ: '0px',
        translateX: '0%',
        translateY: '0px',
      };
    } else if (diff > 0) {
      // Cards after active
      return {
        ...baseStyles,
        rotateY: '-10deg',
        rotateX: '5deg',
        translateZ: `-${diff * 100}px`,
        translateX: `${diff * 40}%`,
        translateY: `-${diff * 50}px`,
      };
    } else {
      // Cards before active
      return {
        ...baseStyles,
        rotateY: '-10deg',
        rotateX: '5deg',
        translateZ: `${diff * 100}px`,
        translateX: `${diff * 40}%`, 
        translateY: `${Math.abs(diff) * 50}px`,
      };
    }
  };
  
  // Simpler, more consistent gradient for all cards (using audience card style)
  const getCardGradient = (index: number) => {
    // Use a consistent soft purple gradient similar to the Audience card
    return "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)";
  };
  
  return (
    <div 
      className="w-full h-[600px] relative overflow-hidden"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{ 
        perspective: '1200px', 
        touchAction: 'none',
      }}
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
                rotateX: style.rotateX,
                translateZ: style.translateZ,
                translateX: style.translateX,
                translateY: style.translateY,
                scale: style.scale,
              }}
              whileHover={isActive ? { scale: 1.05, translateZ: "20px" } : {}}
              transition={{ 
                type: 'spring', 
                stiffness: 260, 
                damping: 25
              }}
              style={{
                width: '340px',
                height: '480px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className="w-full h-full rounded-lg p-8 flex flex-col justify-between transform-gpu backdrop-blur-sm"
                style={{
                  background: getCardGradient(step.id),
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                onClick={() => isActive && onBegin(step.id)}
              >
                {/* Card Header */}
                <div className="text-left">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-black/70">{step.id}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-black/90">{step.title}</h3>
                  <p className="text-black/80 mb-4">{step.description}</p>
                </div>
                
                {/* Card Footer */}
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-black/70">{step.duration}</span>
                  
                  {isActive && (
                    <motion.button
                      className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium shadow-md"
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

export default TimelineCarousel3D;
