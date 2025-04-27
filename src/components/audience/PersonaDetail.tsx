
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAudience } from "@/providers/AudienceProvider";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PersonaDetailProps {
  personaId?: string;
  onBack: () => void;
}

const PersonaDetail: React.FC<PersonaDetailProps> = ({ personaId, onBack }) => {
  const { personas, addInsight } = useAudience();
  const [activeAccordion, setActiveAccordion] = useState<string>("goals");
  
  const persona = personas.find(p => p.id === personaId);
  
  if (!persona) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl">Persona not found</h2>
        <Button onClick={onBack} className="mt-4">
          Back to gallery
        </Button>
      </div>
    );
  }
  
  const captureInsight = (text: string) => {
    addInsight(text, `Persona: ${persona.name}`, true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-16"
    >
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1" 
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back to gallery
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            // This would trigger chat simulation in production
            console.log("onPersonaTalk", persona.id, "Start simulation");
          }}
        >
          Start simulation with {persona.name}
        </Button>
      </div>
      
      <div className="flex gap-8">
        {/* Main content (left column) */}
        <div className="w-[68%]">
          {/* Hero cover */}
          <div className="w-full h-[320px] rounded-lg overflow-hidden mb-8">
            <img 
              src={persona.image} 
              alt={persona.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Story section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Story</h3>
            <p className="text-muted-foreground">{persona.story}</p>
          </div>
          
          {/* Quote block */}
          <div className="border-l-4 border-cyan pl-4 mb-8">
            <p className="text-lg italic">"{persona.quote}"</p>
            <p className="text-sm text-muted-foreground mt-2">— {persona.name}</p>
          </div>
          
          {/* Journey timeline */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">Journey</h3>
            
            <div className="relative flex justify-between">
              {/* Timeline line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-muted"></div>
              
              {/* Timeline nodes */}
              <TimelineNode 
                label="Discover" 
                text={persona.journey.discover}
                onCapture={() => captureInsight(persona.journey.discover)}
              />
              
              <TimelineNode 
                label="Decide" 
                text={persona.journey.decide}
                onCapture={() => captureInsight(persona.journey.decide)}
              />
              
              <TimelineNode 
                label="First Use" 
                text={persona.journey.firstUse}
                onCapture={() => captureInsight(persona.journey.firstUse)}
              />
              
              <TimelineNode 
                label="Habit" 
                text={persona.journey.habit}
                onCapture={() => captureInsight(persona.journey.habit)}
              />
              
              <TimelineNode 
                label="Advocate" 
                text={persona.journey.advocate}
                onCapture={() => captureInsight(persona.journey.advocate)}
              />
            </div>
          </div>
        </div>
        
        {/* Sidebar (right column) */}
        <div className="w-[28%] sticky top-24">
          {/* Accordion sections */}
          <Accordion
            type="single"
            collapsible
            value={activeAccordion}
            onValueChange={setActiveAccordion}
            className="mb-8"
          >
            <AccordionItem value="goals" className="border-b border-border/50">
              <AccordionTrigger className="bg-blue-950/20 hover:bg-blue-950/30 px-3 rounded-t-md">
                <span className="text-blue-400">Goals</span>
              </AccordionTrigger>
              <AccordionContent className="px-3 py-2 bg-blue-950/10">
                <ul className="space-y-3">
                  {persona.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2 group">
                      <span className="text-muted-foreground">•</span>
                      <span className="flex-1">{goal}</span>
                      <button 
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-cyan transition-opacity"
                        onClick={() => captureInsight(goal)}
                      >
                        <Lightbulb size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="needs" className="border-b border-border/50">
              <AccordionTrigger className="bg-green-950/20 hover:bg-green-950/30 px-3">
                <span className="text-green-400">Needs</span>
              </AccordionTrigger>
              <AccordionContent className="px-3 py-2 bg-green-950/10">
                <ul className="space-y-3">
                  {persona.needs.map((need, index) => (
                    <li key={index} className="flex items-start gap-2 group">
                      <span className="text-muted-foreground">•</span>
                      <span className="flex-1">{need}</span>
                      <button 
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-cyan transition-opacity"
                        onClick={() => captureInsight(need)}
                      >
                        <Lightbulb size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="wants" className="border-b border-border/50">
              <AccordionTrigger className="bg-purple-950/20 hover:bg-purple-950/30 px-3">
                <span className="text-purple-400">Wants</span>
              </AccordionTrigger>
              <AccordionContent className="px-3 py-2 bg-purple-950/10">
                <ul className="space-y-3">
                  {persona.wants.map((want, index) => (
                    <li key={index} className="flex items-start gap-2 group">
                      <span className="text-muted-foreground">•</span>
                      <span className="flex-1">{want}</span>
                      <button 
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-cyan transition-opacity"
                        onClick={() => captureInsight(want)}
                      >
                        <Lightbulb size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="fears" className="border-b border-border/50">
              <AccordionTrigger className="bg-orange-950/20 hover:bg-orange-950/30 px-3 rounded-b-md">
                <span className="text-orange-400">Fears</span>
              </AccordionTrigger>
              <AccordionContent className="px-3 py-2 bg-orange-950/10">
                <ul className="space-y-3">
                  {persona.fears.map((fear, index) => (
                    <li key={index} className="flex items-start gap-2 group">
                      <span className="text-muted-foreground">•</span>
                      <span className="flex-1">{fear}</span>
                      <button 
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-cyan transition-opacity"
                        onClick={() => captureInsight(fear)}
                      >
                        <Lightbulb size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Artifacts thumbnails */}
          <div>
            <h4 className="text-sm font-medium mb-3">Personal Artifacts</h4>
            <div className="grid grid-cols-3 gap-2">
              {persona.artifacts.map((artifact, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded overflow-hidden border border-border"
                >
                  <img 
                    src={artifact} 
                    alt={`${persona.name}'s artifact ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface TimelineNodeProps {
  label: string;
  text: string;
  onCapture: () => void;
}

const TimelineNode: React.FC<TimelineNodeProps> = ({ label, text, onCapture }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      className="flex flex-col items-center w-[18%]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative z-10">
        <div className="w-8 h-8 bg-cyan rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-background rounded-full"></div>
        </div>
        
        {/* Capture insight button */}
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-cyan hover:text-cyan/80"
            onClick={onCapture}
          >
            <Lightbulb size={20} />
          </motion.button>
        )}
      </div>
      
      <h5 className="font-medium text-sm mt-3 mb-1">{label}</h5>
      <p className="text-xs text-muted-foreground text-center">{text}</p>
    </div>
  );
};

export default PersonaDetail;
