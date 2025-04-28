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
      className={`w-full h-[300px] rounded-lg relative overflow-hidden mb-6 ${
        selected ? 'border-2 border-cyan' : 'border border-border/30'
      }`}
    >
      <div className="absolute top-4 left-4 bg-[#262626]/80 px-3 py-1 rounded text-sm backdrop-blur-sm z-10">
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
          <h2 className="text-[48px] leading-[1.1] font-bold">{title}</h2>
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
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1"></div>
          <div className="col-span-1">
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="col-span-1"></div>
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
                <img 
                  src={getThumbnailImage(idx)}
                  alt={thumbnail}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://source.unsplash.com/random/180x120/?technology";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const getThumbnailImage = (index: number): string => {
  const thumbnailImages = [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=180&h=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=180&h=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=180&h=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=180&h=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=180&h=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=180&h=120&auto=format&fit=crop"
  ];
  
  return thumbnailImages[index % thumbnailImages.length];
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
  
  const enhanceDirectionDescriptions = () => {
    return directions.map(dir => {
      if (dir.title.startsWith("Direction ")) {
        const uniqueTitles = [
          "Digital Horizon", 
          "Refined Elegance", 
          "Future Forward", 
          "Cosmic Vision", 
          "Bold Frontiers", 
          "Pristine Clarity"
        ];
        
        const richDescriptions = [
          "Think limitless possibilities. Think creative thinking. Picture a world where digital meets physical, where each interaction feels effortless yet profound.",
          "Envision a space where minimalism isn't just aesthetic—it's purposeful. Clean lines and thoughtful design create breathing room for ideas to flourish.",
          "The future isn't static; it's dynamic. This direction embraces motion, transformation, and the constant evolution of technology and human experience.",
          "Imagine depth and dimension that transcend the ordinary. Like a perfect galaxy viewed through the clearest lens, every element has meaning and purpose.",
          "Boldness isn't just about color—it's about conviction. This direction doesn't whisper, it speaks with authority through deliberate choices and contrasts.",
          "Clarity comes from restraint. This direction strips away the unnecessary to reveal what truly matters, creating moments of perfect understanding."
        ];
        
        const index = parseInt(dir.id.replace("dir-", "")) % uniqueTitles.length;
        
        return {
          ...dir,
          title: uniqueTitles[index],
          description: richDescriptions[index]
        };
      }
      return dir;
    });
  };
  
  const enhancedDirections = enhanceDirectionDescriptions();
  
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
      
      <div className="flex-1 overflow-y-auto px-10">
        <AnimatePresence>
          {enhancedDirections.map(direction => (
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
