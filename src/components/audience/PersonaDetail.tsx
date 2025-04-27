
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudience } from "@/providers/AudienceProvider";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowLeft, MessageCircle, X } from "lucide-react";
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
import { Drawer, DrawerContent } from "@/components/ui/drawer";

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
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content (left column) */}
        <div className="w-full lg:w-[68%]">
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
            
            <div className="relative flex flex-wrap lg:flex-nowrap justify-between">
              {/* Timeline line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-muted hidden lg:block"></div>
              
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
        <div className="w-full lg:w-[28%] lg:sticky lg:top-24">
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

      {/* Animated Bottom Sheet for Persona Conversation */}
      <AnimatePresence>
        {showSimulationDialog && (
          <PersonaTalkDialog
            persona={persona}
            messages={conversationMessages}
            onClose={() => setShowSimulationDialog(false)}
            onSendMessage={handleSendMessage}
          />
        )}
      </AnimatePresence>
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
      className="flex flex-col items-center w-full lg:w-[18%] mb-6 lg:mb-0"
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

interface PersonaTalkDialogProps {
  persona: Persona;
  messages: {text: string, isUser: boolean}[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

const PersonaTalkDialog: React.FC<PersonaTalkDialogProps> = ({ 
  persona, 
  messages,
  onClose,
  onSendMessage
}) => {
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    onSendMessage(userInput);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
    
    setUserInput("");
  };
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end md:items-center md:justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Talk Dialog */}
      <motion.div 
        className="bg-[#1E1E1E] w-full max-w-lg rounded-t-lg md:rounded-2xl shadow-xl border border-border/30 z-10 overflow-hidden flex flex-col"
        style={{ maxHeight: "calc(100vh - 80px)" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-border/50">
              <AvatarImage src={persona.image} alt={persona.name} />
              <AvatarFallback>{persona.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{persona.name}</h3>
              <span 
                className="px-2 py-1 text-xs rounded text-background inline-block"
                style={{ backgroundColor: persona.archeTypeColor }}
              >
                {persona.archetype}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
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
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#2B2B2B] text-white p-3 rounded-lg flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={`rounded-full ${isListening ? 'bg-cyan text-background' : ''}`}
              onClick={() => setIsListening(!isListening)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isListening ? "lucide lucide-mic" : "lucide lucide-mic-off"}>
                {isListening ? (
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3"></path>
                ) : (
                  <>
                    <path d="m2 2 20 20"/>
                    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/>
                    <path d="M5 10v2a7 7 0 0 0 12 5"/>
                    <path d="M15 9.34V5a3 3 0 0 0-5.94-.6"/>
                    <path d="M12 19v3"/>
                  </>
                )}
              </svg>
            </Button>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-[#2B2B2B] border border-border/30 rounded-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan"
              placeholder="Ask me anything..."
            />
            <Button 
              type="button" 
              onClick={handleSendMessage}
              className="bg-cyan hover:bg-cyan/90 text-background rounded-full"
              size="icon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                <path d="m3 3 3 9-3 9 19-9Z"/>
                <path d="M6 12h16"/>
              </svg>
            </Button>
          </div>
          
          {/* Voice waveform animation */}
          {isListening && (
            <motion.div 
              className="mt-3 flex justify-center items-center h-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-end space-x-1 h-full">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-cyan rounded-full"
                    animate={{
                      height: [4, Math.random() * 16 + 8, 4],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonaDetail;
