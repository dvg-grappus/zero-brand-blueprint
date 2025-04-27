
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCompetition } from '@/providers/CompetitionProvider';
import { toast } from 'sonner';

interface CompetitorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompetitorSearchModal: React.FC<CompetitorSearchModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { addCompetitor } = useCompetition();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryName, setCategoryName] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Create category name if not provided
    const category = categoryName || `${searchQuery} competitors`;
    
    // Mock creating a new competitor based on search
    const newCompetitorId = `custom-${Date.now()}`;
    const newCompetitor = {
      id: newCompetitorId,
      name: searchQuery,
      logo: "/placeholder.svg",
      tags: [category, "Custom", "New"],
      type: "startup" as const,
      priority: 5,
      position: { x: 0.5, y: 0.5 }
    };
    
    addCompetitor(newCompetitor);
    toast.success(`Added "${searchQuery}" as a new competitor`);
    
    // Reset form and close modal
    setSearchQuery('');
    setCategoryName('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Competitors</DialogTitle>
          <DialogDescription>
            Search and add competitors to your market analysis.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for competitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div>
            <Input
              placeholder="Optional: Category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to use search term as category
            </p>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="font-medium mb-2">Preview</h3>
            {searchQuery ? (
              <div>
                <p className="text-sm">New competitor: <span className="font-medium">{searchQuery}</span></p>
                <p className="text-sm">Will be added to: <span className="font-medium">{categoryName || `${searchQuery} competitors`}</span></p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter a search term to preview results</p>
            )}
          </div>
        </form>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
            Add Competitor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
