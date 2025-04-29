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
  animationDuration = 200,
}: UseCarouselNavigationProps): CarouselNavigationResult => {
  // Keep all useState calls together in the same order every render
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // useRef calls after all useState calls
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const wheelProcessedRef = useRef(false);
  const touchStartRef = useRef(0);
  
  // Navigate to specific card
  const goToCard = (index: number) => {
    console.log("goToCard called", { index, currentIndex: activeIndex, isAnimating });
    
    if (isAnimating || index === activeIndex) {
      console.log("goToCard blocked - already animating or same index");
      return;
    }
    
    setIsAnimating(true);
    console.log("Animation started");
    setActiveIndex(index);
    
    // Release animation lock after transition
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }
    
    animationTimeoutRef.current = window.setTimeout(() => {
      console.log("Animation completed, releasing lock");
      setIsAnimating(false);
      
      // Add a delay before allowing wheel events again to prevent chain scrolling
      setTimeout(() => {
        console.log("Wheel events can be processed again");
        wheelProcessedRef.current = false;
      }, 750); // Significant buffer after animation completes
    }, animationDuration);
  };
  
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
  
  // Handle wheel events with completely different approach
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      // Use a simpler blocking mechanism with a ref
      if (wheelProcessedRef.current || isAnimating) {
        console.log("Wheel event completely blocked - waiting for previous scroll to finish");
        return;
      }
      
      // Immediately mark wheel as processed to block subsequent events
      wheelProcessedRef.current = true;
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
    if (isAnimating || wheelProcessedRef.current) {
      return;
    }
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;
    
    // Use a small threshold for better responsiveness
    if (Math.abs(diff) > 20) {
      wheelProcessedRef.current = true; // Block wheel events too
      if (diff > 0) {
        goToCard(Math.min(activeIndex + 1, totalItems - 1));
      } else {
        goToCard(Math.max(activeIndex - 1, 0));
      }
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAnimating || wheelProcessedRef.current) {
      return;
    }
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      wheelProcessedRef.current = true;
      goToCard(Math.min(activeIndex + 1, totalItems - 1));
      e.preventDefault();
    } 
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      wheelProcessedRef.current = true;
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
