
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Welcome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        navigateToTimeline();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    // Show keyboard hint after 4 seconds
    const hintTimer = setTimeout(() => {
      setShowKeyboardHint(true);
    }, 4000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(hintTimer);
    };
  }, []);

  const navigateToTimeline = () => {
    navigate("/timeline");
  };

  // Handle button click with ripple effect
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!prefersReducedMotion) {
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.className = "ripple";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
    
    // Use motion.div exit animation through parent component
    setTimeout(navigateToTimeline, 50);
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-charcoal relative overflow-hidden"
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Radial vignette */}
      <div className="radial-vignette absolute inset-0"></div>
      
      {/* Logo */}
      <motion.div 
        className="absolute top-10 left-10 z-10"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="satoshi-font text-[20px] font-bold tracking-[0.5em] text-[#FFFFFFCC]">
          North of Zero
        </h1>
      </motion.div>
      
      {/* Animated gradient blob */}
      {!prefersReducedMotion && (
        <motion.div 
          className="w-[800px] h-[800px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden brand-gradient"
          animate={{ 
            rotate: 360,
            scale: [1, 1.12, 1]
          }}
          transition={{ 
            rotate: { 
              duration: 24, 
              ease: "linear", 
              repeat: Infinity 
            },
            scale: {
              duration: 24,
              times: [0, 0.5, 1],
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />
      )}
      
      {/* Static blob for reduced motion preference */}
      {prefersReducedMotion && (
        <div className="w-[800px] h-[800px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden brand-gradient" />
      )}
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.h2 
          className="inter-font font-medium text-[42px] leading-[52px] text-[#FFFFFFE6] text-center max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Turn a 60-word brief into a complete brand system.
        </motion.h2>
        
        <motion.p 
          className="inter-font text-[18px] text-[#FFFFFFA6] mt-4 text-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          Strategy, visuals and assets—generated in minutes, always under your direction.
        </motion.p>
        
        <motion.button
          className="mt-12 bg-white text-black hover:bg-cyan font-semibold py-3 px-6 rounded-full focus:outline-none focus:ring focus:ring-cyan/40 relative overflow-hidden transition-colors duration-200 ease-in-out"
          style={{ width: 200, height: 52 }}
          onClick={handleButtonClick}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.7, 
            duration: 0.5 
          }}
        >
          <span className="inter-font font-semibold text-[16px]">Map the journey →</span>
        </motion.button>
      </div>
      
      {/* Keyboard hint */}
      {showKeyboardHint && (
        <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <p className="inter-font text-[14px] text-white">⌘ + ↵ Skip intro</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Welcome;
