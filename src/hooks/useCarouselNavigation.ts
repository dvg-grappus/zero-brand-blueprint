
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
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
  
  // Handle wheel events by directly triggering navigation one card at a time
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    let isWheelAnimating = false;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      // If we're already animating, ignore wheel events
      if (isWheelAnimating) return;
      
      // Set animating flag
      isWheelAnimating = true;
      
      // Determine direction and trigger the same function used by arrow keys
      if (e.deltaY > 0) {
        // Down/Right - Same as ArrowDown or ArrowRight
        goToCard(Math.min(activeIndex + 1, totalItems - 1));
      } else {
        // Up/Left - Same as ArrowUp or ArrowLeft
        goToCard(Math.max(activeIndex - 1, 0));
      }
      
      // Release lock after animation is complete
      setTimeout(() => {
        isWheelAnimating = false;
      }, animationDuration);
    };
    
    // Add non-passive wheel event listener
    element.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    // Clean up
    return () => {
      element.removeEventListener('wheel', handleWheelEvent);
    };
  }, [activeIndex, totalItems, animationDuration]);
  
  // Navigate to specific card
  const goToCard = (index: number) => {
    if (isAnimating || index === activeIndex) {
      return;
    }
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    // Release animation lock after transition
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }
    
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
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
