
import React, { useState, useEffect } from 'react';
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

// Create a large repository of unique images
const imageRepository = {
  'BACKGROUND STYLE': [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e'
  ],
  'TYPOGRAPHY': [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    'https://images.unsplash.com/photo-1493962853295-0fd70327578a',
    'https://images.unsplash.com/photo-1498936178812-4b2e558d2937',
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742',
    'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3'
  ],
  'LAYOUT': [
    'https://images.unsplash.com/photo-1481487196290-c152efe083f5',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5',
    'https://images.unsplash.com/photo-1523726491678-bf852e717f6a'
  ],
  'ICON/ILLUSTRATION': [
    'https://images.unsplash.com/photo-1613665813446-82a78c468a1d',
    'https://images.unsplash.com/photo-1558655146-d09347e92766',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b',
    'https://images.unsplash.com/photo-1624996379697-f01d168b1a52'
  ],
  'PHOTO TREATMENT': [
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e',
    'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7',
    'https://images.unsplash.com/photo-1516962126636-27bf1c5b898f'
  ],
  'TEXTURE': [
    'https://images.unsplash.com/photo-1493397212122-2b85dda8106b',
    'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1',
    'https://images.unsplash.com/photo-1520333789090-1afc82db536a',
    'https://images.unsplash.com/photo-1604147706283-d7119b5b822c',
    'https://images.unsplash.com/photo-1556139902-7367723b433e'
  ],
  'COLOR SWATCH': [
    'https://images.unsplash.com/photo-1589365278144-c9e705f843ba',
    'https://images.unsplash.com/photo-1541140134513-85a161dc4a00',
    'https://images.unsplash.com/photo-1513346940221-6f673d962e97',
    'https://images.unsplash.com/photo-1507908708918-778587c9e563',
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17'
  ],
  'MOTION REF': [
    'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    'https://images.unsplash.com/photo-1543857778-c4a1a9e0615f',
    'https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb',
    'https://images.unsplash.com/photo-1600758208050-a22f17dc5bb9',
    'https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b'
  ],
  'PRINT COLLATERAL': [
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3',
    'https://images.unsplash.com/photo-1544516229-5150a1bbc973',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111',
    'https://images.unsplash.com/photo-1506784926709-22f1ec395907',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc'
  ],
  'ENVIRONMENT': [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1511884642898-4c92249e20b6',
    'https://images.unsplash.com/photo-1506259091721-347e791bab0f',
    'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df'
  ],
  'WILD CARD': [
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    'https://images.unsplash.com/photo-1512641406448-6574e777bec6',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb'
  ],
};

interface MoodboardPreviewProps {
  id: string;
  title: string;
  tiles: MoodboardTile[];
  isSelected: boolean;
  onSelect: () => void;
  onMagnify: () => void;
  onOpenAI: () => void;
}

const MoodboardPreviewTile: React.FC<{ category: string, tileIndex: number, boardIndex: number }> = ({ 
  category, 
  tileIndex,
  boardIndex 
}) => {
  // Use the boardIndex to ensure different boards get different images
  const getImageUrl = (): string => {
    const images = imageRepository[category as keyof typeof imageRepository] || [
      'https://source.unsplash.com/random/110x70/?tech'
    ];
    
    // Get a deterministic but different image for each board and tile
    const imageIndex = (boardIndex + tileIndex) % images.length;
    const baseUrl = images[imageIndex];
    
    // Add unique parameter to prevent caching
    return `${baseUrl}?q=80&w=110&h=70&auto=format&fit=crop&unique=board${boardIndex}-tile${tileIndex}`;
  };
  
  return (
    <div className="w-full aspect-square bg-card/30 rounded overflow-hidden text-[8px] text-center">
      <img 
        src={getImageUrl()}
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
  // Extract board index from ID for image variety
  const boardIndex = parseInt(id.replace(/\D/g, '')) || 0;
  
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
              boardIndex={boardIndex}
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
  boardIndex: number;
}

const ZoomedImage: React.FC<ZoomedImageProps> = ({ category, index, boardIndex }) => {
  const getImageUrl = (): string => {
    const catKey = category as keyof typeof imageRepository;
    const images = imageRepository[catKey] || [
      'https://source.unsplash.com/random/300x300/?tech'
    ];
    
    // Use a combination of board index and tile index to get a unique image
    const imageIndex = (boardIndex * 10 + index) % images.length;
    const baseUrl = images[imageIndex];
    
    // Add unique parameters to prevent caching
    return `${baseUrl}?q=80&w=300&h=300&auto=format&fit=crop&unique=zoom-board${boardIndex}-tile${index}`;
  };

  return (
    <div className="aspect-square bg-card/30 rounded-lg overflow-hidden relative">
      <div className="absolute top-2 left-2 bg-[#262626]/80 backdrop-blur-sm text-[10px] uppercase px-2 py-1 rounded font-medium">
        {category}
      </div>
      <img 
        src={getImageUrl()} 
        alt={category}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&h=300&auto=format&fit=crop";
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
  const zoomedBoardIndex = zoomedMoodboard ? 
    parseInt(zoomedMoodboard.replace(/\D/g, '')) || 0 : 0;
  
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
          {moodboards.map((board, idx) => (
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
                boardIndex={zoomedBoardIndex}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CompareView;
