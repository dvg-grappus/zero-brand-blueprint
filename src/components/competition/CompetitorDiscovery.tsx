
import React, { useState } from "react";
import { Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompetition } from "@/providers/CompetitionProvider";
import { CompetitorCard } from "./discovery/CompetitorCard";
import { CompetitorSearchModal } from "./discovery/CompetitorSearchModal";
import { PriorityWeightingSlider } from "./discovery/PriorityWeightingSlider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const CompetitorDiscovery: React.FC = () => {
  const { 
    competitors, 
    selectedCompetitors, 
    toggleSelectCompetitor,
    updateCompetitorPriority
  } = useCompetition();
  
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  
  const categories = [
    {
      id: "direct",
      title: "Direct Competitors",
      description: "Companies offering similar core solutions",
      competitors: competitors.filter(c => ["1", "2", "3", "4", "5", "6"].includes(c.id))
    },
    {
      id: "niche",
      title: "Niche Players",
      description: "Specialized solutions for specific segments",
      competitors: competitors.filter(c => ["7", "8", "9", "10", "11", "12"].includes(c.id))
    },
    {
      id: "adjacent",
      title: "Adjacent Players",
      description: "Companies in related markets",
      competitors: competitors.filter(c => ["13", "14", "15", "16", "17", "18"].includes(c.id))
    },
    {
      id: "emerging",
      title: "Emerging Threats",
      description: "New entrants and potential disruptors",
      competitors: competitors.filter(c => ["19", "20", "21", "22", "23", "24"].includes(c.id))
    }
  ];

  const handleCompetitorSelect = (competitor: any) => {
    toggleSelectCompetitor(competitor.id);
    setSelectedCompetitorId(prevId => prevId === competitor.id ? null : competitor.id);
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
          {/* Add competitors button */}
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsSearchModalOpen(true)}
              className="gap-1 bg-cyan/10 border-cyan/40 text-cyan hover:bg-cyan/20 hover:text-foreground"
            >
              <Plus className="h-3 w-3" />
              New query
            </Button>
          </div>
          
          {/* Vertical trays */}
          <div className="space-y-10">
            {categories.map((category) => (
              <section key={category.id} className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.competitors.length} competitors
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {category.competitors.map(competitor => (
                    <CompetitorCard 
                      key={competitor.id}
                      competitor={competitor}
                      isSelected={selectedCompetitors.includes(competitor.id)}
                      onClick={() => handleCompetitorSelect(competitor)}
                      priorityLevel={competitor.priority}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        
        {/* Priority weighting sidebar with tooltip */}
        <div className="w-12 flex flex-col items-center relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mb-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[200px]">
                <p>Adjust how prominent this competitor should be in your strategy. 
                Higher priority competitors will appear larger on the landscape map.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <PriorityWeightingSlider 
            selectedCompetitor={selectedCompetitorId} 
            currentPriority={selectedCompetitorId ? 
              competitors.find(c => c.id === selectedCompetitorId)?.priority || 5 
              : 5
            }
            onPriorityChange={(priority) => {
              if (selectedCompetitorId) {
                updateCompetitorPriority(selectedCompetitorId, priority);
              }
            }}
          />
        </div>
      </div>
      
      {/* Search modal */}
      <CompetitorSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};
