import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevCardStore } from '../hooks/useDevCardStore';
import { ProjectCard } from '../components/ProjectCard';
import { EmptyState } from '../components/EmptyState';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Code2, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    projects,
    isLoading: isStoreLoading,
    createNewProject,
    deleteProject,
    duplicateProject
  } = useDevCardStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: '',
  });

  const handleCreate = async (name: string, githubUsername?: string) => {
    setIsCreating(true);
    toast({
      title: "Creating your DevCard...",
      description: githubUsername ? `Fetching data for @${githubUsername}` : "Initializing project",
    });

    try {
      const project = await createNewProject(name, githubUsername);
      navigate(`/editor/${project.id}`);
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Something went wrong while creating the project.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleDuplicate = (id: string) => {
    const newProject = duplicateProject(id);
    if (newProject) {
      navigate(`/editor/${newProject.id}`);
    }
  };

  const handleDeleteConfirm = () => {
    deleteProject(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', name: '' });
  };

  if (isStoreLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Code2 size={32} className="text-primary animate-spin" />
          <span className="text-lg text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/30">
              <Code2 size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight gradient-text">DevCard</h1>
              <p className="text-xs text-muted-foreground font-mono">Developer Identity Cards</p>
            </div>
          </div>

          {projects.length > 0 && (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 glow-primary"
            >
              <Plus size={18} />
              New Project
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <EmptyState onCreate={() => setCreateDialogOpen(true)} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Your Projects</h2>
                <p className="text-sm text-muted-foreground">
                  {projects.length} DevCard{projects.length !== 1 ? 's' : ''} created
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProjectCard
                    project={project}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={(id) => setDeleteDialog({
                      open: true,
                      id,
                      name: project.name
                    })}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/40 bg-card/20 backdrop-blur-md mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-6">
            
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/Solez_None"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                aria-label="Twitter"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              <a
                href="https://github.com/Solez-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                aria-label="GitHub"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Made by{' '}
                <a
                  href="https://solez.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                  Samin Yeasar [Solez-ai]
                </a>
              </p>
              <p className="text-xs text-muted-foreground/50">
                &copy; {new Date().getFullYear()} DevCard. Open Source Project.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreate}
        isLoading={isCreating}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirm}
        projectName={deleteDialog.name}
      />
    </div>
  );
};
