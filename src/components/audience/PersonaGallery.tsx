import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, MessageCircle, CircleCheck, X } from "lucide-react";
import { useAudience, Persona } from "@/providers/AudienceProvider";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const SAMPLE_PERSONAS: Persona[] = [
  {
    id: "p1",
    name: "Sara Wales",
    age: 22,
    country: "United States",
    archetype: "Spiral",
    archeTypeColor: "#FF6B6B",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80",
    whyTheyMatter: "Sara represents our most engaged early adopters. Her feedback drives 40% of new feature adoption across our user base.",
    story: "As a recent design graduate working at a tech startup, Sara is constantly balancing multiple responsibilities. She seeks tools that help her organize chaotic workflows without rigid structure.",
    quote: "I don't think linearly. I need tools that let me work in spirals and still arrive at my destination.",
    journey: {
      discover: "Found via Twitter thread about design tools",
      decide: "Free trial solved a project bottleneck",
      firstUse: "Onboarded team for collaborative project",
      habit: "Now uses daily for task organization",
      advocate: "Regularly shares workflows on social media"
    },
    goals: [
      "Build impressive portfolio while working full-time",
      "Get promoted to senior designer within 2 years",
      "Learn new creative skills outside formal education"
    ],
    needs: [
      "Flexibility to organize tasks in non-linear ways",
      "Visual tools that complement her spatial thinking",
      "Quick ways to share progress with stakeholders"
    ],
    wants: [
      "Recognition for innovative approaches",
      "Tools that feel modern and well-designed",
      "Integration with other creative platforms"
    ],
    fears: [
      "Being forced into rigid processes that limit creativity",
      "Falling behind peers in competitive industry",
      "Tools becoming obsolete after investing time learning them"
    ],
    artifacts: [
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: "p2",
    name: "Liz Gao",
    age: 26,
    country: "Singapore",
    archetype: "Linear",
    archeTypeColor: "#4ECDC4",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    whyTheyMatter: "Liz represents our power users who integrate our product deeply into their workflow and drive our highest lifetime value.",
    story: "As a product manager at a finance company, Liz values structure and clarity. With multiple stakeholders and tight deadlines, she needs tools that provide clear visibility and accountability.",
    quote: "Show me the data, give me the timeline, and let me track every step of the way.",
    journey: {
      discover: "Recommended by colleague",
      decide: "Compared features in detailed spreadsheet",
      firstUse: "Migrated entire team workflow",
      habit: "Created templates for recurring projects",
      advocate: "Presented ROI to leadership team"
    },
    goals: [
      "Successfully launch 4 major features per year",
      "Reduce meeting time by improving async communication",
      "Advance to senior leadership within 3 years"
    ],
    needs: [
      "Clear dashboards tracking project status and metrics",
      "Ability to create repeatable processes",
      "Robust reporting for stakeholder updates"
    ],
    wants: [
      "Advanced forecasting and resource planning",
      "Customizable views for different teams",
      "Enterprise-grade security features"
    ],
    fears: [
      "Missing critical deadlines due to poor visibility",
      "Teams working in silos with conflicting priorities",
      "Being unable to demonstrate quantifiable value to executives"
    ],
    artifacts: [
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: "p3",
    name: "Tushar Rao",
    age: 30,
    country: "India",
    archetype: "Expert",
    archeTypeColor: "#7D80DA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    whyTheyMatter: "Tushar represents our technical users who push our platform to its limits and provide critical feedback for advanced features.",
    story: "As an engineering lead transitioning to management, Tushar needs tools that balance technical depth with people management. He values efficiency and integration capabilities above all.",
    quote: "I need systems that get out of my way and let me focus on solving the real problems.",
    journey: {
      discover: "Found through technical blog post",
      decide: "Tested API capabilities thoroughly",
      firstUse: "Integrated with existing development tools",
      habit: "Built custom extensions for team workflow",
      advocate: "Contributes to developer community"
    },
    goals: [
      "Scale team from 8 to 20 engineers this year",
      "Reduce technical debt while maintaining release velocity",
      "Build mentor reputation in tech community"
    ],
    needs: [
      "Powerful APIs and integration capabilities",
      "Fine-grained access controls for team permissions",
      "Automation of routine management tasks"
    ],
    wants: [
      "Ability to customize and extend platform functionality",
      "Data portability and open standards",
      "Early access to beta features"
    ],
    fears: [
      "Tools becoming a bottleneck for high-performing team",
      "Vendor lock-in limiting future flexibility",
      "Security vulnerabilities compromising sensitive data"
    ],
    artifacts: [
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=300&q=80"
    ]
  }
];

interface PersonaCardProps {
  persona: Persona;
  onReplace: (id: string) => void;
  onEdit: (id: string) => void;
  onTalk: (id: string) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onReplace, onEdit, onTalk }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="w-full sm:w-[320px] h-[450px] relative cursor-pointer perspective-1000 mx-auto mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div 
          className={`absolute backface-hidden w-full h-full rounded-lg shadow-lg bg-[#2B2B2B] p-4 border border-border/30 overflow-hidden ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={() => setIsFlipped(true)}
        >
          <div className="aspect-w-3 aspect-h-4 bg-black/20 w-full rounded-lg overflow-hidden">
            <img 
              src={persona.image} 
              alt={persona.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs bg-background/30 backdrop-blur-sm rounded">
                {persona.country}
              </span>
              <span 
                className="px-2 py-1 text-xs rounded text-background" 
                style={{ backgroundColor: persona.archeTypeColor }}
              >
                {persona.archetype}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold">
              {persona.name}, {persona.age}
            </h3>
          </div>
        </div>
        
        <div 
          className={`absolute backface-hidden w-full h-full rounded-lg shadow-lg bg-[#2B2B2B] p-5 border border-border/30 overflow-hidden rotate-y-180 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsFlipped(false)}
        >
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-2">
              {persona.name}, {persona.age}
            </h3>
            
            <div 
              className="px-3 py-1 text-sm rounded text-background w-fit mb-6" 
              style={{ backgroundColor: persona.archeTypeColor }}
            >
              {persona.archetype}
            </div>
            
            <div className="space-y-4 flex-1">
              <h4 className="text-sm font-medium text-cyan">Why they matter:</h4>
              <p className="text-sm">{persona.whyTheyMatter}</p>
            </div>
            
            <Button 
              variant="link" 
              className="text-cyan mt-4"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/step/2/persona/${persona.id}`);
              }}
            >
              See full profile →
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        <Button 
          size="sm" 
          variant="outline" 
          className="rounded-full" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onEdit(persona.id);
          }}
        >
          <Edit size={14} className="mr-1" />
          Edit
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="rounded-full"
          onClick={(e) => { e.stopPropagation(); onReplace(persona.id); }}
        >
          <RefreshCw size={14} className="mr-1" />
          Replace
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="rounded-full"
          onClick={(e) => { e.stopPropagation(); onTalk(persona.id); }}
        >
          <MessageCircle size={14} className="mr-1" />
          Talk
        </Button>
      </div>
    </motion.div>
  );
};

interface PersonaGalleryProps {
  onComplete: () => void;
}

const PersonaGallery: React.FC<PersonaGalleryProps> = ({ onComplete }) => {
  const { personas, setPersonas, replacePersona } = useAudience();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTalkPersona, setActiveTalkPersona] = useState<string | null>(null);
  const [activePersonaCard, setActivePersonaCard] = useState<Persona | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPersonas(SAMPLE_PERSONAS);
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [setPersonas]);
  
  const handleEdit = (id: string) => {
    navigate(`/step/2/persona/${id}`);
  };
  
  const handleReplace = (id: string) => {
    setIsLoading(true);
    replacePersona(id);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const handleTalk = (id: string) => {
    const persona = personas.find(p => p.id === id);
    if (persona) {
      setActivePersonaCard(persona);
      setActiveTalkPersona(id);
      console.log("onPersonaTalk", id, "Hello, how can I help?");
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-16"
    >
      <motion.div 
        className="text-center mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Meet your audience</h1>
        <p className="text-muted-foreground">Get to know the personas behind your core cohorts.</p>
      </motion.div>
      
      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 border-2 border-t-cyan rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Creating detailed personas from your selected cohorts...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
            {personas.map(persona => (
              <PersonaCard 
                key={persona.id} 
                persona={persona} 
                onReplace={handleReplace}
                onEdit={handleEdit}
                onTalk={handleTalk}
              />
            ))}
          </div>
          
          <p className="text-center text-muted-foreground max-w-2xl px-4">
            These personas represent the key segments of your audience. Each has unique goals, needs, and behaviors that inform product decisions.
            Explore their profiles to understand their motivations deeper.
          </p>
        </div>
      )}
      
      <AnimatePresence>
        {activeTalkPersona && activePersonaCard && (
          <PersonaTalkSheet
            persona={activePersonaCard}
            onClose={() => {
              setActiveTalkPersona(null);
              setActivePersonaCard(null);
            }}
          />
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-8 right-[calc(30%+2rem)] left-8 flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm border-t border-border/40">
        <div className="text-sm">
          {personas.length === 3 && (
            <span className="flex items-center text-cyan gap-1">
              <CircleCheck size={16} /> Three personas ready for review
            </span>
          )}
        </div>
        <Button 
          onClick={onComplete}
          disabled={personas.length !== 3}
          className="bg-cyan hover:bg-cyan/90 text-background"
        >
          Approve personas →
        </Button>
      </div>
    </motion.div>
  );
};

interface PersonaTalkSheetProps {
  persona: Persona;
  onClose: () => void;
}

const PersonaTalkSheet: React.FC<PersonaTalkSheetProps> = ({ persona, onClose }) => {
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hello, how can I help you today?", isUser: false }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    setMessages(prev => [...prev, { text: userInput, isUser: true }]);
    
    setIsTyping(true);
    
    console.log("onPersonaTalk", persona.id, userInput);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: `As ${persona.name}, I'd say that's an interesting point. From my perspective as a ${persona.archetype.toLowerCase()}, I approach problems differently.`, 
          isUser: false 
        }
      ]);
      setIsTyping(false);
    }, 2000);
    
    setUserInput("");
  };
  
  const toggleListening = () => {
    setIsListening(!isListening);
  };
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end md:items-center md:justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div 
        className="bg-[#1E1E1E] w-full max-w-lg rounded-t-lg md:rounded-2xl shadow-xl border border-border/30 z-10 overflow-hidden flex flex-col"
        style={{ maxHeight: "calc(100vh - 80px)" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 20 }}
      >
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
        
        <div className="p-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={`rounded-full ${isListening ? 'bg-cyan text-background' : ''}`}
              onClick={toggleListening}
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

export default PersonaGallery;
