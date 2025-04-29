
import { useState, useRef, useEffect } from "react";

interface UseCarouselNavigationProps {
  totalItems: number;
  animationDuration?: number;
  scrollDelay?: number;
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
  scrollDelay = 150
}: UseCarouselNavigationProps): CarouselNavigationResult => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef(0);
  const touchStartRef = useRef(0);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
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
  
  // Handle wheel events with non-passive listener
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      
      // If animation is in progress, block event
      if (isAnimating) {
        console.log("Ignoring wheel event - animation in progress");
        return;
      }
      
      // Enforce minimum delay between processing events to prevent rapid scrolling
      if (now - lastScrollTimeRef.current < scrollDelay) {
        console.log("Ignoring wheel event - too soon after last event");
        return;
      }
      
      console.log(`Wheel event, delta: ${e.deltaY}`);
      lastScrollTimeRef.current = now;
      
      // Process the scroll with animation lock
      console.log("Processing wheel event as " + (e.deltaY > 0 ? "next" : "prev") + " scroll");
      console.log("Processing scroll " + (e.deltaY > 0 ? "next" : "prev") + ", setting isAnimating to true");
      
      // Determine scroll direction
      handleScroll(e.deltaY > 0 ? 'next' : 'prev');
    };
    
    // Add non-passive wheel event listener
    element.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    // Clean up
    return () => {
      element.removeEventListener('wheel', handleWheelEvent);
    };
  }, [isAnimating, scrollDelay]);
  
  // Handle navigation with animation lock
  const handleScroll = (direction: 'next' | 'prev') => {
    if (isAnimating) {
      console.log("Animation already in progress, blocking scroll");
      return;
    }
    
    // Calculate next index with bounds checking
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, totalItems - 1)
      : Math.max(activeIndex - 1, 0);
    
    if (newIndex === activeIndex) {
      console.log(`Already at ${direction === 'next' ? 'last' : 'first'} card`);
      return;
    }
    
    // Set animation lock
    setIsAnimating(true);
    console.log(`Moving from index ${activeIndex} to ${newIndex}`);
    
    // Update the active index
    setActiveIndex(newIndex);
    
    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }
    
    // Release animation lock after transition completes
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      console.log("Animation completed, releasing animation lock");
    }, animationDuration);
  };
  
  // Navigate to specific card
  const goToCard = (index: number) => {
    if (isAnimating || index === activeIndex) {
      return;
    }
    
    console.log(`Card ${index} clicked, navigating from ${activeIndex}`);
    setIsAnimating(true);
    setActiveIndex(index);
    
    // Release animation lock after transition
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }
    
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      console.log(`Card ${index} animation completed`);
    }, animationDuration);
  };
  
  // Handle touch events for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating) {
      return;
    }
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;
    
    // Reduced threshold for better responsiveness
    if (Math.abs(diff) > 20) {
      handleScroll(diff > 0 ? 'next' : 'prev');
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAnimating) {
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
