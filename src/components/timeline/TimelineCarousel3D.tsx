
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
  const scrollTimeoutRef = useRef<number | null>(null);
  
  // Prevent scroll events from firing too frequently
  const handleScrollWithThrottle = (direction: 'next' | 'prev') => {
    // Clear any pending animation flags when a new scroll happens
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    
    if (isAnimating) {
      console.log("Animation in progress, ignoring scroll");
      return;
    }
    
    setIsAnimating(true);
    console.log(`Scrolling ${direction}, setting isAnimating to true`);
    
    // Always move exactly one card at a time
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, steps.length - 1)
      : Math.max(activeIndex - 1, 0);
    
    setActiveIndex(newIndex);
    
    // Release animation lock after transition completes
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      console.log("Animation completed, setting isAnimating to false");
    }, 400); // Give enough time for animation to finish
  };
  
  // Handle wheel event with improved handling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 'next' : 'prev';
    handleScrollWithThrottle(direction);
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
      handleScrollWithThrottle(diff > 0 ? 'next' : 'prev');
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      handleScrollWithThrottle('next');
      e.preventDefault();
    } 
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      handleScrollWithThrottle('prev');
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
        onPrevious={() => handleScrollWithThrottle('prev')}
        onNext={() => handleScrollWithThrottle('next')}
      />
    </div>
  );
};

export default TimelineCarousel3D;
