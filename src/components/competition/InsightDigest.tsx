
import React, { useState } from "react";
import { Layers, Trash2, Star, List, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompetition, SecondaryInsight } from "@/providers/CompetitionProvider";
import { toast } from "sonner";

interface InsightCardProps {
  insight: SecondaryInsight;
  isSelected: boolean;
  onToggleSelect: () => void;
  onStar: () => void;
  onDelete: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  insight, 
  isSelected, 
  onToggleSelect,
  onStar,
  onDelete
}) => {
  return (
    <div 
      className={`p-4 mb-2 rounded-md border transition-all ${
        isSelected ? "border-cyan bg-cyan/5" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-2">
        <div>
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded border-muted-foreground/50"
          />
        </div>
        
        <div className="flex-1">
          <p className="text-sm">{insight.text}</p>
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{insight.source}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onStar}
                className={`${
                  insight.starred ? "text-yellow-500" : "text-gray-500"
                } hover:text-yellow-500 transition-colors`}
              >
                <Star className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HeatMapProps {
  insights: SecondaryInsight[];
}

const HeatMap: React.FC<HeatMapProps> = ({ insights }) => {
  // Count insights by category for starred insights only
  const starredInsights = insights.filter(i => i.starred);
  
  const categoryCounts = {
    "ux": starredInsights.filter(i => i.text.toLowerCase().includes("ux") || i.text.toLowerCase().includes("interface")).length,
    "product": starredInsights.filter(i => i.text.toLowerCase().includes("product") || i.text.toLowerCase().includes("feature")).length,
    "growth": starredInsights.filter(i => i.text.toLowerCase().includes("growth") || i.text.toLowerCase().includes("acquisition")).length,
    "brand": starredInsights.filter(i => i.text.toLowerCase().includes("brand") || i.text.toLowerCase().includes("identity")).length
  };
  
  const maxCount = Math.max(...Object.values(categoryCounts), 1);
  
  return (
    <div className="p-4 bg-card border border-border rounded-md">
      <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
        <BarChart3 className="h-4 w-4" />
        Insight Heat Map
      </h3>
      
      <div className="flex space-x-4">
        <div 
          className="w-6 h-24 bg-muted/50 rounded-full overflow-hidden flex flex-col-reverse"
          title={`UX: ${categoryCounts.ux} insights`}
        >
          <div 
            className="bg-blue-500 transition-all"
            style={{ height: `${(categoryCounts.ux / maxCount) * 100}%` }}
          ></div>
          <div className="text-xs text-center mt-1">UX</div>
        </div>
        
        <div 
          className="w-6 h-24 bg-muted/50 rounded-full overflow-hidden flex flex-col-reverse"
          title={`Product: ${categoryCounts.product} insights`}
        >
          <div 
            className="bg-purple-500 transition-all"
            style={{ height: `${(categoryCounts.product / maxCount) * 100}%` }}
          ></div>
          <div className="text-xs text-center mt-1">Prod</div>
        </div>
        
        <div 
          className="w-6 h-24 bg-muted/50 rounded-full overflow-hidden flex flex-col-reverse"
          title={`Growth: ${categoryCounts.growth} insights`}
        >
          <div 
            className="bg-green-500 transition-all"
            style={{ height: `${(categoryCounts.growth / maxCount) * 100}%` }}
          ></div>
          <div className="text-xs text-center mt-1">Grow</div>
        </div>
        
        <div 
          className="w-6 h-24 bg-muted/50 rounded-full overflow-hidden flex flex-col-reverse"
          title={`Brand: ${categoryCounts.brand} insights`}
        >
          <div 
            className="bg-amber-500 transition-all"
            style={{ height: `${(categoryCounts.brand / maxCount) * 100}%` }}
          ></div>
          <div className="text-xs text-center mt-1">Brand</div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-center text-muted-foreground">
        {starredInsights.length} starred insights
      </div>
    </div>
  );
};

export const InsightDigest: React.FC = () => {
  const { 
    secondaryInsights, 
    starInsight, 
    deleteInsight,
    mergeInsights
  } = useCompetition();
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
  const [activePool, setActivePool] = useState<"secondary" | "primary">("secondary");
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");
  
  const toggleInsightSelection = (id: string) => {
    setSelectedInsights(prev => 
      prev.includes(id) 
        ? prev.filter(insightId => insightId !== id) 
        : [...prev, id]
    );
  };
  
  const handleMergeSelected = () => {
    if (selectedInsights.length < 2) {
      toast.error("Select at least 2 insights to merge");
      return;
    }
    
    // Get the selected insights
    const toMerge = selectedInsights.map(id => 
      secondaryInsights.find(insight => insight.id === id)
    ).filter(Boolean);
    
    // Create a merged text
    const mergedText = `Combined insight from ${toMerge.length} sources: ${toMerge.map(i => i?.text.substring(0, 30) + "...").join(" + ")}`;
    
    // Merge the insights
    mergeInsights(selectedInsights, mergedText);
    
    // Clear selection
    setSelectedInsights([]);
    
    toast.success(`${selectedInsights.length} insights merged`);
  };
  
  const handleStarSelected = () => {
    if (selectedInsights.length === 0) return;
    
    // Star all selected insights
    selectedInsights.forEach(id => starInsight(id, true));
    
    toast.success(`${selectedInsights.length} insights starred`);
  };
  
  const handleDeleteSelected = () => {
    if (selectedInsights.length === 0) return;
    
    selectedInsights.forEach(id => deleteInsight(id));
    setSelectedInsights([]);
    
    toast.success(`${selectedInsights.length} insights deleted`);
  };
  
  const sortedInsights = [...secondaryInsights].sort((a, b) => {
    // Sort by starred first, then by recency
    if (a.starred && !b.starred) return -1;
    if (!a.starred && b.starred) return 1;
    
    // If both are starred or both are not starred, sort by timestamp
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Insight Digest</h2>
        <p className="text-muted-foreground">
          Review and refine your competitive insights before publishing.
        </p>
      </div>
      
      {/* Pool tabs */}
      <div className="flex items-center border-b border-border/60 mb-6">
        <button 
          className={`px-4 py-3 ${
            activePool === 'secondary' 
              ? 'border-b-2 border-cyan text-foreground' 
              : 'text-muted-foreground'
          }`}
          onClick={() => setActivePool("secondary")}
        >
          Secondary Pool
        </button>
        <button 
          className={`px-4 py-3 ${
            activePool === 'primary' 
              ? 'border-b-2 border-cyan text-foreground' 
              : 'text-muted-foreground'
          }`}
          onClick={() => setActivePool("primary")}
        >
          Primary Pool
        </button>
        
        <div className="ml-auto flex">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${viewMode === 'list' ? 'bg-muted' : ''}`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${viewMode === 'chart' ? 'bg-muted' : ''}`}
            onClick={() => setViewMode("chart")}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex gap-8">
        <div className="flex-1">
          {activePool === "secondary" ? (
            <div>
              {/* Bulk actions */}
              {selectedInsights.length > 0 && (
                <div className="mb-4 p-3 bg-secondary/20 rounded-md flex gap-2">
                  <Button 
                    size="sm" 
                    variant="default"
                    className="flex-1 gap-1"
                    onClick={handleMergeSelected}
                    disabled={selectedInsights.length < 2}
                  >
                    <Layers className="h-3 w-3" />
                    Merge ({selectedInsights.length})
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="flex-1 gap-1"
                    onClick={handleStarSelected}
                  >
                    <Star className="h-3 w-3" />
                    Star
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    className="flex-1 gap-1"
                    onClick={handleDeleteSelected}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              )}
              
              {viewMode === "list" ? (
                // List view
                <div className="space-y-2">
                  {sortedInsights.map(insight => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      isSelected={selectedInsights.includes(insight.id)}
                      onToggleSelect={() => toggleInsightSelection(insight.id)}
                      onStar={() => starInsight(insight.id, !insight.starred)}
                      onDelete={() => deleteInsight(insight.id)}
                    />
                  ))}
                  
                  {sortedInsights.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No insights in your secondary pool.</p>
                    </div>
                  )}
                </div>
              ) : (
                // Chart view - shown when in chart mode
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-3">Insights by Source</h3>
                    <div className="h-[200px] flex items-end gap-2">
                      <div className="flex-1 bg-blue-500/90 h-[70%]">
                        <div className="text-xs text-white p-1">Competitors</div>
                      </div>
                      <div className="flex-1 bg-green-500/90 h-[40%]">
                        <div className="text-xs text-white p-1">Takeaways</div>
                      </div>
                      <div className="flex-1 bg-amber-500/90 h-[60%]">
                        <div className="text-xs text-white p-1">Trends</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card border border-border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-3">Top Insights</h3>
                    <div className="space-y-2">
                      {sortedInsights
                        .filter(i => i.starred)
                        .slice(0, 3)
                        .map(insight => (
                          <div key={insight.id} className="text-xs p-2 bg-muted/50 rounded">
                            {insight.text.substring(0, 40)}...
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Primary pool view (read-only)
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Primary insights are read-only and can be viewed in the Audience module.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActivePool("secondary")}
              >
                Switch to Secondary Pool
              </Button>
            </div>
          )}
        </div>
        
        {/* Right sidebar with heatmap */}
        <div className="w-[240px]">
          <HeatMap insights={secondaryInsights} />
        </div>
      </div>
    </div>
  );
};
