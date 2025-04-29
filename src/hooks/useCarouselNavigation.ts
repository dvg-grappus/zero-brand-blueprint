
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
  animationDuration = 200,
  scrollDelay = 100
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
  
  // Handle wheel events by directly triggering the same logic as arrow keys
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      // Block wheel events during animation
      if (isAnimating) {
        return;
      }
      
      // Determine direction
      const direction = e.deltaY > 0 ? 'next' : 'prev';
      
      // Use the same logic as the keyboard handler
      handleScroll(direction);
    };
    
    // Add non-passive wheel event listener
    element.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    // Clean up
    return () => {
      element.removeEventListener('wheel', handleWheelEvent);
    };
  }, [isAnimating, activeIndex, totalItems]);
  
  // Handle navigation with animation lock
  const handleScroll = (direction: 'next' | 'prev') => {
    if (isAnimating) {
      return;
    }
    
    // Calculate next index with bounds checking
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, totalItems - 1)
      : Math.max(activeIndex - 1, 0);
    
    if (newIndex === activeIndex) {
      return;
    }
    
    // Set animation lock
    setIsAnimating(true);
    
    // Update the active index
    setActiveIndex(newIndex);
    
    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }
    
    // Release animation lock after transition completes
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
  };
  
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
