
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePersonality } from '@/providers/PersonalityProvider';

interface PersonalitySummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PersonalitySummaryDialog: React.FC<PersonalitySummaryDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const {
    archetypes,
    blendedArchetypes,
    keywords,
    sliders,
    combination,
    dichotomy,
    completeModule
  } = usePersonality();

  const selectedKeywords = keywords.filter(k => k.selected).map(k => k.name);
  
  const handlePublishAndExit = () => {
    completeModule();
    navigate('/timeline');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">Brand Personality Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Archetype Section */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-cyan">Archetype Blend</h3>
            <div className="bg-card/50 p-4 rounded-lg space-y-2">
              {blendedArchetypes.map((archetype) => (
                <div key={archetype.name} className="flex items-center justify-between">
                  <span>{archetype.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan" 
                        style={{ width: `${archetype.blendAmount}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {archetype.blendAmount}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Keywords Section */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-cyan">Character Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {selectedKeywords.map((keyword) => (
                <span 
                  key={keyword}
                  className="px-3 py-1 bg-cyan/10 text-cyan rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          {/* Personality Dimensions */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-cyan">Personality Dimensions</h3>
            <div className="space-y-4">
              {sliders.map((slider) => (
                <div key={slider.axis} className="space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{slider.leftBrand}</span>
                    <span>{slider.rightBrand}</span>
                  </div>
                  <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan" 
                      style={{ width: `${(slider.value / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">{slider.axis}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Brand Fusion */}
          {combination.brandA && combination.brandB && (
            <section>
              <h3 className="text-lg font-semibold mb-3 text-cyan">Brand DNA Fusion</h3>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-lg font-medium mb-2">
                  {combination.brandA.name} × {combination.brandB.name}
                </p>
                <p className="text-muted-foreground">
                  {combination.summary || "A unique fusion of brand characteristics"}
                </p>
              </div>
            </section>
          )}

          {/* Dichotomy Statement */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-cyan">Brand Boundaries</h3>
            <div className="bg-card/50 p-4 rounded-lg">
              <p className="text-lg">
                We are <span className="font-medium">{dichotomy.wordOne}</span> and{" "}
                <span className="font-medium">{dichotomy.wordTwo}</span>, but not{" "}
                <span className="font-medium">{dichotomy.notWordOne}</span> and not{" "}
                <span className="font-medium">{dichotomy.notWordTwo}</span>.
              </p>
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Back to Edit
          </Button>
          <Button 
            className="bg-cyan text-black hover:bg-cyan/80"
            onClick={handlePublishAndExit}
          >
            Publish and Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalitySummaryDialog;
