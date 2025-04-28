
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MarketHeader } from "@/components/market/MarketHeader";
import { MarketFooter } from "@/components/market/MarketFooter";
import { StatisticsHarvest } from "@/components/market/StatisticsHarvest";
import { SocialChatterWall } from "@/components/market/SocialChatterWall";
import { DeepDiveLibrary } from "@/components/market/DeepDiveLibrary";
import { SynthesisCanvas } from "@/components/market/SynthesisCanvas";
import { InsightDigest } from "@/components/market/InsightDigest";
import { AIAssistantPanel } from "@/components/market/AIAssistantPanel";
import { SecondaryInsightPool } from "@/components/market/SecondaryInsightPool";
import { MarketProvider } from "@/providers/MarketProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle } from "lucide-react";

const MarketPage: React.FC = () => {
  const [showInsightPool, setShowInsightPool] = useState(false);
  const [showInsightDigest, setShowInsightDigest] = useState(false);
  const [openSections, setOpenSections] = useState<number[]>([1]); // Start with the first section open
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const navigate = useNavigate();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Reset scroll position on page change
  useEffect(() => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = 0;
        }
      }
    }, 50);
  }, []);

  // Automatically open section 4 when sections 1, 2, and 3 are completed
  useEffect(() => {
    if (
      completedSections.includes(1) &&
      completedSections.includes(2) &&
      completedSections.includes(3) &&
      !openSections.includes(4)
    ) {
      setOpenSections(prev => [...prev, 4]);
    }
  }, [completedSections, openSections]);

  const toggleSection = (sectionNumber: number) => {
    setOpenSections(prev => 
      prev.includes(sectionNumber)
        ? prev.filter(s => s !== sectionNumber)
        : [...prev, sectionNumber]
    );
  };

  const completeSection = (sectionNumber: number) => {
    if (!completedSections.includes(sectionNumber)) {
      setCompletedSections(prev => [...prev, sectionNumber]);
    }
  };

  const toggleInsightPool = () => {
    setShowInsightPool(prev => !prev);
  };

  const handleModuleComplete = () => {
    // Navigate to timeline and update the competition module status
    navigate("/timeline", { state: { fromMarket: true } });
  };

  return (
    <MarketProvider>
      <div className="min-h-screen bg-background text-foreground flex">
        <div className="flex-1 flex flex-col">
          <MarketHeader 
            completedSections={completedSections} 
            onToggleInsightPool={toggleInsightPool}
          />
          
          <ScrollArea 
            className="flex-1 px-[120px] pt-8 pb-24"
            ref={scrollAreaRef}
          >
            <div className="min-h-[calc(100vh-20rem)]">
              {/* Statistics Harvest Section */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 }}
                className="mb-6"
              >
                <Card 
                  className={`border p-4 ${completedSections.includes(1) ? 'border-cyan' : 'border-border'}`}
                >
                  <Collapsible open={openSections.includes(1)} onOpenChange={() => toggleSection(1)}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center mr-3 font-semibold">
                          1
                        </div>
                        <h2 className="text-lg font-semibold">Statistics Harvest</h2>
                      </div>
                      <div className="flex items-center">
                        {completedSections.includes(1) && (
                          <CheckCircle className="w-5 h-5 text-cyan mr-2" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          0 / 8 accepted
                        </span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <StatisticsHarvest onComplete={() => completeSection(1)} />
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>

              {/* Social Chatter Wall Section */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="mb-6"
              >
                <Card 
                  className={`border p-4 ${completedSections.includes(2) ? 'border-cyan' : 'border-border'}`}
                >
                  <Collapsible open={openSections.includes(2)} onOpenChange={() => toggleSection(2)}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center mr-3 font-semibold">
                          2
                        </div>
                        <h2 className="text-lg font-semibold">Social Chatter Wall</h2>
                      </div>
                      <div className="flex items-center">
                        {completedSections.includes(2) && (
                          <CheckCircle className="w-5 h-5 text-cyan mr-2" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          0 / 6 saved
                        </span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <SocialChatterWall onComplete={() => completeSection(2)} />
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>

              {/* Deep Dive Library Section */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="mb-6"
              >
                <Card 
                  className={`border p-4 ${completedSections.includes(3) ? 'border-cyan' : 'border-border'}`}
                >
                  <Collapsible open={openSections.includes(3)} onOpenChange={() => toggleSection(3)}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center mr-3 font-semibold">
                          3
                        </div>
                        <h2 className="text-lg font-semibold">Deep-Dive Library</h2>
                      </div>
                      <div className="flex items-center">
                        {completedSections.includes(3) && (
                          <CheckCircle className="w-5 h-5 text-cyan mr-2" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          0 / 4 saved, 0 / 1 viewed
                        </span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <DeepDiveLibrary onComplete={() => completeSection(3)} />
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>

              {/* Synthesis Canvas Section */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.16 }}
                className="mb-6"
              >
                <Card 
                  className={`border p-4 ${completedSections.includes(4) ? 'border-cyan' : 'border-border'}`}
                >
                  <Collapsible open={openSections.includes(4)} onOpenChange={() => toggleSection(4)}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center mr-3 font-semibold">
                          4
                        </div>
                        <h2 className="text-lg font-semibold">Synthesis Canvas</h2>
                      </div>
                      <div className="flex items-center">
                        {completedSections.includes(4) && (
                          <CheckCircle className="w-5 h-5 text-cyan mr-2" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          0 / 10 starred
                        </span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <SynthesisCanvas onComplete={() => completeSection(4)} />
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>
            </div>
          </ScrollArea>
          
          <MarketFooter 
            completedSections={completedSections} 
            onShowInsightDigest={() => setShowInsightDigest(true)} 
            onModuleComplete={handleModuleComplete}
          />
        </div>
        
        {/* AI Assistant Panel */}
        <div className="w-[320px] border-l border-border/40 h-screen sticky top-0">
          <AIAssistantPanel 
            currentSection={openSections[openSections.length - 1] || 1} 
          />
        </div>
        
        {/* Insight Pool Drawer */}
        <SecondaryInsightPool 
          isOpen={showInsightPool} 
          onClose={() => setShowInsightPool(false)} 
        />
        
        {/* Insight Digest Modal */}
        <InsightDigest 
          isOpen={showInsightDigest} 
          onClose={() => setShowInsightDigest(false)}
          onComplete={handleModuleComplete}
        />
      </div>
    </MarketProvider>
  );
};

export default MarketPage;
