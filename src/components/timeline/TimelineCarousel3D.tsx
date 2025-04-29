import React, { useState, useRef, useEffect } from "react";
import { Step } from "@/types/timeline";
import TimelineCard from "./TimelineCard";
import CarouselControls from "./CarouselControls";

interface TimelineCarouselProps {
  steps: Step[];
  onBegin: (id: number) => void;
}

// Interface for card style
interface CardStyle {
  zIndex: number;
  opacity: number;
  scale: number;
  rotateY?: string;
  rotateX?: string;
  translateZ?: string;
  translateX?: string;
  translateY?: string;
}

const TimelineCarousel3D: React.FC<TimelineCarouselProps> = ({ steps, onBegin }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastWheelTime = useRef<number>(0);
  const scrollTimerRef = useRef<number | null>(null);
  const wheelEventsCount = useRef<number>(0);
  const isProcessingScroll = useRef<boolean>(false);
  
  // Set up non-passive wheel event listener
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault(); // This will work now with non-passive listener
      
      // Count wheel events for debugging
      wheelEventsCount.current += 1;
      console.log(`Wheel event #${wheelEventsCount.current}, delta: ${e.deltaY}`);
      
      const now = Date.now();
      
      // Block too frequent wheel events or during animation
      if (isProcessingScroll.current || now - lastWheelTime.current < 800) {
        console.log(`Ignoring wheel event - ${isProcessingScroll.current ? 'processing in progress' : 'too soon after last event'}`);
        return;
      }
      
      // Set processing flag to true to block concurrent processing
      isProcessingScroll.current = true;
      lastWheelTime.current = now;
      
      // Process the scroll with a slight delay to ensure we only take one scroll action
      setTimeout(() => {
        const direction = e.deltaY > 0 ? 'next' : 'prev';
        console.log(`Processing wheel event as ${direction} scroll`);
        handleScroll(direction);
        
        // Reset processing flag after a delay
        setTimeout(() => {
          isProcessingScroll.current = false;
        }, 50); 
      }, 10);
    };
    
    // Add non-passive event listener (the third parameter {passive: false} is critical here)
    element.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    // Clean up
    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheelEvent);
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);
  
  // Enhanced strict scroll handling with proper animation lock
  const handleScroll = (direction: 'next' | 'prev') => {
    // If animation is in progress, completely block further scroll attempts
    if (isAnimating) {
      console.log("Animation in progress, blocking scroll attempt");
      return;
    }
    
    // Set animating flag to prevent multiple scroll events
    setIsAnimating(true);
    console.log(`Processing scroll ${direction}, setting isAnimating to true`);
    
    // Reset wheel event counter
    wheelEventsCount.current = 0;
    
    // Move exactly one card at a time
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, steps.length - 1)
      : Math.max(activeIndex - 1, 0);
    
    if (newIndex !== activeIndex) {
      console.log(`Moving from index ${activeIndex} to ${newIndex}`);
      setActiveIndex(newIndex);
      
      // Clear any existing timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      
      // Set a strict animation lock with a fixed timeout
      scrollTimerRef.current = window.setTimeout(() => {
        setIsAnimating(false);
        console.log("Animation completed, releasing animation lock");
        scrollTimerRef.current = null;
      }, 800); // Longer lock to ensure complete animation
    } else {
      // If we're already at the first or last card
      console.log(`At ${direction === 'next' ? 'last' : 'first'} card, can't scroll ${direction}`);
      setIsAnimating(false);
    }
  };
  
  // Handle card click with better logging
  const handleCardClick = (index: number) => {
    if (isAnimating || index === activeIndex) {
      console.log(`Card ${index} click ignored - ${isAnimating ? 'animation in progress' : 'already active'}`);
      return;
    }
    
    console.log(`Card ${index} clicked, navigating from ${activeIndex}`);
    setIsAnimating(true);
    
    setActiveIndex(index);
    
    // Release animation lock after transition with better logging
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    scrollTimerRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      console.log(`Card ${index} animation completed`);
      scrollTimerRef.current = null;
    }, 800);
  };
  
  // Improved touch handling
  const touchStartRef = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
    console.log(`Touch start at ${touchStartRef.current}`);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating || isProcessingScroll.current) {
      console.log("Ignoring touch end - animation or processing in progress");
      return;
    }
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;
    
    console.log(`Touch end, diff: ${diff}px`);
    
    if (Math.abs(diff) > 20) {
      isProcessingScroll.current = true;
      handleScroll(diff > 0 ? 'next' : 'prev');
      
      // Reset processing flag after a delay
      setTimeout(() => {
        isProcessingScroll.current = false;
      }, 50);
    } else {
      console.log("Touch movement too small, ignoring");
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);
  
  // Disable page scrolling completely
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAnimating || isProcessingScroll.current) {
      console.log(`Key press ignored - ${isAnimating ? 'animation in progress' : 'processing in progress'}`);
      return;
    }
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      handleScroll('next');
      e.preventDefault();
    } 
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      handleScroll('prev');
      e.preventDefault();
    } 
    else if ((e.key === 'Enter' || e.key === ' ') && activeIndex >= 0) {
      onBegin(steps[activeIndex].id);
      e.preventDefault();
    }
  };

  // Get visual style for each card based on its position relative to active card
  const getCardStyle = (index: number): CardStyle => {
    const diff = index - activeIndex;
    
    // Base styles for all cards
    const baseStyles: CardStyle = {
      zIndex: 50 - Math.abs(diff) * 10,
      opacity: diff === 0 ? 1 : Math.max(1 - Math.abs(diff) * 0.3, 0),
      scale: diff === 0 ? 1 : Math.max(0.95 - Math.abs(diff) * 0.05, 0.8),
      rotateY: '-15deg',
      rotateX: '8deg',
      translateZ: '0px',
      translateX: '0px',
      translateY: '0px'
    };
    
    // Only show a limited number of cards in each direction
    if (Math.abs(diff) > 3) {
      return { ...baseStyles, opacity: 0 };
    }
    
    // Active card
    if (diff === 0) {
      return {
        ...baseStyles,
        rotateY: '-15deg',
        rotateX: '8deg',
        translateZ: '0px',
        translateX: '0%',
        translateY: '0px',
      };
    } else if (diff > 0) {
      // Cards after active
      return {
        ...baseStyles,
        rotateY: '-15deg',
        rotateX: '8deg',
        translateZ: `-${diff * 150}px`,
        translateX: `${diff * 50}%`,
        translateY: `-${diff * 80}px`,
      };
    } else {
      // Cards before active
      return {
        ...baseStyles,
        rotateY: '-15deg',
        rotateX: '8deg',
        translateZ: `${Math.abs(diff) * 150}px`,
        translateX: `${diff * 50}%`,
        translateY: `${Math.abs(diff) * 80}px`,
      };
    }
  };
  
  return (
    <div 
      className="w-full h-[700px] relative" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make div focusable for keyboard events
      style={{ 
        perspective: '1500px',
        touchAction: 'none',
        overflow: 'visible',
        outline: 'none',
      }}
    >
      <div className="absolute w-full h-full flex items-center justify-center">
        {steps.map((step, index) => {
          const style = getCardStyle(index);
          const isActive = activeIndex === index;
          const visible = Math.abs(index - activeIndex) <= 3;
          
          if (!visible) return null;
          
          return (
            <TimelineCard
              key={step.id}
              step={step}
              isActive={isActive}
              style={style}
              onClick={() => handleCardClick(index)}
              onBeginClick={() => onBegin(step.id)}
            />
          );
        })}
      </div>
      
      <CarouselControls 
        activeIndex={activeIndex}
        totalSteps={steps.length}
        onPrevious={() => handleScroll('prev')}
        onNext={() => handleScroll('next')}
      />
    </div>
  );
};

export default TimelineCarousel3D;
