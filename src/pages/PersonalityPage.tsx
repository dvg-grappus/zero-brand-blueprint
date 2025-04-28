
import React from 'react';
import { useLocation } from 'react-router-dom';
import { PersonalityProvider } from '@/providers/PersonalityProvider';
import AIAssistantPanel from '@/components/personality/AIAssistantPanel';
import BrandArchetype from '@/components/personality/BrandArchetype';
import CharacterKeywords from '@/components/personality/CharacterKeywords';
import PersonalitySliders from '@/components/personality/PersonalitySliders';
import XMeetsY from '@/components/personality/XMeetsY';
import DichotomyNots from '@/components/personality/DichotomyNots';
import TimelineTopBar from '@/components/TimelineTopBar';

const PersonalityPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Determine which component to render based on the current path
  const renderContent = () => {
    switch (path) {
      case '/step/4/archetype':
        return <BrandArchetype />;
      case '/step/4/keywords':
        return <CharacterKeywords />;
      case '/step/4/sliders':
        return <PersonalitySliders />;
      case '/step/4/x-meets-y':
        return <XMeetsY />;
      case '/step/4/dichotomy':
        return <DichotomyNots />;
      default:
        return <BrandArchetype />;
    }
  };

  return (
    <PersonalityProvider>
      <div className="min-h-screen bg-[#1B1B1B] text-foreground">
        <TimelineTopBar currentStep={4} completedSteps={[1, 2, 3]} />
        
        <div className="pt-[88px] flex min-h-[calc(100vh-88px)]">
          <div className="flex-1 pb-10">
            {renderContent()}
          </div>
          
          <div className="w-[320px]">
            <AIAssistantPanel />
          </div>
        </div>
      </div>
    </PersonalityProvider>
  );
};

export default PersonalityPage;
