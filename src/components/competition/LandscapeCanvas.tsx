
import React, { useState, useRef, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { Edit2, Camera, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useCompetition } from "@/providers/CompetitionProvider";

interface CompetitorTokenProps {
  id: string;
  name: string;
  type: "startup" | "large-company";
  position: { x: number; y: number };
  priority: number;
  alexaRank?: string;
  fundingStage?: string;
  onDragEnd: (id: string, position: { x: number; y: number }) => void;
}

const CompetitorToken: React.FC<CompetitorTokenProps> = ({ 
  id, 
  name, 
  type, 
  position, 
  priority,
  alexaRank,
  fundingStage,
  onDragEnd 
}) => {
  const controls = useDragControls();
  const [isPressed, setIsPressed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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
  
  const pixelPosition = getPixelPosition();
  
  return (
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
      style={{ position: "absolute", top: 0, left: 0 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div 
        className={`flex items-center justify-center ${
          type === "startup" 
            ? "rounded-full bg-green-600/90" 
            : "rounded-md bg-blue-600/90"
        }`}
        style={{ 
          width: 60, 
          height: 60, 
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 ${priority}px ${priority / 2}px rgba(${type === "startup" ? "34, 197, 94" : "59, 130, 246"}, 0.${priority})`,
        }}
      >
        <span className="text-xs text-white font-medium text-center px-1">
          {name}
        </span>
      </div>
      
      {/* Details card on long press */}
      {showDetails && (
        <div 
          className="absolute left-1/2 top-full mt-2 w-48 bg-card border border-border rounded-md p-2 shadow-lg z-20"
          style={{ transform: "translateX(-50%)" }}
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
  );
};

interface BrandPinProps {
  position: { x: number; y: number } | null;
  onDragEnd: (position: { x: number; y: number }) => void;
}

const BrandPin: React.FC<BrandPinProps> = ({ position, onDragEnd }) => {
  const controls = useDragControls();
  const [isPressed, setIsPressed] = useState(false);
  
  // Calculate position in pixels for the brand pin
  const getPixelPosition = () => {
    if (!position) {
      // Default position outside canvas
      return { x: window.innerWidth - 140, y: 100 };
    }
    
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
    
    // Check if within canvas bounds
    if (
      info.point.x >= rect.left && 
      info.point.x <= rect.right &&
      info.point.y >= rect.top && 
      info.point.y <= rect.bottom
    ) {
      // Convert to canvas coordinates
      const canvasX = info.point.x - rect.left;
      const canvasY = info.point.y - rect.top;
      
      // Convert to normalized coordinates (0-1)
      const normalizedX = Math.min(Math.max(canvasX / rect.width, 0), 1);
      const normalizedY = Math.min(Math.max(canvasY / rect.height, 0), 1);
      
      onDragEnd({ x: normalizedX, y: normalizedY });
    }
  };
  
  const pixelPosition = getPixelPosition();
  
  return (
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
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={{ position: "absolute", top: 0, left: 0 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div 
        className={`flex items-center justify-center rounded-full ${
          position ? "bg-yellow-500" : "bg-yellow-500/70 animate-pulse"
        } shadow-lg`}
        style={{ 
          width: 60, 
          height: 60, 
          transform: "translate(-50%, -50%)"
        }}
      >
        <span className="text-xs text-white font-medium text-center px-1">
          Our Brand
        </span>
      </div>
      
      {!position && (
        <div className="absolute left-full top-1/2 ml-2 -mt-2 whitespace-nowrap bg-card border border-border rounded-md px-2 py-1 text-xs">
          Drag me onto the map
        </div>
      )}
    </motion.div>
  );
};

interface AxisLabelEditorProps {
  axis: "x" | "y";
  labels: string[];
  onUpdate: (axis: "x" | "y", newLabels: string[]) => void;
}

const AxisLabelEditor: React.FC<AxisLabelEditorProps> = ({ 
  axis, 
  labels, 
  onUpdate 
}) => {
  const [editing, setEditing] = useState<"start" | "end" | null>(null);
  const [startLabel, setStartLabel] = useState(labels[0]);
  const [endLabel, setEndLabel] = useState(labels[1]);
  
  const handleSave = () => {
    onUpdate(axis, [startLabel, endLabel]);
    setEditing(null);
  };
  
  // Suggested alternative labels
  const suggestions = {
    x: [
      ["Basic", "Advanced"],
      ["Generic", "Specialized"],
      ["Mass Market", "Premium"],
      ["Functional", "Emotional"],
      ["Product-led", "Community-led"]
    ],
    y: [
      ["Established", "Innovative"],
      ["Conventional", "Disruptive"],
      ["Complex", "Simple"],
      ["Enterprise", "Consumer"],
      ["Global", "Local"]
    ]
  };

  return (
    <div className="flex items-center gap-2">
      {/* Start label */}
      <div>
        {editing === "start" ? (
          <input
            type="text"
            className="w-28 bg-muted/50 border border-border/50 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
            value={startLabel}
            onChange={(e) => setStartLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            autoFocus
          />
        ) : (
          <button 
            className="text-sm flex items-center gap-1 hover:text-cyan transition-colors"
            onClick={() => setEditing("start")}
          >
            {startLabel}
            <Edit2 className="h-3 w-3 opacity-50" />
          </button>
        )}
      </div>
      
      <span className="text-muted-foreground">←→</span>
      
      {/* End label */}
      <div>
        {editing === "end" ? (
          <input
            type="text"
            className="w-28 bg-muted/50 border border-border/50 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan"
            value={endLabel}
            onChange={(e) => setEndLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            autoFocus
          />
        ) : (
          <button 
            className="text-sm flex items-center gap-1 hover:text-cyan transition-colors"
            onClick={() => setEditing("end")}
          >
            {endLabel}
            <Edit2 className="h-3 w-3 opacity-50" />
          </button>
        )}
      </div>
      
      {/* Suggestions popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <HelpCircle className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <h4 className="text-sm font-medium mb-2">Try these alternatives:</h4>
          <div className="space-y-1">
            {suggestions[axis].map((pair, index) => (
              <button
                key={index}
                className="w-full text-left px-2 py-1 text-sm rounded hover:bg-muted flex justify-between"
                onClick={() => {
                  setStartLabel(pair[0]);
                  setEndLabel(pair[1]);
                  handleSave();
                }}
              >
                <span>{pair[0]}</span>
                <span>↔</span>
                <span>{pair[1]}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const LandscapeCanvas: React.FC = () => {
  const { 
    selectedCompetitors,
    competitors,
    updateCompetitorPosition,
    axes,
    updateAxisLabels,
    brandPosition,
    setBrandPosition,
    createSnapshot
  } = useCompetition();
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLDivElement | null>(null);
  
  // Get only the selected competitors
  const selectedCompetitorData = competitors.filter(
    comp => selectedCompetitors.includes(comp.id)
  );
  
  // Initialize competitors with default positions if not set
  useEffect(() => {
    selectedCompetitorData.forEach(comp => {
      if (!comp.position) {
        const randomX = 0.3 + Math.random() * 0.4; // 0.3 - 0.7 range
        const randomY = 0.3 + Math.random() * 0.4; // 0.3 - 0.7 range
        updateCompetitorPosition(comp.id, { x: randomX, y: randomY });
      }
    });
  }, [selectedCompetitorData, updateCompetitorPosition]);
  
  // Update canvas size on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-medium">Competitive Landscape</h2>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center cursor-help">
                  <span className="text-xs text-muted-foreground">?</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs max-w-[240px]">
                  Drag competitors to position them on the map. The closer they are, the more similar their offerings.
                  Circle size represents market importance.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1"
            onClick={createSnapshot}
          >
            <Camera className="h-4 w-4" />
            Snapshot
          </Button>
        </div>
      </div>
      
      {/* Canvas container */}
      <div className="relative">
        {/* The actual canvas */}
        <div 
          id="landscape-canvas"
          ref={canvasRef}
          className="w-full h-[500px] bg-muted/20 rounded-lg border border-border relative overflow-hidden"
        >
          {/* Axes lines */}
          <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-border/50"></div>
          <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-border/50"></div>
          
          {/* Concentric rings */}
          <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
            <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] border border-border/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] border border-border/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[40%] h-[40%] border border-border/40 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[20%] h-[20%] border border-border/60 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-2 left-2 text-xs text-muted-foreground bg-background/80 p-1 rounded">
              Selected: {selectedCompetitors.length} | Canvas: {Math.round(canvasSize.width)}×{Math.round(canvasSize.height)}
            </div>
          )}
          
          {/* Competitor tokens */}
          {selectedCompetitorData.map(competitor => (
            <CompetitorToken
              key={competitor.id}
              id={competitor.id}
              name={competitor.name}
              type={competitor.type}
              position={competitor.position || { x: 0.5, y: 0.5 }}
              priority={competitor.priority}
              alexaRank={competitor.alexaRank}
              fundingStage={competitor.fundingStage}
              onDragEnd={updateCompetitorPosition}
            />
          ))}
          
          {/* Our brand pin */}
          <BrandPin 
            position={brandPosition} 
            onDragEnd={setBrandPosition} 
          />
        </div>
        
        {/* X-axis label editor */}
        <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 flex items-center">
          <AxisLabelEditor 
            axis="x"
            labels={axes.x}
            onUpdate={updateAxisLabels}
          />
        </div>
        
        {/* Y-axis label editor */}
        <div className="absolute top-1/2 left-[-110px] transform -translate-y-1/2 -rotate-90">
          <AxisLabelEditor 
            axis="y"
            labels={axes.y}
            onUpdate={updateAxisLabels}
          />
        </div>
      </div>
    </div>
  );
};
