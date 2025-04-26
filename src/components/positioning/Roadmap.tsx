
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StickyNote from "./StickyNote";
import StepNavBar from "./StepNavBar";
import { PositioningContext } from "@/pages/StepPage";

// Mock data for development - in production this would come from GPT API
const mockMilestones = [
  "Launch MVP with core features",
  "Reach 1000 active users",
  "Release premium tier with advanced features",
  "Expand to enterprise market",
  "Introduce collaborative team features",
  "Launch mobile app with full feature parity"
];

const timelinePoints = ["Now", "1 yr", "3 yr", "5 yr", "10 yr"];

const Roadmap: React.FC = () => {
  const { roadmapMilestones, setRoadmapMilestones } = useContext(PositioningContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [discardedMilestones, setDiscardedMilestones] = useState<string[]>([]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customMilestone, setCustomMilestone] = useState("");
  
  useEffect(() => {
    // Simulate GPT API call
    const timer = setTimeout(() => {
      // Here you would make the actual API call
      setMilestones(mockMilestones);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAssignMilestone = (milestone: string, timePoint: string) => {
    // Remove from any existing timepoint
    const updatedMilestones = { ...roadmapMilestones };
    
    Object.keys(updatedMilestones).forEach(point => {
      updatedMilestones[point] = updatedMilestones[point].filter(m => m !== milestone);
    });
    
    // Add to new timepoint
    updatedMilestones[timePoint] = [...updatedMilestones[timePoint], milestone];
    
    setRoadmapMilestones(updatedMilestones);
  };
  
  const handleDiscardMilestone = (milestone: string) => {
    setDiscardedMilestones(prev => 
      prev.includes(milestone)
        ? prev.filter(m => m !== milestone)
        : [...prev, milestone]
    );
    
    // Remove from any timepoint if discarded
    const updatedMilestones = { ...roadmapMilestones };
    
    Object.keys(updatedMilestones).forEach(point => {
      updatedMilestones[point] = updatedMilestones[point].filter(m => m !== milestone);
    });
    
    setRoadmapMilestones(updatedMilestones);
  };
  
  const addCustomMilestone = () => {
    if (customMilestone.trim()) {
      setMilestones(prev => [...prev, customMilestone]);
      setCustomMilestone("");
      setDialogOpen(false);
    }
  };
  
  const isMilestoneAssigned = (milestone: string) => {
    return Object.values(roadmapMilestones).some(pointMilestones => 
      pointMilestones.includes(milestone)
    );
  };
  
  const validateRoadmap = () => {
    // Check if each timepoint has at least one milestone
    const isValid = timelinePoints.every(point => roadmapMilestones[point].length > 0);
    
    if (!isValid) {
      toast.error("Place at least one milestone at each timepoint");
      return false;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (validateRoadmap()) {
      window.location.href = "/step/1/values";
    }
  };
  
  const getMilestoneTimepoint = (milestone: string) => {
    for (const point of timelinePoints) {
      if (roadmapMilestones[point].includes(milestone)) {
        return point;
      }
    }
    return null;
  };
  
  return (
    <>
      <div className="col-span-12">
        <motion.p
          className="text-gray-500 text-sm mb-1 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Plot the headlines you'll write.
        </motion.p>
        
        <motion.h1
          className="text-[32px] font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Roadmap
        </motion.h1>
        
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Timeline */}
          <div className="relative mb-12">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300"></div>
            
            <div className="flex justify-between relative">
              {timelinePoints.map((point, index) => (
                <div key={point} className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-black mb-2 z-10"></div>
                  <span className="text-sm font-medium">{point}</span>
                  
                  {/* Milestone dropzone */}
                  <div className="mt-4 min-h-[250px] w-[180px] flex flex-col items-center gap-4">
                    {roadmapMilestones[point].map((milestone, idx) => (
                      <motion.div
                        key={`${point}-${idx}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <StickyNote
                          id={`${point}-${idx}`}
                          content={milestone}
                          isSelected={true}
                          isDiscarded={false}
                          onClick={() => {/* Already assigned */}}
                          onDiscard={() => handleDiscardMilestone(milestone)}
                          color="#E5FBFF" // Light cyan for milestone cards
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Milestones pool */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Available Milestones</h3>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Add Custom Milestone
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center mt-8">
                <div className="w-[180px] h-[220px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
                <p className="text-gray-500">Still shaping ideas... one second.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {milestones.map((milestone, index) => {
                  // Skip if discarded or already assigned to a timepoint
                  if (discardedMilestones.includes(milestone)) {
                    return null;
                  }
                  
                  const assignedTimepoint = getMilestoneTimepoint(milestone);
                  if (assignedTimepoint) {
                    return null;
                  }
                  
                  return (
                    <div key={`milestone-${index}`} className="relative">
                      <StickyNote
                        id={`milestone-${index}`}
                        content={milestone}
                        isSelected={isMilestoneAssigned(milestone)}
                        isDiscarded={discardedMilestones.includes(milestone)}
                        onClick={() => {/* No action on click */}}
                        onDiscard={() => handleDiscardMilestone(milestone)}
                        color="#E5FBFF" // Light cyan for milestone cards
                      />
                      
                      <div className="mt-2 flex justify-center gap-2">
                        {timelinePoints.map(point => (
                          <button
                            key={point}
                            onClick={() => handleAssignMilestone(milestone, point)}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                          >
                            {point}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Add Custom Milestone Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Milestone</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={customMilestone}
              onChange={(e) => setCustomMilestone(e.target.value)}
              placeholder="Enter your milestone..."
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={addCustomMilestone}>Add Milestone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <StepNavBar 
        title="Roadmap"
        nextStep="/step/1/values"
        nextButtonLabel="Save timeline →"
        isButtonDisabled={isLoading || !validateRoadmap()}
        onNext={handleNext}
      />
    </>
  );
};

export default Roadmap;
