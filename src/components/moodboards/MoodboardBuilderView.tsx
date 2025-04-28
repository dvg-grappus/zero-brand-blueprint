
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
  const [imageError, setImageError] = useState(false);
  
  const { width, height, category, imageUrl } = tile;
  
  const tileStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    marginBottom: '16px'
  };
  
  const getRealImageUrl = (): string => {
    const getRandomImage = (category: string): string => {
      // Make sure we have valid image maps here with fallbacks
      const imageMap: Record<string, string[]> = {
        'BACKGROUND STYLE': [
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
          'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
          'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3'
        ],
        'TYPOGRAPHY': [
          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
          'https://images.unsplash.com/photo-1493962853295-0fd70327578a',
          'https://images.unsplash.com/photo-1498936178812-4b2e558d2937'
        ],
        'LAYOUT': [
          'https://images.unsplash.com/photo-1481487196290-c152efe083f5',
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
          'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa'
        ],
        'ICON/ILLUSTRATION': [
          'https://images.unsplash.com/photo-1613665813446-82a78c468a1d',
          'https://images.unsplash.com/photo-1558655146-d09347e92766',
          'https://images.unsplash.com/photo-1611162616475-46b635cb6868'
        ],
        'PHOTO TREATMENT': [
          'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
          'https://images.unsplash.com/photo-1549388604-817d15aa0110',
          'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e'
        ],
        'TEXTURE': [
          'https://images.unsplash.com/photo-1493397212122-2b85dda8106b',
          'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1',
          'https://images.unsplash.com/photo-1520333789090-1afc82db536a'
        ],
        'COLOR SWATCH': [
          'https://images.unsplash.com/photo-1589365278144-c9e705f843ba',
          'https://images.unsplash.com/photo-1541140134513-85a161dc4a00',
          'https://images.unsplash.com/photo-1513346940221-6f673d962e97'
        ],
        'MOTION REF': [
          'https://images.unsplash.com/photo-1500673922987-e212871fec22',
          'https://images.unsplash.com/photo-1543857778-c4a1a9e0615f',
          'https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb'
        ],
        'PRINT COLLATERAL': [
          'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3',
          'https://images.unsplash.com/photo-1544516229-5150a1bbc973',
          'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111'
        ],
        'ENVIRONMENT': [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
          'https://images.unsplash.com/photo-1511884642898-4c92249e20b6',
          'https://images.unsplash.com/photo-1506259091721-347e791bab0f'
        ],
        'WILD CARD': [
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
          'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f'
        ]
      };

      // Default images as fallback
      const defaultImages = [
        'https://images.unsplash.com/photo-1518770660439-4636190af475',
        'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb',
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131'
      ];

      const images = imageMap[category] || defaultImages;
      const randomIndex = Math.floor(Math.random() * images.length);
      const baseUrl = images[randomIndex];
      
      // Add a unique identifier to prevent caching issues and ensure different images load
      return `${baseUrl}?q=80&w=${width}&h=${height}&auto=format&fit=crop&unique=${tile.id}-${Math.random().toString(36).substring(7)}`;
    };

    return imageUrl || getRandomImage(tile.category);
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
        <img
          src={getRealImageUrl()}
          alt={`${category} image`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      
      <div className="absolute top-2 left-2 bg-[#262626]/80 backdrop-blur-sm text-[10px] uppercase px-2 py-1 rounded font-medium">
        {category}
      </div>
      
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
