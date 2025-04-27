
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudience } from "@/providers/AudienceProvider";

type MessageRole = "assistant" | "user" | "insight";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
}

const ASSISTANT_CONTEXT: Record<string, {
  welcomeMessage: string;
  insightMessages: string[];
  quickActions: QuickAction[];
}> = {
  "cohort-canvas": {
    welcomeMessage: "Tip — tighten sliders first, then pick tags that feel precise.",
    insightMessages: [
      "The most effective targeting finds the intersection of demographics and psychographics.",
      "Consider niche segments that competitors might overlook.",
      "Don't over-narrow your initial audience; you need room for experimentation."
    ],
    quickActions: [
      { id: "widen-age", label: "Widen age" },
      { id: "suggest-psychographics", label: "Suggest psychographics" },
      { id: "clear-all", label: "Clear all" }
    ]
  },
  "cohort-board": {
    welcomeMessage: "Hover any card to preview social feeds & top pain-points.",
    insightMessages: [
      "The fastest-growing cohort isn't always the most profitable.",
      "Look for cohorts with overlapping pain points for efficiency.",
      "Early adopters are valuable but don't overlook mainstream segments."
    ],
    quickActions: [
      { id: "fastest-growing", label: "Pick fastest-growing" },
      { id: "deselect-low", label: "Deselect low LTV" },
      { id: "show-sources", label: "Show sources" }
    ]
  },
  "persona-gallery": {
    welcomeMessage: "Ask a persona what frustrates them about today's solutions.",
    insightMessages: [
      "Personas help teams build empathy with real target users.",
      "Compare two personas to highlight key differences in approach.",
      "Look for patterns across all personas to find universal needs."
    ],
    quickActions: [
      { id: "alt-persona", label: "Generate alt persona" },
      { id: "compare-personas", label: "Compare two personas" },
      { id: "highlight-extremes", label: "Highlight extremes" }
    ]
  },
  "persona": {
    welcomeMessage: "Happy to elaborate on any of these pains—just ask.",
    insightMessages: [
      "Pay attention to the journey timeline for friction points.",
      "Fears often reveal more than wants when designing solutions.",
      "Consider how the persona's environment influences their decisions."
    ],
    quickActions: [
      { id: "clarify-goal", label: "Clarify goal" },
      { id: "ask-tech", label: "Ask tech usage" },
      { id: "probe-social", label: "Probe social media" }
    ]
  },
  "simulations": {
    welcomeMessage: "Need a provocative brief? Try 'convince each other to drop the product'.",
    insightMessages: [
      "Look for moments of agreement between different personas.",
      "Pay attention to unexpected workarounds mentioned.",
      "Identify emotional triggers that could become messaging points."
    ],
    quickActions: [
      { id: "random-topic", label: "Random topic" },
      { id: "add-third", label: "Add third persona" },
      { id: "summarize", label: "Summarise insights" }
    ]
  },
  "insight-review": {
    welcomeMessage: "Star your top insights - these will be highlighted in your final report.",
    insightMessages: [
      "Similar insights can be merged for a stronger central theme.",
      "Look for insights that bridge multiple personas for broader relevance.",
      "Prioritize insights that reveal unexpected behaviors or needs."
    ],
    quickActions: [
      { id: "auto-merge", label: "Auto-merge similar" },
      { id: "rank-impact", label: "Rank by impact" },
      { id: "extract-brief", label: "Extract brief" }
    ]
  }
};

