import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMoodboards, MoodboardTile } from '@/contexts/MoodboardsContext';
import { TalkToAIButton } from './FloatingAIPanel';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MoodboardPreviewProps {
  id: string;
  title: string;
  tiles: MoodboardTile[];
  isSelected: boolean;
  onSelect: () => void;
  onMagnify: () => void;
  onOpenAI: () => void;
}

const MoodboardPreviewTile: React.FC<{ category: string, tileIndex: number }> = ({ category, tileIndex }) => {
  const getRealImageUrl = (): string => {
    const imageMap: Record<string, string> = {
      'BACKGROUND STYLE': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=110&h=70&auto=format&fit=crop',
      'TYPOGRAPHY': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=110&h=70&auto=format&fit=crop',
      'LAYOUT': 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?q=80&w=110&h=70&auto=format&fit=crop',
      'ICON/ILLUSTRATION': 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=110&h=70&auto=format&fit=crop',
      'PHOTO TREATMENT': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=110&h=70&auto=format&fit=crop',
      'TEXTURE': 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=110&h=70&auto=format&fit=crop',
      'COLOR SWATCH': 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?q=80&w=110&h=70&auto=format&fit=crop',
      'MOTION REF': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=110&h=70&auto=format&fit=crop',
      'PRINT COLLATERAL': 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=110&h=70&auto=format&fit=crop',
      'ENVIRONMENT': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=110&h=70&auto=format&fit=crop',
      'WILD CARD': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=110&h=70&auto=format&fit=crop',
    };
    
    return imageMap[category] || 'https://source.unsplash.com/random/110x70/?tech';
  };
  
  return (
    <div className="w-full aspect-square bg-card/30 rounded overflow-hidden text-[8px] text-center">
      <img 
        src={getRealImageUrl()}
        alt={category}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://source.unsplash.com/random/110x70/?tech";
        }}
      />
    </div>
  );
};

const MoodboardPreview: React.FC<MoodboardPreviewProps> = ({
  id,
  title,
  tiles,
  isSelected,
  onSelect,
  onMagnify,
  onOpenAI
}) => {
  return (
    <div className="flex flex-col items-center">
      <RadioGroupItem
        value={id}
        id={id}
        className="mb-3 h-6 w-6 data-[state=checked]:bg-cyan data-[state=checked]:text-black"
      />
      <h3 className="font-medium mb-5">{title}</h3>
      
      <div 
        className="w-[340px] h-[510px] overflow-hidden bg-muted/30 border border-border/20 rounded-lg relative group cursor-pointer"
        onClick={onSelect}
      >
        <div className="w-full h-full p-4 grid grid-cols-3 gap-3 content-start">
          {tiles.slice(0, 9).map((tile, idx) => (
            <MoodboardPreviewTile 
              key={idx} 
              category={tile.category}
              tileIndex={idx}
            />
          ))}
        </div>
        
        <div 
          className="absolute inset-0 bg-black/0 opacity-0 group-hover:bg-black/40 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onMagnify();
          }}
        >
          <Button variant="ghost" size="icon" className="bg-white/10">
            <Search className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="absolute bottom-3 left-3">
          <TalkToAIButton onClick={onOpenAI} />
        </div>
      </div>
    </div>
  );
};

interface ZoomedImageProps {
  category: string;
  index: number;
}

const ZoomedImage: React.FC<ZoomedImageProps> = ({ category, index }) => {
  const getRealImageUrl = (): string => {
    const getRandomImage = (category: string, index: number): string => {
      const imageMap: Record<string, string[]> = {
        'BACKGROUND STYLE': [
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
          'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1'
        ],
        'TYPOGRAPHY': [
          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
          'https://images.unsplash.com/photo-1493962853295-0fd70327578a',
          'https://images.unsplash.com/photo-1498936178812-4b2e558d2937'
        ],
        // ... add more categories with unique image arrays
      };

      const images = imageMap[category] || ['https://source.unsplash.com/random/300x300/?tech'];
      const imageIndex = index % images.length;
      const baseUrl = images[imageIndex];
      return `${baseUrl}?q=80&w=300&h=300&auto=format&fit=crop&unique=${category}-${index}`;
    };

    return getRandomImage(category, index);
  };

  return (
    <div className="aspect-square bg-card/30 rounded-lg overflow-hidden relative">
      <div className="absolute top-2 left-2 bg-[#262626]/80 backdrop-blur-sm text-[10px] uppercase px-2 py-1 rounded font-medium">
        {category}
      </div>
      <img 
        src={getRealImageUrl()} 
        alt={category}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://source.unsplash.com/random/300x300/?tech";
        }}
      />
    </div>
  );
};

interface CompareViewProps {
  onOpenAI: (context: string, prompts?: string[]) => void;
}

const CompareView: React.FC<CompareViewProps> = ({ onOpenAI }) => {
  const { moodboards, selectFinalMoodboard, selectedMoodboard, completeModule } = useMoodboards();
  const [zoomedMoodboard, setZoomedMoodboard] = useState<string | null>(null);
  
  const handleOpenAI = (moodboardId: string) => {
    const board = moodboards.find(b => b.id === moodboardId);
    if (board) {
      onOpenAI(`Moodboard: ${board.direction.title}`, [
        "Boost saturation in this board",
        "Remove serif type sample",
        "Add lifestyle photo suggestions"
      ]);
    }
  };
  
  const handleSelectMoodboard = (moodboardId: string) => {
    selectFinalMoodboard(moodboardId);
  };
  
  const handleComplete = () => {
    completeModule();
  };
  
  const zoomedBoard = moodboards.find(board => board.id === zoomedMoodboard);
  
  return (
    <div className="min-h-[calc(100vh-88px)] flex flex-col p-8">
      <div className="flex justify-between items-center mb-12 px-10">
        <motion.h1
          className="text-[32px] font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Compare & Choose
        </motion.h1>
        
        <Button 
          onClick={handleComplete}
          disabled={!selectedMoodboard}
          className="bg-cyan text-black hover:bg-cyan/90"
        >
          Select winner →
        </Button>
      </div>
      
      <div className="flex-1 flex justify-center">
        <RadioGroup 
          value={selectedMoodboard || ""}
          onValueChange={handleSelectMoodboard} 
          className="flex gap-16"
        >
          {moodboards.map(board => (
            <MoodboardPreview
              key={board.id}
              id={board.id}
              title={board.direction.title}
              tiles={board.tiles}
              isSelected={selectedMoodboard === board.id}
              onSelect={() => handleSelectMoodboard(board.id)}
              onMagnify={() => setZoomedMoodboard(board.id)}
              onOpenAI={() => handleOpenAI(board.id)}
            />
          ))}
        </RadioGroup>
      </div>
      
      <Sheet open={!!zoomedMoodboard} onOpenChange={() => setZoomedMoodboard(null)}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader className="mb-4 flex justify-between items-center flex-row">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoomedMoodboard(null)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <SheetTitle className="text-xl font-bold">
              {zoomedBoard?.direction.title}
            </SheetTitle>
            <div className="w-8" />
          </SheetHeader>
          
          <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-[calc(90vh-100px)]">
            {zoomedBoard?.tiles.map((tile, idx) => (
              <ZoomedImage
                key={idx}
                category={tile.category}
                index={idx}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CompareView;
