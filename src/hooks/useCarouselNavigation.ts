
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
  const [isWheelEnabled, setIsWheelEnabled] = useState(true);
  
  // useRef calls after all useState calls
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const wheelTimeoutRef = useRef<number | null>(null);
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
    }, animationDuration);
  };
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
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
  
  // Handle wheel events by directly triggering navigation one card at a time
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      // Only process wheel events when not animating and wheel is enabled
      if (isAnimating || !isWheelEnabled) {
        console.log("Wheel event blocked - wheel disabled or animation in progress");
        return;
      }
      
      // Disable wheel immediately to prevent multiple triggers
      setIsWheelEnabled(false);
      console.log("Wheel events disabled");
      
      // Determine direction and trigger navigation
      if (e.deltaY > 0) {
        console.log("Scrolling DOWN/RIGHT");
        goToCard(Math.min(activeIndex + 1, totalItems - 1));
      } else {
        console.log("Scrolling UP/LEFT");
        goToCard(Math.max(activeIndex - 1, 0));
      }
      
      // Wait for animation PLUS additional buffer time before re-enabling
      // This ensures we don't get multiple scroll events firing in succession
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
      
      wheelTimeoutRef.current = window.setTimeout(() => {
        console.log("Re-enabling wheel events");
        setIsWheelEnabled(true);
      }, animationDuration + 150); // Longer buffer to ensure animation is complete
    };
    
    // Add non-passive wheel event listener
    element.addEventListener('wheel', handleWheelEvent, { passive: false });
    console.log("Wheel event listener added");
    
    // Clean up
    return () => {
      element.removeEventListener('wheel', handleWheelEvent);
      console.log("Wheel event listener removed");
    };
  }, [activeIndex, totalItems, animationDuration, isAnimating, isWheelEnabled]);
  
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
    
    // Use a small threshold for better responsiveness
    if (Math.abs(diff) > 20) {
      if (diff > 0) {
        goToCard(Math.min(activeIndex + 1, totalItems - 1));
      } else {
        goToCard(Math.max(activeIndex - 1, 0));
      }
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAnimating) {
      return;
    }
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      goToCard(Math.min(activeIndex + 1, totalItems - 1));
      e.preventDefault();
    } 
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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
