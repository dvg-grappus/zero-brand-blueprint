
import { useState, useRef, useEffect } from "react";

interface UseCarouselNavigationProps {
  totalItems: number;
  animationDuration?: number;
}

interface CarouselNavigationResult {
  activeIndex: number;
  isAnimating: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  goToCard: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

/**
 * Custom hook that manages carousel navigation state and event handling
 */
export const useCarouselNavigation = ({
  totalItems,
  animationDuration = 300,
}: UseCarouselNavigationProps): CarouselNavigationResult => {
  // Keep all useState calls together in the same order every render
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Keep all useRef calls together in the same order every render
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const wheelEventBlockerRef = useRef<number | null>(null);
  const touchStartRef = useRef(0);
  const isWheelEnabledRef = useRef(true);
  const lastWheelTimeRef = useRef(0);
  
  // Keyboard navigation gets its own, separate lock
  const keyboardNavigationEnabledRef = useRef(true);
  
  // Navigate to specific card with enhanced protection
  const goToCard = (index: number) => {
    console.log("goToCard called", { index, currentIndex: activeIndex, isAnimating });
    
    if (isAnimating || index === activeIndex) {
      console.log("goToCard blocked - already animating or same index");
      return;
    }
    
    // Immediately disable wheel events
    isWheelEnabledRef.current = false;
    console.log("Wheel events disabled");
    
    setIsAnimating(true);
    console.log("Animation started");
    setActiveIndex(index);
    
    // Clear any existing timeouts
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }
    
    if (wheelEventBlockerRef.current) {
      window.clearTimeout(wheelEventBlockerRef.current);
    }
    
    // Release animation lock after transition
    animationTimeoutRef.current = window.setTimeout(() => {
      console.log("Animation completed, releasing lock");
      setIsAnimating(false);
      
      // After animation completes, wait a significant amount of time before re-enabling wheel events
      wheelEventBlockerRef.current = window.setTimeout(() => {
        console.log("Wheel events can be processed again");
        isWheelEnabledRef.current = true;
      }, 750); // Significant buffer to prevent chain scrolling
      
      // For keyboard navigation, we'll re-enable it immediately after animation completes
      keyboardNavigationEnabledRef.current = true;
      console.log("Keyboard navigation re-enabled");
    }, animationDuration + 50); // Add small buffer to ensure animation completed
  };
  
  // All useEffect hooks AFTER all useRefs and useState
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
      if (wheelEventBlockerRef.current) {
        window.clearTimeout(wheelEventBlockerRef.current);
      }
    };
  }, []);
  
  // Disable page scrolling while carousel is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  
  // Handle wheel events with completely different approach
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault(); // Always prevent default
      
      // Most aggressive blocking - only process if wheel events are enabled and not animating
      if (!isWheelEnabledRef.current || isAnimating) {
        console.log("Wheel event completely blocked - waiting for previous scroll to finish");
        return;
      }
      
      // Immediately mark wheel as processed to block subsequent events
      isWheelEnabledRef.current = false;
      console.log("Processing wheel event, blocking others");
      
      // Determine direction and trigger navigation
      if (e.deltaY > 0) {
        console.log("Scrolling DOWN/RIGHT");
        goToCard(Math.min(activeIndex + 1, totalItems - 1));
      } else {
        console.log("Scrolling UP/LEFT");
        goToCard(Math.max(activeIndex - 1, 0));
      }
    };
    
    // Add non-passive wheel event listener
    console.log("Wheel event listener added");
    element.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    // Clean up
    return () => {
      console.log("Wheel event listener removed");
      element.removeEventListener('wheel', handleWheelEvent);
    };
  }, [activeIndex, totalItems, animationDuration, isAnimating]);
  
  // Handle touch events for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    // For touch events, we'll also use the separate lock
    if (isAnimating || !keyboardNavigationEnabledRef.current) {
      console.log("Touch navigation blocked - animation in progress or keyboard nav disabled");
      return;
    }
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;
    
    // Use a threshold for better responsiveness
    if (Math.abs(diff) > 20) {
      // Temporarily disable keyboard/touch navigation
      keyboardNavigationEnabledRef.current = false;
      console.log("Touch navigation detected, disabling keyboard nav temporarily");
      
      if (diff > 0) {
        goToCard(Math.min(activeIndex + 1, totalItems - 1));
      } else {
        goToCard(Math.max(activeIndex - 1, 0));
      }
    }
  };
  
  // Handle keyboard navigation with more responsive behavior
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Add enhanced logging for keyboard navigation
    console.log(`Key pressed: ${e.key}, Current index: ${activeIndex}, Animation status: ${isAnimating}, Keyboard nav enabled: ${keyboardNavigationEnabledRef.current}`);
    
    // Only block keyboard navigation if actively animating
    if (isAnimating || !keyboardNavigationEnabledRef.current) {
      console.log(`Keyboard navigation blocked - animation: ${isAnimating}, keyboard enabled: ${keyboardNavigationEnabledRef.current}`);
      return;
    }
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      console.log(`Arrow DOWN/RIGHT pressed, attempting to navigate to index ${Math.min(activeIndex + 1, totalItems - 1)}`);
      
      // Temporarily disable keyboard navigation until animation completes
      keyboardNavigationEnabledRef.current = false;
      goToCard(Math.min(activeIndex + 1, totalItems - 1));
      e.preventDefault();
    } 
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      console.log(`Arrow UP/LEFT pressed, attempting to navigate to index ${Math.max(activeIndex - 1, 0)}`);
      
      // Temporarily disable keyboard navigation until animation completes
      keyboardNavigationEnabledRef.current = false;
      goToCard(Math.max(activeIndex - 1, 0));
      e.preventDefault();
    }
  };

  return {
    activeIndex,
    isAnimating,
    containerRef,
    goToCard,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd
  };
};
