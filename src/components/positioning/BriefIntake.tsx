
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import StepNavBar from "./StepNavBar";
import { PositioningContext } from "@/pages/StepPage";
import { useNavigate } from "react-router-dom";

const BriefIntake: React.FC = () => {
  const { briefContext, setBriefContext } = useContext(PositioningContext);
  const [wordCount, setWordCount] = useState(0);
  const navigate = useNavigate();
  
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setBriefContext(text);
    setWordCount(countWords(text));
  };
  
  const isButtonDisabled = wordCount < 20 || wordCount > 80;
  
  const handleNext = () => {
    navigate("/step/1/golden-circle");
  };
  
  return (
    <>
      <div className="col-span-12 max-w-[800px] mx-auto">
        <motion.h1
          className="text-[32px] font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          One paragraph to rule them all.
        </motion.h1>
        
        <motion.p
          className="text-[18px] text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Tell us what you're building in 80 words or fewer.
        </motion.p>
        
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Textarea 
            value={briefContext}
            onChange={handleInputChange}
            placeholder="E.g. An AI-powered platform that…"
            className="w-full min-h-[240px] p-4 text-[16px]"
          />
          
          <div 
            className={`absolute bottom-4 right-4 text-sm ${
              wordCount > 80 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {wordCount}/80 words
          </div>
        </motion.div>
      </div>
      
      <StepNavBar 
        title="Brief Intake"
        nextStep="/step/1/golden-circle"
        nextButtonLabel="Position it →"
        isButtonDisabled={isButtonDisabled}
        onNext={handleNext}
      />
    </>
  );
};

export default BriefIntake;
