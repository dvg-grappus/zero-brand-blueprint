import React, { useState, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { useCompetition } from "@/providers/CompetitionProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface CompetitorTokenProps {
  id: string;
  name: string;
  type: "startup" | "large-company" | "you";
  position: { x: number; y: number };
  priority: number;
  alexaRank?: string;
  fundingStage?: string;
  website?: string;
  onDragEnd: (id: string, position: { x: number; y: number }) => void;
}

export const CompetitorToken: React.FC<CompetitorTokenProps> = ({ 
  id, 
  name, 
  type, 
  position, 
  priority,
  alexaRank,
  fundingStage,
  website,
  onDragEnd 
}) => {
  const controls = useDragControls();
  const [isPressed, setIsPressed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate position in pixels relative to canvas size
  const getPixelPosition = () => {
    const canvas = document.getElementById("landscape-canvas");
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: position.x * rect.width,
      y: position.y * rect.height
    };
  };
  
  const handleDragEnd = (event: any, info: any) => {
    const canvas = document.getElementById("landscape-canvas");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const canvasX = info.point.x - rect.left;
    const canvasY = info.point.y - rect.top;
    
    // Convert pixel coordinates back to normalized (0-1) coordinates
    const normalizedX = Math.min(Math.max(canvasX / rect.width, 0), 1);
    const normalizedY = Math.min(Math.max(canvasY / rect.height, 0), 1);
    
    onDragEnd(id, { x: normalizedX, y: normalizedY });
  };
  
  const handlePointerDown = () => {
    // Start a timeout to detect long press
    timeoutRef.current = setTimeout(() => {
      setShowDetails(true);
    }, 500);
    
    setIsPressed(true);
  };
  
  const handlePointerUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsPressed(false);
    
    // Keep details open for a short time after release if shown
    if (showDetails) {
      setTimeout(() => {
        setShowDetails(false);
      }, 2000);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click from propagating to avoid drag issues
    if (!isPressed) {
      e.stopPropagation();
      setShowPreview(true);
    }
  };
  
  const pixelPosition = getPixelPosition();
  
  return (
    <>
      <Sheet open={showPreview} onOpenChange={setShowPreview}>
        <SheetTrigger asChild>
          <motion.div
            drag
            dragControls={controls}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            dragElastic={0.2}
            initial={false}
            animate={{ 
              x: pixelPosition.x, 
              y: pixelPosition.y,
              scale: isPressed ? 1.1 : 1,
              zIndex: isPressed ? 10 : 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={handleClick}
            style={{ position: "absolute", top: 0, left: 0 }}
            className="cursor-grab active:cursor-grabbing"
          >
            <div 
              className={`flex items-center justify-center ${
                type === "you"
                  ? "rounded-full bg-[#FEF7CD] text-black border border-amber-400"
                  : type === "startup" 
                    ? "rounded-full bg-green-600/90" 
                    : "rounded-md bg-blue-600/90"
              }`}
              style={{ 
                width: 60, 
                height: 60, 
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 ${priority}px ${priority / 2}px rgba(${
                  type === "you" 
                    ? "250, 204, 21"
                    : type === "startup" 
                      ? "34, 197, 94" 
                      : "59, 130, 246"
                }, 0.${priority})`,
              }}
            >
              <span className={`text-xs ${type === "you" ? "text-black font-semibold" : "text-white font-medium"} text-center px-1`}>
                {name}
              </span>
            </div>
            
            {/* Details card on long press */}
            {showDetails && (
              <div 
                className="absolute left-1/2 top-full mt-2 w-48 bg-card border border-border rounded-md p-2 shadow-lg z-20"
                style={{ transform: "translateX(-50%)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="font-medium mb-1">{name}</h4>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between mb-1">
                    <span>Rank:</span>
                    <span>{alexaRank || "N/A"}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Funding:</span>
                    <span>{fundingStage || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <span>{priority}/10</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
          {website && (
            <iframe 
              src={website} 
              title={`${name} website`} 
              className="w-full h-full border-none"
            />
          )}
          {!website && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No website available</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
