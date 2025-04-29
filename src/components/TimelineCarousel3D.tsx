
import React, { useState, useEffect, useRef } from "react";
import { Step } from "@/types/timeline";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface TimelineCarouselProps {
  steps: Step[];
  onBegin: (id: number) => void;
}

const TimelineCarousel3D: React.FC<TimelineCarouselProps> = ({ steps, onBegin }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Throttle scroll events to prevent rapid firing
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    if (isScrolling) return;
    
    setIsScrolling(true);
    
    // Clear any existing timeout
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    // Set a timeout to allow scrolling again after a delay
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 600); // 600ms delay before allowing another scroll
    
    // Determine scroll direction and change active index
    if (e.deltaY > 0) {
      // Scroll down - go to next step
      setActiveIndex((prev) => (prev + 1) % steps.length);
    } else {
      // Scroll up - go to previous step
      setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
    }
  };
  
  // Handle wheel event for navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Clean up
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [steps.length, isScrolling]);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setIsScrolling(true);
        setActiveIndex((prev) => (prev + 1) % steps.length);
        
        if (scrollTimer.current) {
          clearTimeout(scrollTimer.current);
        }
        
        scrollTimer.current = setTimeout(() => {
          setIsScrolling(false);
        }, 600);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setIsScrolling(true);
        setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
        
        if (scrollTimer.current) {
          clearTimeout(scrollTimer.current);
        }
        
        scrollTimer.current = setTimeout(() => {
          setIsScrolling(false);
        }, 600);
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
  
  // Handle touch events for mobile
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
        // Swipe up - go to next step
        setActiveIndex((prev) => (prev + 1) % steps.length);
      } else {
        // Swipe down - go to previous step
        setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
      }
      
      touchStartRef.current = e.touches[0].clientY;
      
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 600);
    }
  };

  // Calculate positions for cards with a diagonal and more spaced layout
  const getCardStyle = (index: number) => {
    // Calculate relative index position
    const relativeIndex = (index - activeIndex + steps.length) % steps.length;
    
    // Calculate position based on relative index for a diagonal layout
    switch (relativeIndex) {
      case 0: // Active card
        return {
          zIndex: 50,
          opacity: 1,
          rotateY: '-5deg',
          rotateX: '5deg',
          translateZ: '0px',
          translateX: '0%',
          translateY: '0px',
          scale: 1
        };
      case 1: // Next card
        return {
          zIndex: 40,
          opacity: 0.9,
          rotateY: '-5deg',
          rotateX: '5deg',
          translateZ: '-120px',
          translateX: '35%',
          translateY: '-40px',
          scale: 0.95
        };
      case 2: // Card after next
        return {
          zIndex: 30,
          opacity: 0.7,
          rotateY: '-5deg',
          rotateX: '5deg',
          translateZ: '-240px',
          translateX: '70%',
          translateY: '-80px',
          scale: 0.9
        };
      case 3: // Third card ahead
        return {
          zIndex: 20,
          opacity: 0.5,
          rotateY: '-5deg',
          rotateX: '5deg',
          translateZ: '-360px',
          translateX: '105%',
          translateY: '-120px',
          scale: 0.85
        };
      case steps.length - 1: // Previous card
        return {
          zIndex: 40,
          opacity: 0.9,
          rotateY: '-5deg',
          rotateX: '5deg',
          translateZ: '-120px',
          translateX: '-35%',
          translateY: '40px',
          scale: 0.95
        };
      case steps.length - 2: // Card before previous
        return {
          zIndex: 30,
          opacity: 0.7,
          rotateY: '-5deg',
          rotateX: '5deg',
          translateZ: '-240px',
          translateX: '-70%',
          translateY: '80px',
          scale: 0.9
        };
      case steps.length - 3: // Third card behind
        return {
          zIndex: 20,
          opacity: 0.5,
          rotateY: '-5deg',
          rotateX: '5deg',
          translateZ: '-360px',
          translateX: '-105%',
          translateY: '120px',
          scale: 0.85
        };
      default:
        // Hidden cards
        const isOnRightSide = relativeIndex < steps.length / 2;
        return {
          zIndex: 1,
          opacity: 0,
          rotateY: '-5deg',
          rotateX: '5deg',
          translateZ: '-600px',
          translateX: isOnRightSide ? '140%' : '-140%',
          translateY: isOnRightSide ? '-160px' : '160px',
          scale: 0.8
        };
    }
  };
  
  // Generate a nice gradient for each card based on index
  const getCardGradient = (index: number) => {
    const gradients = [
      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
      "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
      "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(to top, #d5dee7 0%, #ffafbd 0%, #c9ffbf 100%)",
      "linear-gradient(to top, #5ee7df 0%, #b490ca 100%)",
      "linear-gradient(to top, #d299c2 0%, #fef9d7 100%)",
      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
      "linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)",
      "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
      "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)",
      "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
    ];
    
    return gradients[index % gradients.length];
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
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(125, 249, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
      }}
    >
      <div className="absolute w-full h-full flex items-center justify-center">
        {steps.map((step, index) => {
          const style = getCardStyle(index);
          const isActive = activeIndex === index;
          const gradient = getCardGradient(index);
          
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
              transition={{ 
                type: 'spring', 
                stiffness: 260, 
                damping: 20
              }}
              style={{
                width: '340px',
                height: '480px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className={`w-full h-full rounded-lg p-8 flex flex-col justify-between transform-gpu backdrop-blur-sm`}
                style={{
                  background: gradient,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
                      className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 transition-colors shadow-md"
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
