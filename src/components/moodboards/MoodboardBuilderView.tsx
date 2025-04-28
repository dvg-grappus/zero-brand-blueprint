
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shuffle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMoodboards, MoodboardTile } from '@/contexts/MoodboardsContext';
import { TalkToAIButton } from './FloatingAIPanel';
import Masonry from 'react-masonry-css';

interface MasonryTileProps {
  tile: MoodboardTile;
  onSwap: () => void;
  onDelete: () => void;
  onOpenAI: () => void;
}

const MasonryTile: React.FC<MasonryTileProps> = ({ tile, onSwap, onDelete, onOpenAI }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { width, height, category, imageUrl } = tile;
  
  const tileStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    marginBottom: '16px'
  };
  
  return (
    <motion.div
      className="relative group"
      style={tileStyle}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full rounded-lg overflow-hidden bg-muted/30 border border-border/20">
        {/* Placeholder image with the query text */}
        <div className="w-full h-full flex items-center justify-center text-xs text-center p-4 text-muted-foreground">
          {imageUrl}
        </div>
      </div>
      
      {/* Category badge */}
      <div className="absolute top-2 left-2 bg-[#262626]/80 backdrop-blur-sm text-[10px] uppercase px-2 py-1 rounded font-medium">
        {category}
      </div>
      
      {/* Action overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-lg flex flex-col justify-center items-center"
          >
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={onSwap}
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Swap
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={onDelete}
              >
                <X className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
            
            <div className="mt-2">
              <TalkToAIButton onClick={onOpenAI} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface MoodboardBuilderViewProps {
  onOpenAI: (context: string, prompts?: string[]) => void;
}

const MoodboardBuilderView: React.FC<MoodboardBuilderViewProps> = ({ onOpenAI }) => {
  const navigate = useNavigate();
  const { moodboards, shuffleMoodboard, swapMoodboardTile, removeMoodboardTile } = useMoodboards();
  const [activeMoodboard, setActiveMoodboard] = useState<string | null>(
    moodboards.length > 0 ? moodboards[0].id : null
  );
  
  const currentMoodboard = moodboards.find(board => board.id === activeMoodboard);
  
  const handleTabChange = (value: string) => {
    setActiveMoodboard(value);
  };
  
  const handleShuffleMoodboard = () => {
    if (activeMoodboard) {
      shuffleMoodboard(activeMoodboard);
    }
  };
  
  const handleOpenAI = (category: string) => {
    const prompts = ["Find a more subtle image", "Suggest a different style", "Find something more unique"];
    
    switch (category) {
      case 'TEXTURE':
        onOpenAI('Texture Image', ["Find subtler texture", "More organic pattern", "Tech-inspired texture"]);
        break;
      case 'TYPOGRAPHY':
        onOpenAI('Typography', ["More modern font examples", "Serif typography alternatives", "Tech brand typography"]);
        break;
      case 'COLOR SWATCH':
        onOpenAI('Color Palette', ["Darker color scheme", "Brighter accent colors", "More premium color palette"]);
        break;
      default:
        onOpenAI(`${category} Image`, prompts);
    }
  };
  
  const handleNavigateToCompare = () => {
    navigate('/step/5/compare');
  };
  
  return (
    <div className="min-h-[calc(100vh-88px)] flex flex-col p-8">
      {/* Tabs navigation */}
      <div className="flex justify-between items-center mb-8 px-10">
        <Tabs
          value={activeMoodboard || ''}
          onValueChange={handleTabChange}
          className="w-auto"
        >
          <TabsList>
            {moodboards.map(board => (
              <TabsTrigger
                key={board.id}
                value={board.id}
                className="px-5 data-[state=active]:bg-cyan data-[state=active]:text-black"
              >
                {board.direction.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShuffleMoodboard}
          >
            <Shuffle className="h-4 w-4" />
            Shuffle board
          </Button>
          
          <Button 
            onClick={handleNavigateToCompare}
            className="bg-cyan text-black hover:bg-cyan/90"
          >
            Compare boards →
          </Button>
        </div>
      </div>
      
      {/* Moodboard masonry grid */}
      <div className="flex-1 overflow-y-auto px-10">
        {currentMoodboard && (
          <Masonry
            breakpointCols={{
              default: 4,
              1200: 3,
              900: 2,
              500: 1
            }}
            className="flex w-auto -ml-4"
            columnClassName="pl-4"
          >
            {currentMoodboard.tiles.map(tile => (
              <MasonryTile
                key={tile.id}
                tile={tile}
                onSwap={() => swapMoodboardTile(
                  currentMoodboard.id,
                  tile.id,
                  `New ${tile.category.toLowerCase()} image`
                )}
                onDelete={() => removeMoodboardTile(currentMoodboard.id, tile.id)}
                onOpenAI={() => handleOpenAI(tile.category)}
              />
            ))}
          </Masonry>
        )}
        
        {!currentMoodboard && (
          <div className="flex justify-center items-center h-[300px] text-muted-foreground">
            No moodboard selected. Please select 3 directions first.
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodboardBuilderView;
