import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Welcome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        navigateToTimeline();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
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
    
    setTimeout(navigateToTimeline, 50);
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-background relative overflow-hidden"
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="radial-vignette absolute inset-0 opacity-20"></div>
      
      <motion.div 
        className="absolute top-10 left-10 z-10"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="satoshi-font text-[20px] font-bold tracking-[0.5em] text-foreground/80">
          North of Zero
        </h1>
      </motion.div>
      
      {!prefersReducedMotion && (
        <motion.div 
          className="w-[800px] h-[800px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden brand-gradient opacity-20"
          animate={{ 
            rotate: 360,
            scale: [1, 1.12, 1]
          }}
          transition={{ 
            rotate: { duration: 24, ease: "linear", repeat: Infinity },
            scale: {
              duration: 24,
              times: [0, 0.5, 1],
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />
      )}
      
      {prefersReducedMotion && (
        <div className="w-[800px] h-[800px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden brand-gradient opacity-20" />
      )}
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.h2 
          className="inter-font font-medium text-[42px] leading-[52px] text-foreground text-center max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Turn a 60-word brief into a complete brand system.
        </motion.h2>
        
        <motion.p 
          className="inter-font text-[18px] text-foreground/70 mt-4 text-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          Strategy, visuals and assets—generated in minutes, always under your direction.
        </motion.p>
        
        <motion.button
          className="mt-12 bg-foreground text-background hover:bg-foreground/90 font-semibold py-3 px-6 rounded-full focus:outline-none focus:ring focus:ring-foreground/20 relative overflow-hidden transition-colors duration-200 ease-in-out"
          style={{ width: 200, height: 52 }}
          onClick={handleButtonClick}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <span className="inter-font font-semibold text-[16px]">Map the journey →</span>
        </motion.button>
      </div>
      
      {showKeyboardHint && (
        <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <p className="inter-font text-[14px] text-foreground/60">⌘ + ↵ Skip intro</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Welcome;
