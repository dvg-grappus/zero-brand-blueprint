
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMarket } from "@/providers/MarketProvider";

interface MarketFooterProps {
  completedSections: number[];
  onShowInsightDigest: () => void;
  onModuleComplete: () => void;
}

export const MarketFooter: React.FC<MarketFooterProps> = ({ 
  completedSections,
  onShowInsightDigest,
  onModuleComplete
}) => {
  const { isModuleComplete } = useMarket();
  
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-[320px] h-20 bg-background/80 backdrop-blur-sm border-t border-border/40 px-[120px] flex items-center justify-between"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="text-sm text-muted-foreground">
        {completedSections.length}/4 sections completed
      </div>
      
      <Button
        onClick={onShowInsightDigest}
        disabled={!isModuleComplete}
        className={isModuleComplete ? "bg-cyan hover:bg-cyan/90 text-black" : ""}
      >
        Publish market insights →
      </Button>
    </motion.div>
  );
};
