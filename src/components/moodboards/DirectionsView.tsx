
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Trash2, Check, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useMoodboards } from '@/contexts/MoodboardsContext';
import { TalkToAIButton } from './FloatingAIPanel';

interface DirectionCardProps {
  id: string;
  title: string;
  tags: string[];
  description: string;
  relevance: number;
  thumbnails: string[];
  selected: boolean;
  onSelect: (id: string) => void;
  onReplace: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenAI: (context: string) => void;
}

const DirectionCard: React.FC<DirectionCardProps> = ({
  id,
  title,
  tags,
  description,
  relevance,
  thumbnails,
  selected,
  onSelect,
  onReplace,
  onDelete,
  onOpenAI
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`w-full h-[260px] rounded-lg relative overflow-hidden mb-6 ${
        selected ? 'border-2 border-cyan' : 'border border-border/30'
      }`}
    >
      <div className="absolute top-4 left-4 bg-[#262626]/80 px-3 py-1 rounded text-sm backdrop-blur-sm">
        Relevance {relevance}%
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(id)}
          className={`h-6 w-6 ${selected ? 'border-cyan data-[state=checked]:bg-cyan data-[state=checked]:text-black' : 'border-muted-foreground'}`}
        />
      </div>
      
      <div className="p-6 flex flex-col h-full">
        <div className="mb-2">
          <h2 className="text-[48px] leading-none font-bold">{title}</h2>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="text-xs uppercase bg-[#303030] py-1 px-3 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-0">
          <div className="col-start-2">
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        
        <div className="mt-auto flex justify-between items-end">
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-xs"
              onClick={() => onReplace(id)}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Replace
            </Button>
            
            <TalkToAIButton onClick={() => onOpenAI(`Direction: ${title}`)} />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-xs text-destructive hover:text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
          
          <div className="flex space-x-2">
            {thumbnails.slice(0, 3).map((thumbnail, idx) => (
              <div 
                key={idx}
                className="h-[120px] w-[180px] bg-muted rounded overflow-hidden"
              >
                <div className="h-full w-full flex items-center justify-center text-xs text-center p-2 text-muted-foreground">
                  {thumbnail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface DirectionsViewProps {
  onOpenAI: (context: string, prompts?: string[]) => void;
}

const DirectionsView: React.FC<DirectionsViewProps> = ({ onOpenAI }) => {
  const navigate = useNavigate();
  const { 
    directions, 
    toggleDirectionSelection, 
    replaceDirection,
    deleteDirection,
    generateMoreDirections,
    selectedDirections
  } = useMoodboards();
  
  const handleOpenAI = (context: string) => {
    onOpenAI(context, [
      "Refine this direction with more personality",
      "Suggest alternative tags for this concept",
      "Make this more innovative and less generic"
    ]);
  };
  
  const handleNavigateToMoodboards = () => {
    if (selectedDirections.length !== 3) {
      return;
    }
    navigate('/step/5/moodboards');
  };
  
  return (
    <div className="min-h-[calc(100vh-88px)] flex flex-col p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 px-10">
        <motion.h1
          className="text-[32px] font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Brand Directions
        </motion.h1>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            Selected <span className="text-cyan">{selectedDirections.length}/3</span>
          </div>
          
          <Button
            onClick={() => generateMoreDirections(2)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Generate more
          </Button>
          
          <Button 
            onClick={handleNavigateToMoodboards}
            disabled={selectedDirections.length !== 3}
            className="bg-cyan text-black hover:bg-cyan/90"
          >
            Next → Moodboards
          </Button>
        </div>
      </div>
      
      {/* Direction cards */}
      <div className="flex-1 overflow-y-auto px-10">
        <AnimatePresence>
          {directions.map(direction => (
            <DirectionCard
              key={direction.id}
              id={direction.id}
              title={direction.title}
              tags={direction.tags}
              description={direction.description}
              relevance={direction.relevance}
              thumbnails={direction.thumbnails}
              selected={direction.selected}
              onSelect={toggleDirectionSelection}
              onReplace={replaceDirection}
              onDelete={deleteDirection}
              onOpenAI={handleOpenAI}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Plus = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default DirectionsView;
