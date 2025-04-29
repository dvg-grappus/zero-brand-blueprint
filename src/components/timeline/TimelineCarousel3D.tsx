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
  const lastWheelEventTime = useRef<number>(0);
  const wheelEvents = useRef<number[]>([]);
  const wheelDirections = useRef<string[]>([]);
  
  // Improved scroll handling with better debouncing and direction detection
  const handleScroll = (direction: 'next' | 'prev') => {
    if (isAnimating) {
      console.log("Animation in progress, ignoring scroll");
      return;
    }
    
    // Set animating flag to prevent multiple rapid scrolls
    setIsAnimating(true);
    console.log(`Scrolling ${direction}, setting isAnimating to true`);
    
    // Only move exactly one card at a time regardless of scroll speed
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, steps.length - 1)
      : Math.max(activeIndex - 1, 0);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      
      // Animation lock with a fixed timeout - enough time for the animation to complete
      setTimeout(() => {
        setIsAnimating(false);
        console.log("Animation completed, setting isAnimating to false");
        
        // Reset wheel events tracking after animation completes
        wheelEvents.current = [];
        wheelDirections.current = [];
      }, 400);
    } else {
      // If we're already at the first or last card, release animation lock faster
      setIsAnimating(false);
    }
  };
  
  // Improved wheel event handler with direction throttling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    const timeSinceLastEvent = now - lastWheelEventTime.current;
    lastWheelEventTime.current = now;
    
    // Add current event to tracking
    wheelEvents.current.push(now);
    wheelDirections.current.push(e.deltaY > 0 ? 'next' : 'prev');
    
    // Only keep events from last 300ms for direction analysis
    const recentTimeThreshold = now - 300;
    wheelEvents.current = wheelEvents.current.filter(time => time > recentTimeThreshold);
    wheelDirections.current = wheelDirections.current.slice(-wheelEvents.current.length);
    
    // If we have events and not currently animating
    if (wheelEvents.current.length > 0 && !isAnimating) {
      // Determine most common direction from recent events
      const lastDirection = wheelDirections.current[wheelDirections.current.length - 1];
      
      // Use the last direction for navigation
      handleScroll(lastDirection as 'next' | 'prev');
      
      // Clear tracked events after processing
      wheelEvents.current = [];
      wheelDirections.current = [];
    }
  };
  
  // Handle card click - focus the clicked card
  const handleCardClick = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    
    console.log(`Card ${index} clicked, navigating from ${activeIndex}`);
    setIsAnimating(true);
    
    setActiveIndex(index);
    
    // Release animation lock after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };
  
  // Simple touch handling
  const touchStartRef = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;
    
    if (Math.abs(diff) > 20) {
      handleScroll(diff > 0 ? 'next' : 'prev');
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      onWheel={handleWheel}
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
