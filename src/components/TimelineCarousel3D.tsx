
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
  
  // Implement snap scrolling - move one card at a time
  const handleScroll = (direction: 'next' | 'prev') => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    
    let newIndex: number;
    if (direction === 'next') {
      // Move to next card if not at the end
      newIndex = Math.min(activeIndex + 1, steps.length - 1);
    } else {
      // Move to previous card if not at the beginning
      newIndex = Math.max(activeIndex - 1, 0);
    }
    
    if (newIndex !== activeIndex) {
      console.log(`Snap scrolling to index: ${newIndex}`);
      setActiveIndex(newIndex);
    }
    
    // Reset scrolling lock after animation completes
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };
  
  // Wheel event handler with snap functionality
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 'next' : 'prev';
    handleScroll(direction);
  };
  
  // Set up wheel event handler
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
  }, [activeIndex, isScrolling]); // Added isScrolling as dependency to fix stale closure issues
  
  // Improved keyboard navigation with snap functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let handled = false;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleScroll('next');
        handled = true;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handleScroll('prev');
        handled = true;
      } else if (e.key === 'Enter' || e.key === ' ') {
        onBegin(steps[activeIndex].id);
        handled = true;
      }
      
      if (handled) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, steps, onBegin, isScrolling]);
  
  // Touch handling with snap functionality
  const touchStartRef = useRef(0);
  const touchMoveRef = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
    touchMoveRef.current = 0; // Reset touch move tracking
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isScrolling) return;
    touchMoveRef.current = touchStartRef.current - e.touches[0].clientY;
  };
  
  const handleTouchEnd = () => {
    if (isScrolling) return;
    
    // Determine direction from touch movement
    if (Math.abs(touchMoveRef.current) > 50) {
      const direction = touchMoveRef.current > 0 ? 'next' : 'prev';
      handleScroll(direction);
    }
  };

  // Refined card styles with improved diagonal, non-overlapping layout and more 3D effect
  const getCardStyle = (index: number) => {
    // Calculate relative position from active card
    const diff = index - activeIndex;
    
    // Base styles for all cards with improved fade out for distant cards
    const baseStyles = {
      zIndex: 50 - Math.abs(diff) * 10,
      opacity: diff === 0 ? 1 : Math.max(1 - Math.abs(diff) * 0.3, 0), // Faster fade out
      scale: diff === 0 ? 1 : Math.max(0.95 - Math.abs(diff) * 0.05, 0.8)
    };
    
    // Only show a limited number of cards in each direction to avoid clipping
    if (Math.abs(diff) > 3) {
      return { ...baseStyles, opacity: 0 };
    }
    
    // Increased spacing between cards and more pronounced 3D effect
    if (diff === 0) {
      // Active card
      return {
        ...baseStyles,
        rotateY: '-15deg', // More tilted
        rotateX: '8deg',  // More pronounced 3D
        translateZ: '0px',
        translateX: '0%',
        translateY: '0px',
      };
    } else if (diff > 0) {
      // Cards after active - increased spacing
      return {
        ...baseStyles,
        rotateY: '-15deg',
        rotateX: '8deg',
        translateZ: `-${diff * 150}px`, // Increased depth
        translateX: `${diff * 50}%`,   // Increased horizontal offset
        translateY: `-${diff * 80}px`, // Increased vertical offset
      };
    } else {
      // Cards before active - increased spacing
      return {
        ...baseStyles,
        rotateY: '-15deg',
        rotateX: '8deg',
        translateZ: `${Math.abs(diff) * 150}px`, // Increased depth
        translateX: `${diff * 50}%`,           // Increased horizontal offset
        translateY: `${Math.abs(diff) * 80}px`,  // Increased vertical offset
      };
    }
  };
  
  // Use consistent purple gradient for all cards (based on Audience card)
  const getCardGradient = () => {
    // Soft purple gradient similar to the Audience card in the image
    return "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)";
  };
  
  return (
    <div 
      className="w-full h-[700px] relative" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        perspective: '1500px',
        touchAction: 'none',
        overflow: 'visible', // Important: Remove overflow restriction for cards
      }}
    >
      <div className="absolute w-full h-full flex items-center justify-center">
        {steps.map((step, index) => {
          const style = getCardStyle(index);
          const isActive = activeIndex === index;
          // Only render cards that are visible (within a certain range of active index)
          const visible = Math.abs(index - activeIndex) <= 3; // Show max 3 cards in each direction
          
          if (!visible) return null; // Skip rendering cards that are far away
          
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
              whileHover={isActive ? { scale: 1.06, translateZ: "30px" } : {}} // More pronounced hover effect
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30
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
                  background: getCardGradient(),
                  boxShadow: isActive ? '0 10px 40px rgba(0, 0, 0, 0.2)' : '0 8px 32px rgba(0, 0, 0, 0.15)',
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
