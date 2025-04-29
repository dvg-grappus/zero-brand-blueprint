
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
  const wheelTimeoutRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  
  // Effect for cleaning up timeouts on unmount
  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);
  
  // Completely disable page scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Set up wheel event handler with a clean approach
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const handleWheelWithoutPassive = (e: WheelEvent) => {
      e.preventDefault();
      
      // If animation is in progress, block all wheel events
      if (isAnimating) {
        console.log("Blocking wheel event - animation in progress");
        return;
      }
      
      // Clear any existing wheel timeout
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      
      // Process only the latest wheel event in a sequence
      wheelTimeoutRef.current = window.setTimeout(() => {
        const direction = e.deltaY > 0 ? 'next' : 'prev';
        console.log(`Processing wheel event as ${direction} scroll`);
        handleScroll(direction);
      }, 50);
    };
    
    // Add non-passive event listener
    element.addEventListener('wheel', handleWheelWithoutPassive, { passive: false });
    
    // Clean up
    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheelWithoutPassive);
      }
    };
  }, [isAnimating]); // Re-establish event listeners when isAnimating changes
  
  // Move one card at a time with strict animation lock
  const handleScroll = (direction: 'next' | 'prev') => {
    // Double-check animation lock
    if (isAnimating) {
      console.log("Animation already in progress, blocking scroll");
      return;
    }
    
    // Set animation lock
    setIsAnimating(true);
    console.log(`Setting animation lock for ${direction} scroll`);
    
    // Calculate next index with bounds checking
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, steps.length - 1)
      : Math.max(activeIndex - 1, 0);
    
    if (newIndex !== activeIndex) {
      console.log(`Moving from index ${activeIndex} to ${newIndex}`);
      setActiveIndex(newIndex);
    } else {
      console.log(`Already at ${direction === 'next' ? 'last' : 'first'} card`);
      setIsAnimating(false);
      return;
    }
    
    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Release animation lock after fixed delay
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      console.log("Animation complete, releasing animation lock");
    }, 600);
  };
  
  // Handle card click - focus specific card
  const handleCardClick = (index: number) => {
    if (isAnimating || index === activeIndex) {
      console.log(`Card ${index} click ignored - ${isAnimating ? 'animation in progress' : 'already active'}`);
      return;
    }
    
    console.log(`Card ${index} clicked, navigating from ${activeIndex}`);
    setIsAnimating(true);
    setActiveIndex(index);
    
    // Release animation lock after transition
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      console.log(`Card ${index} animation completed`);
    }, 600);
  };
  
  // Improved touch handling
  const touchStartRef = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating) {
      return;
    }
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;
    
    if (Math.abs(diff) > 30) { // Increased threshold for touch
      handleScroll(diff > 0 ? 'next' : 'prev');
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAnimating) {
      console.log(`Key press ignored - animation in progress`);
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

  // Get visual style for each card
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
      tabIndex={0}
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
