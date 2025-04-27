
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Competitor } from '@/providers/CompetitionProvider';

interface CompetitorCardProps {
  competitor: Competitor;
  isSelected: boolean;
  onClick: () => void;
  priorityLevel: number;
}

export const CompetitorCard: React.FC<CompetitorCardProps> = ({ 
  competitor, 
  isSelected, 
  onClick,
  priorityLevel
}) => {
  return (
    <motion.div
      className={`group w-full h-[120px] rounded-lg bg-muted/50 border cursor-pointer transition-all overflow-hidden relative ${
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
