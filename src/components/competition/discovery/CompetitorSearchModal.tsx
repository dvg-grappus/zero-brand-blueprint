
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CompetitorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompetitorSearchModal: React.FC<CompetitorSearchModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Competitors</DialogTitle>
          <DialogDescription>
            Search and add competitors to your market analysis.
          </DialogDescription>
        </DialogHeader>
        
        {/* TODO: Implement competitor search functionality */}
        <div className="py-4">
          Competitor search will be implemented soon.
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            Add Competitors
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

