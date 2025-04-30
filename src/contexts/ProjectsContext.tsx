
import React, { createContext, useContext, useState } from 'react';
import { Project, ProjectStatus, Collaborator } from '@/types/project';
import { toast } from "@/components/ui/sonner";

// Sample data for initial projects
const mockCollaborators: Collaborator[] = [
  { id: '1', name: 'Alex Morgan', initials: 'AM' },
  { id: '2', name: 'Taylor Swift', initials: 'TS' },
  { id: '3', name: 'Jordan Lee', initials: 'JL' },
  { id: '4', name: 'Casey Johnson', initials: 'CJ' },
  { id: '5', name: 'Morgan Freeman', initials: 'MF' },
];

// Initialize with some dummy projects
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Refresh Beverage Co.',
    description: 'Brand identity for organic juice line targeting urban professionals.',
    thumbnail: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-04-01'),
    progress: 85,
    status: 'active',
    collaborators: [mockCollaborators[0], mockCollaborators[1]],
  },
  {
    id: '2',
    name: 'NexTech Solutions',
    description: 'Complete rebrand for a growing SaaS company focusing on AI tools.',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-03-25'),
    progress: 60,
    status: 'active',
    collaborators: [mockCollaborators[2], mockCollaborators[3], mockCollaborators[0]],
  },
  {
    id: '3',
    name: 'EcoSustain Products',
    description: 'Sustainable packaging brand identity for eco-conscious consumers.',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-04-10'),
    progress: 40,
    status: 'active',
    collaborators: [mockCollaborators[1], mockCollaborators[4]],
  },
  {
    id: '4',
    name: 'Metropolitan Gallery',
    description: 'Brand refresh for a contemporary art space expanding to digital experiences.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    createdAt: new Date('2025-02-28'),
    updatedAt: new Date('2025-03-15'),
    progress: 100,
    status: 'completed',
    collaborators: [mockCollaborators[0], mockCollaborators[3], mockCollaborators[4]],
  },
  {
    id: '5',
    name: 'Astral Coffee Shop',
    description: 'Branding for a new coffee chain with an astronomy theme.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-04-15'),
    progress: 25,
    status: 'paused',
    collaborators: [mockCollaborators[2]],
  },
  {
    id: '6',
    name: 'Solace Wellness',
    description: 'Brand system for a holistic health and meditation studio.',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    createdAt: new Date('2025-03-20'),
    updatedAt: new Date('2025-04-10'),
    progress: 15,
    status: 'draft',
    collaborators: [mockCollaborators[0], mockCollaborators[1], mockCollaborators[4]],
  },
];

interface ProjectsContextType {
  projects: Project[];
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const createProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    
    setProjects((prevProjects) => [...prevProjects, newProject]);
    toast.success("Project created successfully!");
    return newProject;
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id
          ? { ...updatedProject, updatedAt: new Date() }
          : project
      )
    );
    toast.success("Project updated successfully!");
  };

  const deleteProject = (id: string) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
    toast.success("Project deleted successfully!");
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, createProject, updateProject, deleteProject, getProject }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
