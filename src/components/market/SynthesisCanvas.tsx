
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useMarket } from "@/providers/MarketProvider";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface SynthesisCanvasProps {
  onComplete: () => void;
}

export const SynthesisCanvas: React.FC<SynthesisCanvasProps> = ({ onComplete }) => {
  const { 
    marketInsights, 
    starInsight, 
    mergeInsights, 
    moveInsight, 
    generateHeadline,
    headline,
    starredMarketInsightsCount,
    isSection4Complete 
  } = useMarket();
  
  const [draggedInsight, setDraggedInsight] = useState<string | null>(null);
  const [mergeMode, setMergeMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergedText, setMergedText] = useState('');
  const dragSourceColumn = useRef<string | null>(null);
  
  // Monitor for completion
  useEffect(() => {
    if (isSection4Complete) {
      onComplete();
    }
  }, [isSection4Complete, onComplete]);
  
  const handleDragStart = (insightId: string, columnType: string) => {
    setDraggedInsight(insightId);
    dragSourceColumn.current = columnType;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (columnType: 'primary' | 'secondary' | 'market', e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (draggedInsight) {
      // Handle moving the insight to the new column
      moveInsight(draggedInsight, columnType);
      setDraggedInsight(null);
      dragSourceColumn.current = null;
    }
  };
  
  const handleMergeSelect = (insightId: string) => {
    if (selectedForMerge.includes(insightId)) {
      setSelectedForMerge(prev => prev.filter(id => id !== insightId));
    } else {
      setSelectedForMerge(prev => [...prev, insightId]);
    }
  };
  
  const openMergeDialog = () => {
    if (selectedForMerge.length < 2) return;
    
    // Create initial merged text
    const selectedInsights = marketInsights.filter(i => selectedForMerge.includes(i.id));
    const initialMergedText = `Combined insight: ${selectedInsights.map(i => i.text.slice(0, 30)).join(" + ")}...`;
    setMergedText(initialMergedText);
    
    setMergeDialogOpen(true);
  };
  
  const handleMerge = () => {
    if (mergedText.trim() && selectedForMerge.length >= 2) {
      mergeInsights(selectedForMerge, mergedText);
      setMergeDialogOpen(false);
      setSelectedForMerge([]);
      setMergeMode(false);
    }
  };
  
  const cancelMerge = () => {
    setMergeMode(false);
    setSelectedForMerge([]);
  };
  
  // Filter insights by column
  const primaryInsights = marketInsights.filter(insight => insight.column === 'primary');
  const secondaryInsights = marketInsights.filter(insight => insight.column === 'secondary');
  const marketInsightsList = marketInsights.filter(insight => insight.column === 'market');
  
  // Insight card component
  const InsightCard: React.FC<{ 
    insight: any; 
    index: number; 
    inMergeMode: boolean;
  }> = ({ insight, index, inMergeMode }) => {
    const isSelected = selectedForMerge.includes(insight.id);
    const isStarred = insight.starred;
    
    return (
      <motion.div
        className={`bg-[#262626] rounded-lg p-4 mb-4 cursor-pointer ${
          isStarred 
            ? 'border border-cyan shadow-[0_0_15px_rgba(125,249,255,0.4)] scale-[1.05]' 
            : isSelected 
              ? 'border-2 border-cyan' 
              : 'border border-transparent'
        } transition-all`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        whileHover={{ scale: isStarred ? 1.08 : 1.03 }}
        draggable={!inMergeMode}
        onDragStart={(e) => handleDragStart(insight.id, insight.column || '')}
        onClick={() => {
          if (inMergeMode) {
            handleMergeSelect(insight.id);
          }
        }}
      >
        <div className="flex justify-between mb-2">
          <div className="bg-[#303030] text-xs px-2 py-1 rounded flex items-center gap-1">
            <span>{insight.source}</span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              starInsight(insight.id);
            }}
            className={`${
              isStarred ? 'text-yellow-500' : 'text-muted-foreground'
            } hover:text-yellow-500`}
          >
            <Star className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm">{insight.text}</p>
      </motion.div>
    );
  };
  
  const columnHeaderColors = {
    primary: 'bg-purple-600',
    secondary: 'bg-amber-500',
    market: 'bg-teal-500'
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Button 
            variant={!mergeMode ? "outline" : "secondary"}
            size="sm" 
            onClick={() => generateHeadline()}
            disabled={mergeMode || starredMarketInsightsCount < 3}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Generate headline
          </Button>
          
          {mergeMode ? (
            <>
              <Button 
                variant="secondary"
                size="sm" 
                onClick={openMergeDialog}
                disabled={selectedForMerge.length < 2}
              >
                Merge selected ({selectedForMerge.length})
              </Button>
              
              <Button 
                variant="ghost"
                size="sm" 
                onClick={cancelMerge}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => setMergeMode(true)}
            >
              Enable merge mode
            </Button>
          )}
        </div>
        
        <div className="text-sm">
          Market insights starred: <span className="text-cyan">{starredMarketInsightsCount}</span> / 10
        </div>
      </div>
      
      {/* Generated headline display */}
      {headline && (
        <div className="mb-6 p-4 bg-[#262626] border border-cyan/30 rounded-lg">
          <h2 className="text-xl font-semibold">{headline}</h2>
        </div>
      )}
      
      <div className="flex gap-6">
        {/* Primary column */}
        <div 
          className="flex-1 border border-border/40 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop('primary', e)}
        >
          <div className={`${columnHeaderColors.primary} text-center py-2 rounded-md mb-4`}>
            <h3 className="text-sm font-medium uppercase tracking-wider">Primary</h3>
          </div>
          
          <div>
            {primaryInsights.length === 0 && (
              <div className="text-center text-muted-foreground p-6">
                Drag insights here
              </div>
            )}
            
            {primaryInsights.map((insight, index) => (
              <InsightCard 
                key={insight.id} 
                insight={insight} 
                index={index}
                inMergeMode={mergeMode}
              />
            ))}
          </div>
        </div>
        
        {/* Secondary column */}
        <div 
          className="flex-1 border border-border/40 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop('secondary', e)}
        >
          <div className={`${columnHeaderColors.secondary} text-center py-2 rounded-md mb-4`}>
            <h3 className="text-sm font-medium uppercase tracking-wider">Secondary</h3>
          </div>
          
          <div>
            {secondaryInsights.length === 0 && (
              <div className="text-center text-muted-foreground p-6">
                Drag insights here
              </div>
            )}
            
            {secondaryInsights.map((insight, index) => (
              <InsightCard 
                key={insight.id} 
                insight={insight} 
                index={index}
                inMergeMode={mergeMode}
              />
            ))}
          </div>
        </div>
        
        {/* Market column */}
        <div 
          className="flex-1 border border-border/40 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop('market', e)}
        >
          <div className={`${columnHeaderColors.market} text-center py-2 rounded-md mb-4`}>
            <h3 className="text-sm font-medium uppercase tracking-wider">Market</h3>
          </div>
          
          <div>
            {marketInsightsList.length === 0 && (
              <div className="text-center text-muted-foreground p-6">
                Drag insights here
              </div>
            )}
            
            {marketInsightsList.map((insight, index) => (
              <InsightCard 
                key={insight.id} 
                insight={insight} 
                index={index}
                inMergeMode={mergeMode}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Merge Dialog */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Insights</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <textarea
              className="w-full h-32 bg-[#1C1C1C] border border-border rounded-md p-3 text-sm"
              value={mergedText}
              onChange={(e) => setMergedText(e.target.value)}
              placeholder="Enter combined insight text..."
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMerge}>
              Merge Insights
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
