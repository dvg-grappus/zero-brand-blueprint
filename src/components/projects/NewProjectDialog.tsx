
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectsContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

const thumbnailOptions = [
  { url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b', label: 'Tech' },
  { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', label: 'Design' },
  { url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81', label: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', label: 'Workspace' },
  { url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7', label: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9', label: 'Business' },
];

const NewProjectDialog: React.FC = () => {
  const { createProject } = useProjects();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState(thumbnailOptions[0].url);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    setIsCreating(true);
    
    // Create the new project
    const newProject = createProject({
      name,
      description,
      thumbnail: selectedThumbnail,
      progress: 0,
      status: 'draft',
      collaborators: []
    });
    
    // Close dialog and navigate to the new project
    setOpen(false);
    setIsCreating(false);
    
    setTimeout(() => {
      // Reset form
      setName('');
      setDescription('');
      setSelectedThumbnail(thumbnailOptions[0].url);
      
      // Navigate to timeline with the new project ID
      if (newProject && newProject.id) {
        navigate(`/timeline?projectId=${newProject.id}`);
      }
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Add details for your new brand project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your brand project"
              className="col-span-3 resize-none"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label>Choose a thumbnail</Label>
            <div className="grid grid-cols-3 gap-3">
              {thumbnailOptions.map((option) => (
                <div 
                  key={option.url}
                  onClick={() => setSelectedThumbnail(option.url)}
                  className={`
                    relative cursor-pointer overflow-hidden h-20 rounded-md border-2
                    ${selectedThumbnail === option.url ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
                  `}
                >
                  <img 
                    src={option.url} 
                    alt={option.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