interface AIAssistantPanelProps {
  currentStep: string;
  personaMode?: { id: string; name: string };
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ currentStep, personaMode }) => {
  const { addInsight } = useAudience();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Reset and initialize messages when step changes
  useEffect(() => {
    setMessages([]);
    
    // Get context for current step
    const context = ASSISTANT_CONTEXT[currentStep];
    if (!context) return;
    
    // Add welcome message
    setTimeout(() => {
      setMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: personaMode 
          ? `I'm ${personaMode.name}. Ask me anything about my experience.`
          : context.welcomeMessage,
        timestamp: new Date()
      }]);
      
      // Add an insight message after a short delay
      setTimeout(() => {
        const insight = context.insightMessages[Math.floor(Math.random() * context.insightMessages.length)];
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "insight",
          content: insight,
          timestamp: new Date()
        }]);
      }, 2000);
    }, 500);
  }, [currentStep, personaMode]);
  
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
      
      // Persona mode responses
      if (personaMode) {
        const personaResponses = [
          "That's a great question. From my perspective, the biggest challenge is finding tools that integrate with my existing workflow.",
          "I'd be willing to pay more if it saved me at least 3 hours per week.",
          "The most frustrating part of current solutions is having to switch between too many apps.",
          "I typically discover new tools through recommendations from colleagues, not ads.",
          "What I value most is simplicity and reliability - I don't need fancy features."
        ];
        response = personaResponses[Math.floor(Math.random() * personaResponses.length)];
        
        // Check if response contains valuable insight
        if (Math.random() > 0.7) {
          // Capture insight from persona response
          setTimeout(() => {
            addInsight(
              response.substring(0, 90) + (response.length > 90 ? '...' : ''),
              `Persona: ${personaMode.name}`,
              false
            );
          }, 1000);
        }
      } 
      // Regular assistant responses
      else {
        const context = ASSISTANT_CONTEXT[currentStep];
        if (context) {
          const responses = [
            "I've analyzed your input and found some interesting patterns.",
            "That's a valuable perspective. Have you considered looking at it from another angle?",
            "Based on your selections, I'd recommend focusing on these key areas.",
            "This approach could yield better results if combined with targeted messaging.",
            "You're on the right track. Consider refining your selection a bit more."
          ];
          response = responses[Math.floor(Math.random() * responses.length)];
        }
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
  
  const handleQuickAction = (actionId: string) => {
    if (!ASSISTANT_CONTEXT[currentStep]) return;
    
    const action = ASSISTANT_CONTEXT[currentStep].quickActions.find(a => a.id === actionId);
    if (!action) return;
    
    // Add user message for the quick action
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: action.label,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Custom responses per action
    const actionResponses: Record<string, string> = {
      "widen-age": "I've adjusted the age slider to include a broader range. This will give you more flexibility in targeting.",
      "suggest-psychographics": "Consider including tags like 'Digital Minimalists', 'Remote Work Nomads', or 'Productivity Enthusiasts'.",
      "clear-all": "I've reset your selections. Let's start fresh with a clean slate.",
      "fastest-growing": "I've highlighted the fastest-growing cohorts in the grid. These segments are expanding rapidly.",
      "deselect-low": "I've deselected cohorts with lower lifetime value to help you focus on more profitable segments.",
      "show-sources": "These cohort profiles are based on data from market research firms, public surveys, and trend analysis.",
      "alt-persona": "I've generated an alternative persona that still fits your selected cohorts but with different characteristics.",
      "compare-personas": "Here's a side-by-side comparison of key differences between your selected personas.",
      "highlight-extremes": "I've highlighted the personas with the most contrasting behaviors to help you see the full spectrum.",
      "clarify-goal": "This persona's primary goal is to reduce manual work by automating repetitive tasks.",
      "ask-tech": "This persona uses productivity apps daily, is comfortable with new technology, but resists complex setup processes.",
      "probe-social": "This persona is most active on LinkedIn and industry-specific forums, less so on mainstream social platforms.",
      "random-topic": "How about this topic: 'What would make you immediately adopt a new solution?'",
      "add-third": "Adding a third perspective will create more dynamic conversation. Which additional persona would you like to include?",
      "summarize": "I've analyzed the transcript and extracted the 3 most valuable insights from this conversation.",
      "auto-merge": "I've identified 4 insights that could be merged into stronger themes. Would you like me to combine them?",
      "rank-impact": "I've sorted your insights by potential business impact based on market trends.",
      "extract-brief": "Based on your top insights, I've drafted a brief summary you can use for your strategy planning."
    };
    
    // Generate a response after a short delay
    setTimeout(() => {
      const response = actionResponses[actionId] || "I've processed your request and updated the view accordingly.";
      
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
          <h3 className="font-medium text-foreground">
            {personaMode ? `Chat with ${personaMode.name}` : "Brand AI"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {personaMode ? "Persona simulation" : "Audience assistant"}
          </p>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === "insight" ? (
              <div className="max-w-[90%] p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800">{message.content}</p>
                  <p className="text-xs mt-1 text-amber-600">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ) : (
              <div 
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.role === 'assistant' 
                    ? personaMode ? 'bg-purple-900/20 text-foreground' : 'bg-muted text-foreground'
                    : 'bg-cyan text-background'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
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
      
      {/* Quick action buttons */}
      {ASSISTANT_CONTEXT[currentStep] && (
        <div className="px-4 py-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {ASSISTANT_CONTEXT[currentStep].quickActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="bg-muted/50 text-foreground hover:bg-muted transition-colors text-xs"
                onClick={() => handleQuickAction(action.id)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-muted/50 border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan"
            placeholder={personaMode ? `Ask ${personaMode.name} a question...` : "Ask for ideas or feedback..."}
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
