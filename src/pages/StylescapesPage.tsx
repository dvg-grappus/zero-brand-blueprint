
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TimelineTopBar from '@/components/TimelineTopBar';
import { Button } from '@/components/ui/button';

const StylescapesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-foreground">
      <TimelineTopBar currentStep={6} completedSteps={[1, 2, 3, 4, 5]} />
      
      <div className="pt-[88px] min-h-[calc(100vh-88px)] flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-8">Stylescape Builder</h1>
        <p className="text-xl mb-12 max-w-2xl text-center">
          Build your stylescapes by combining elements from your selected moodboard.
        </p>
        
        <div className="w-[800px] h-[500px] bg-muted/30 rounded-lg border border-border/20 flex items-center justify-center mb-8">
          <p className="text-muted-foreground text-center">
            Coming soon! Stylescape builder functionality will be available in the next update.
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/timeline')}
          className="bg-cyan text-black hover:bg-cyan/90"
        >
          Back to Timeline
        </Button>
      </div>
    </div>
  );
};

export default StylescapesPage;
