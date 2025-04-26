
import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface StickyNoteProps {
  id: string;
  content: string;
  isSelected: boolean;
  isDiscarded: boolean;
  onClick: () => void;
  onDiscard: () => void;
  color?: string;
  className?: string;
}

const StickyNote: React.FC<StickyNoteProps> = ({
  id,
  content,
  isSelected,
  isDiscarded,
  onClick,
  onDiscard,
  color = "#FFE87A",
  className = ""
}) => {
  return (
    <motion.div
      id={`sticky-note-${id}`}
      className={`relative w-[140px] h-[160px] rounded-lg p-3 font-medium text-[13px] ${className}`}
      style={{
        backgroundColor: color,
        opacity: isDiscarded ? 0.3 : 1
      }}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-full overflow-hidden text-black">
        {content}
      </div>
      
      {/* Control Chips */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        <button
          className={`flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
            isSelected ? "bg-black text-white" : "bg-cyan text-black"
          }`}
          onClick={onClick}
        >
          <Check className="w-2.5 h-2.5 mr-0.5" />
          Select
        </button>
        
        <button
          className={`flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold border border-black/20 transition-colors ${
            isDiscarded ? "bg-black/10" : "bg-transparent"
          }`}
          onClick={onDiscard}
        >
          <X className="w-2.5 h-2.5 mr-0.5" />
          Discard
        </button>
      </div>
    </motion.div>
  );
};

export default StickyNote;
