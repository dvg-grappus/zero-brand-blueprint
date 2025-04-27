
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, ExternalLink, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCompetition, Competitor } from "@/providers/CompetitionProvider";
import { toast } from "sonner";

interface CompetitorCardProps {
  competitor: Competitor;
  isSelected: boolean;
  onClick: () => void;
  onPreview: () => void;
  priorityLevel: number;
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({ 
  competitor, 
  isSelected, 
  onClick,
  onPreview,
  priorityLevel
}) => {
  return (
    <motion.div
      className={`group w-[200px] h-[120px] rounded-lg bg-muted/50 border cursor-pointer transition-all overflow-hidden relative ${
        isSelected ? 'border-cyan' : 'border-border hover:border-border/80'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        boxShadow: isSelected ? `0 0 ${priorityLevel}px ${priorityLevel / 2}px rgba(0, 200, 255, ${priorityLevel / 20})` : 'none'
      }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-secondary rounded flex-shrink-0"></div>
          <h3 className="font-medium text-foreground truncate">{competitor.name}</h3>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {competitor.tags.slice(0, 3).map((tag, i) => (
            <span 
              key={i} 
              className="px-1.5 py-0.5 text-xs bg-secondary/60 rounded text-secondary-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div 
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
      >
        <Button 
          variant="secondary" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
};

interface PrioritySliderProps {
  selectedCompetitor: string | null;
  onPriorityChange: (priority: number) => void;
  currentPriority: number;
}

const PrioritySlider: React.FC<PrioritySliderProps> = ({ 
  selectedCompetitor, 
  onPriorityChange,
  currentPriority
}) => {
  // If no competitor is selected, show disabled state
  if (!selectedCompetitor) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm text-muted-foreground mb-2">Priority weighting</div>
        <div className="h-[200px] w-2 rounded-full bg-muted/50 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[0%] rounded-full bg-muted/30"></div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">Select a competitor</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-foreground mb-2">Priority weighting</div>
      <div className="h-[200px] w-2 rounded-full bg-muted/50 relative">
        <div 
          className="absolute bottom-0 left-0 right-0 rounded-full bg-cyan transition-all"
          style={{ 
            height: `${currentPriority * 10}%`,
          }}
        ></div>
        
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={currentPriority}
          onChange={(e) => onPriorityChange(parseInt(e.target.value))}
          className="absolute left-0 bottom-0 appearance-none w-[30px] h-[200px] rounded-full bg-transparent cursor-pointer -rotate-90 origin-bottom-left translate-y-[15px] translate-x-[-100px]"
          style={{
            WebkitAppearance: 'none',
            background: 'transparent',
          }}
        />
      </div>
      <div className="text-sm text-foreground mt-2">{currentPriority}</div>
    </div>
  );
};

interface CompetitorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompetitors: (competitors: Competitor[]) => void;
}

const CompetitorSearchModal: React.FC<CompetitorSearchModalProps> = ({ 
  isOpen, 
  onClose,
  onAddCompetitors 
}) => {
  const [query, setQuery] = useState("Find recently funded mobility startups in Australia.");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Competitor[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate search results
    setTimeout(() => {
      const mockResults: Competitor[] = [
        {
          id: "new-1",
          name: "EduConnect",
          logo: "/placeholder.svg",
          tags: ["Startup", "Recently funded", "Mobile-first"],
          type: "startup",
          alexaRank: "245,670",
          fundingStage: "Seed",
          priority: 5,
          website: "https://www.educonnect.io"
        },
        {
          id: "new-2",
          name: "TeachSmart",
          logo: "/placeholder.svg",
          tags: ["Startup", "Bootstrapped", "SaaS"],
          type: "startup",
          alexaRank: "312,450",
          fundingStage: "Bootstrapped",
          priority: 5,
          website: "https://www.teachsmart.com"
        },
        {
          id: "new-3",
          name: "LearnWave",
          logo: "/placeholder.svg",
          tags: ["Startup", "Recently funded", "Community-led"],
          type: "startup",
          alexaRank: "187,900",
          fundingStage: "Series A",
          priority: 5,
          website: "https://www.learnwave.co"
        },
        {
          id: "new-4",
          name: "CareerLift",
          logo: "/placeholder.svg",
          tags: ["Startup", "Marketplace", "Provider"],
          type: "startup",
          alexaRank: "156,300",
          fundingStage: "Seed",
          priority: 5,
          website: "https://www.careerlift.io"
        },
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };
  
  const toggleResultSelection = (id: string) => {
    setSelectedResults(prev => 
      prev.includes(id) 
        ? prev.filter(resultId => resultId !== id) 
        : [...prev, id]
    );
  };
  
  const handleAddSelected = () => {
    const selectedCompetitors = searchResults.filter(comp => 
      selectedResults.includes(comp.id)
    );
    
    if (selectedCompetitors.length === 0) {
      toast.error("Select at least one competitor to add");
      return;
    }
    
    onAddCompetitors(selectedCompetitors);
    onClose();
    
    toast.success(`Added ${selectedCompetitors.length} new competitors`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Find new competitors</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-muted/50 border border-border/50 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder="Search for competitors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
        
        {searchResults.length > 0 && (
          <div className="my-4">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Search Results</h3>
              <div className="text-xs text-muted-foreground">
                {selectedResults.length} of {searchResults.length} selected
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map(result => (
                <div 
                  key={result.id}
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedResults.includes(result.id) 
                      ? "border-cyan bg-cyan/10" 
                      : "border-border"
                  }`}
                  onClick={() => toggleResultSelection(result.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-secondary/60 rounded"></div>
                      <h3 className="font-medium">{result.name}</h3>
                    </div>
                    <div className="h-4 w-4 rounded-full border border-cyan flex items-center justify-center">
                      {selectedResults.includes(result.id) && (
                        <div className="h-2 w-2 rounded-full bg-cyan"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-1.5 py-0.5 text-xs bg-secondary/60 rounded text-secondary-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleAddSelected}
            disabled={selectedResults.length === 0}
          >
            Add Selected ({selectedResults.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const CompetitorDiscovery: React.FC = () => {
  const { 
    competitors, 
    selectedCompetitors, 
    toggleSelectCompetitor,
    updateCompetitorPriority, 
    addCompetitor 
  } = useCompetition();
  
  const [activeTab, setActiveTab] = useState<"direct" | "niche" | "adjacent" | "custom">("direct");
  const [previewCompetitor, setPreviewCompetitor] = useState<Competitor | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  
  // Get current priority of selected competitor
  const currentPriority = selectedCompetitorId
    ? competitors.find(c => c.id === selectedCompetitorId)?.priority || 5
    : 5;
  
  // Filter competitors by tab
  const filteredCompetitors = competitors.filter(competitor => {
    // For demo purposes, just assign competitors to tabs
    if (activeTab === "direct") {
      return ["1", "2", "3", "4"].includes(competitor.id);
    } else if (activeTab === "niche") {
      return ["5", "6", "7", "8"].includes(competitor.id);
    } else if (activeTab === "adjacent") {
      return ["9", "10", "11", "12"].includes(competitor.id);
    } else if (activeTab === "custom") {
      return competitor.id.startsWith("new-");
    }
    return true;
  });
  
  const handleCompetitorClick = (competitor: Competitor) => {
    toggleSelectCompetitor(competitor.id);
    setSelectedCompetitorId(prevId => prevId === competitor.id ? null : competitor.id);
  };
  
  const handlePreviewCompetitor = (competitor: Competitor) => {
    setPreviewCompetitor(competitor);
    setIsPreviewOpen(true);
  };
  
  const handleAddToList = () => {
    if (previewCompetitor && !selectedCompetitors.includes(previewCompetitor.id)) {
      toggleSelectCompetitor(previewCompetitor.id);
      toast.success(`${previewCompetitor.name} added to your list`);
    }
    setIsPreviewOpen(false);
  };
  
  const handlePriorityChange = (priority: number) => {
    if (selectedCompetitorId) {
      updateCompetitorPriority(selectedCompetitorId, priority);
    }
  };
  
  const handleAddCompetitors = (newCompetitors: Competitor[]) => {
    newCompetitors.forEach(comp => {
      addCompetitor(comp);
    });
    
    // Switch to custom tab to show the new competitors
    setActiveTab("custom");
  };

  return (
    <div>
      {/* Hero Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Who else plays in this space?</h1>
        <p className="text-muted-foreground text-lg">Start with auto-suggestions, then hunt further.</p>
      </div>
      
      <div className="flex gap-8">
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex items-center border-b border-border/60 mb-6">
            <button 
              className={`px-4 py-2 ${activeTab === 'direct' ? 'border-b-2 border-cyan text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab("direct")}
            >
              Direct
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'niche' ? 'border-b-2 border-cyan text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab("niche")}
            >
              Niche
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'adjacent' ? 'border-b-2 border-cyan text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab("adjacent")}
            >
              Adjacent
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'custom' ? 'border-b-2 border-cyan text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab("custom")}
            >
              Custom
            </button>
            
            <div className="ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 bg-cyan/10 border-cyan/40 text-cyan hover:bg-cyan/20 hover:text-foreground"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Plus className="h-3 w-3" />
                New query
              </Button>
            </div>
          </div>
          
          {/* Grid of competitors */}
          <div className="grid grid-cols-3 gap-4">
            {filteredCompetitors.map(competitor => (
              <CompetitorCard 
                key={competitor.id}
                competitor={competitor}
                isSelected={selectedCompetitors.includes(competitor.id)}
                onClick={() => handleCompetitorClick(competitor)}
                onPreview={() => handlePreviewCompetitor(competitor)}
                priorityLevel={competitor.priority}
              />
            ))}
            
            {filteredCompetitors.length === 0 && (
              <div className="col-span-3 py-12 text-center">
                <p className="text-muted-foreground mb-4">No competitors in this category.</p>
                
                {activeTab === "custom" && (
                  <Button
                    variant="outline"
                    onClick={() => setIsSearchModalOpen(true)}
                    className="gap-2"
                  >
                    <CirclePlus className="h-4 w-4" />
                    Add custom competitors
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Priority slider */}
        <div className="w-12 flex flex-col items-center">
          <PrioritySlider 
            selectedCompetitor={selectedCompetitorId} 
            onPriorityChange={handlePriorityChange} 
            currentPriority={currentPriority}
          />
        </div>
      </div>
      
      {/* Competitor preview drawer */}
      <Drawer open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DrawerContent className="max-h-[80vh]">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded"></div>
                <div>
                  <h3 className="text-lg font-medium">{previewCompetitor?.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>Alexa: {previewCompetitor?.alexaRank}</div>
                    <div>Stage: {previewCompetitor?.fundingStage}</div>
                  </div>
                </div>
              </div>
            </DrawerHeader>
            
            <div className="p-4 flex flex-col items-center">
              {/* In real app, this would be an iframe of the competitor's website */}
              <div className="w-full h-[240px] bg-muted rounded-lg mb-4 flex items-center justify-center">
                <p className="text-muted-foreground">Website preview would load here</p>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {previewCompetitor?.website}
              </p>
            </div>
            
            <DrawerFooter>
              <div className="flex w-full gap-2">
                <Button 
                  className="flex-1"
                  onClick={handleAddToList}
                  variant={selectedCompetitors.includes(previewCompetitor?.id || "") ? "outline" : "default"}
                >
                  {selectedCompetitors.includes(previewCompetitor?.id || "") 
                    ? "Already added" 
                    : "Add to list"
                  }
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Ignore
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Search modal */}
      <CompetitorSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onAddCompetitors={handleAddCompetitors}
      />
    </div>
  );
};
