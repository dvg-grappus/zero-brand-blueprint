
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAudience } from "@/providers/AudienceProvider";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowLeft, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams, useNavigate } from "react-router-dom";

interface PersonaDetailProps {
  personaId?: string;
  onBack: () => void;
}

const PersonaDetail: React.FC<PersonaDetailProps> = ({ personaId, onBack }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { personas, addInsight } = useAudience();
  const [activeAccordion, setActiveAccordion] = useState<string>("goals");
  const [showSimulationDialog, setShowSimulationDialog] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<{text: string, isUser: boolean}[]>([]);
  
  // Use personaId from props or from URL params
  const actualPersonaId = personaId || params.personaId;
  const persona = personas.find(p => p.id === actualPersonaId);
  
  useEffect(() => {
    // Reset conversation when persona changes
    setConversationMessages([
      { 
        text: "Happy to elaborate on any of these pains—just ask.", 
        isUser: false 
      }
    ]);
  }, [actualPersonaId]);
  
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
  
  const startSimulation = () => {
    setShowSimulationDialog(true);
    console.log("onPersonaTalk", persona.id, "Start simulation");
  };
  
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    setConversationMessages(prev => [...prev, { text: message, isUser: true }]);
    
    // Log the event
    console.log("onPersonaTalk", persona.id, message);
    
    // Simulate response after delay
    setTimeout(() => {
      let response = "";
      
      if (message.toLowerCase().includes("frustrate") || message.toLowerCase().includes("pain")) {
        response = `The most frustrating thing for me is ${persona.fears[0].toLowerCase()}. It really affects my productivity.`;
      } else if (message.toLowerCase().includes("goal") || message.toLowerCase().includes("aim")) {
        response = `My main goal right now is to ${persona.goals[0].toLowerCase()}. It's really important to me.`;
      } else if (message.toLowerCase().includes("need") || message.toLowerCase().includes("want")) {
        response = `What I really need is ${persona.needs[0].toLowerCase()}. Without that, I struggle daily.`;
      } else {
        response = `That's an interesting question! As a ${persona.archetype.toLowerCase()}, I approach problems with a focus on ${persona.goals[0].toLowerCase()}.`;
      }
      
      setConversationMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1500);
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
          onClick={startSimulation}
        >
          <MessageCircle size={16} className="mr-1" />
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

      {/* Dialog for persona simulation */}
      <Dialog open={showSimulationDialog} onOpenChange={setShowSimulationDialog}>
        <DialogContent className="sm:max-w-[500px] bg-[#1E1E1E] border-border/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={persona.image} alt={persona.name} />
                <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-lg">{persona.name}</span>
                <div className="text-xs text-muted-foreground">{persona.archetype}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto p-2 space-y-4 mt-2">
            {conversationMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser 
                      ? 'bg-cyan text-black'
                      : 'bg-[#2B2B2B] text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={`rounded-full ${isListening ? 'bg-cyan text-background' : ''}`}
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic-off"><path d="m2 2 20 20"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M12 19v3"/></svg>
              )}
            </Button>
            
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 bg-[#2B2B2B] border border-border/30 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            
            <Button
              type="button"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Ask me anything..."]') as HTMLInputElement;
                if (input) {
                  handleSendMessage(input.value);
                  input.value = '';
                }
              }}
            >
              Send
            </Button>
          </div>
          
          {isListening && (
            <div className="mt-2 flex justify-center">
              <div className="h-8 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-cyan"
                    style={{ 
                      height: `${Math.random() * 24 + 4}px`,
                      animation: 'pulse 0.5s infinite alternate',
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
