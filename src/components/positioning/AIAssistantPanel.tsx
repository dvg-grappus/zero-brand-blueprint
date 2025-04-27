
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { usePositioning } from "@/contexts/PositioningContext";

// Define types for AI messages
type MessageRole = "assistant" | "user";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Predefined responses based on positioning step
const ASSISTANT_RESPONSES: Record<string, string[]> = {
  "brief": [
    "I noticed you're working on a brief. Consider highlighting your unique value proposition in a clear, concise way.",
    "Your brief is looking good. To make it stronger, try answering 'why now?' - what market timing makes this opportunity special?",
    "I see you're building something innovative! Consider adding who your primary audience is in your brief."
  ],
  "golden-circle": [
    "For your 'Why' statement, focus on the purpose that drives your brand - what change do you want to see in the world?",
    "Your 'How' statements look good. Consider adding something about your unique methodology or approach.",
    "When crafting your 'What' statements, focus on the tangible offerings rather than features."
  ],
  "opportunities-challenges": [
    "I see you've identified some key opportunities. Consider which ones align most with your core competencies.",
    "For challenges, it might help to rank them by impact and difficulty to overcome.",
    "Have you considered looking at your competitors' weaknesses as potential opportunities?"
  ],
  "roadmap": [
    "Your roadmap is taking shape! Think about breaking down your 12-month goals into quarterly milestones.",
    "Consider adding some measurable metrics to your roadmap milestones.",
    "Your long-term vision looks ambitious - that's great! Now try to identify the stepping stones to get there."
  ],
  "values": [
    "Strong values make for strong brands. Which of these values most differentiates you from competitors?",
    "Consider how each value translates into specific behaviors or decisions within your organization.",
    "Your selected values seem cohesive. How will you ensure these are reflected in your brand voice and visuals?"
  ],
  "differentiators": [
    "Great differentiators! Now think about which ones are hardest for competitors to copy.",
    "Consider which of these differentiators your target audience would value most.",
    "Your differentiators look solid. Can you quantify any of these with specific metrics or examples?"
  ],
  "statements": [
    "Your positioning statement is coming together nicely. Try reading it aloud to ensure it flows naturally.",
    "Consider how memorable your statement is - could someone easily repeat it after hearing it once?",
    "The strongest positioning statements are specific, credible, and emotionally resonant. How does yours stack up?"
  ]
};

// Welcome messages when the assistant first loads
const WELCOME_MESSAGES = [
  "Hi there! I'm your AI positioning assistant. I'll help you craft a powerful brand position.",
  "I see you're working on your brand positioning. Need any ideas or feedback?",
  "Welcome to the positioning module! I'm here to help refine your brand strategy."
];

const AIAssistantPanel: React.FC = () => {
  const { activeStep } = usePositioning();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add welcome message on first load
  useEffect(() => {
    const welcomeMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date()
      }
    ]);
  }, []);
  
  // Send a contextual hint when the active step changes
  useEffect(() => {
    if (activeStep && ASSISTANT_RESPONSES[activeStep]) {
      setIsTyping(true);
      
      // Simulate typing delay
      const timer = setTimeout(() => {
        const responses = ASSISTANT_RESPONSES[activeStep];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: randomResponse,
          timestamp: new Date()
        }]);
        
        setIsTyping(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [activeStep]);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Generate a response after a short delay
    setTimeout(() => {
      let response = "I'm analyzing your input...";
      
      // If we have canned responses for the current step, use one
      if (activeStep && ASSISTANT_RESPONSES[activeStep]) {
        const responses = ASSISTANT_RESPONSES[activeStep];
        response = responses[Math.floor(Math.random() * responses.length)];
      } else {
        // Generic responses
        const genericResponses = [
          "That's an interesting perspective. Have you considered how this aligns with your target audience?",
          "Great point. This could help differentiate your brand in a meaningful way.",
          "I see what you're thinking. This approach could work well if executed consistently across touchpoints.",
          "That's a strong direction. Consider how this might evolve as your brand grows."
        ];
        response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <motion.div
      className="bg-card rounded-lg border border-border/50 h-full flex flex-col shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-cyan flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-background" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Brand AI</h3>
          <p className="text-xs text-muted-foreground">Positioning assistant</p>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg ${
                message.role === 'assistant' 
                  ? 'bg-muted text-foreground' 
                  : 'bg-cyan text-background'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-muted/50 border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan"
            placeholder="Ask for ideas or feedback..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="h-10 w-10 rounded-full bg-cyan text-background flex items-center justify-center hover:bg-cyan/90 transition-colors"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AIAssistantPanel;
