import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDevCardStore } from '../hooks/useDevCardStore';
import { DevCardPreview } from '../components/DevCardPreview';
import { IdentityPanel } from '../components/editor/IdentityPanel';
import { TechStackPanel } from '../components/editor/TechStackPanel';
import { StatsPanel } from '../components/editor/StatsPanel';
import { GitHubPanel } from '../components/editor/GitHubPanel';
import { BadgesPanel } from '../components/editor/BadgesPanel';
import { ThemePanel } from '../components/editor/ThemePanel';
import { ExportPanel } from '../components/editor/ExportPanel';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Code2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardConfig } from '../types';
export const Editor = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    currentProject,
    loadProject,
    updateConfig
  } = useDevCardStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (id) {
      const project = loadProject(id);
      if (!project) {
        navigate('/');
      }
      setIsLoading(false);
    }
  }, [id, loadProject, navigate]);
  const handleUpdate = (updates: Partial<CardConfig>) => {
    updateConfig(updates);
  };
  if (isLoading || !currentProject) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <Loader2 size={32} className="text-primary animate-spin" />
        <span className="text-lg text-muted-foreground">Loading editor...</span>
      </div>
    </div>;
  }
  const themeClass = {
    hacker: '',
    cyberpunk: 'theme-cyberpunk',
    minimal: 'theme-minimal',
    retro: 'theme-retro'
  }[currentProject.config.theme];
  return <div className={cn('min-h-screen bg-background', themeClass)}>
    {/* Background */}
    <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
    <div className="fixed inset-0 noise pointer-events-none" />

    {/* Header */}
    <header className="relative border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft size={18} />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-primary" />
            <span className="font-semibold text-foreground truncate max-w-[200px]">
              {currentProject.name}
            </span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          Auto-saved
        </div>
      </div>
    </header>

    {/* Editor Layout */}
    <div className="relative flex w-full h-[calc(100vh-57px)] overflow-hidden">
      {/* Left Panel - Controls */}
      <aside className="w-[320px] flex-none border-r border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-6 w-[320px] max-w-full overflow-x-hidden">
            <IdentityPanel config={currentProject.config} onUpdate={handleUpdate} />
            <Separator />
            <TechStackPanel config={currentProject.config} onUpdate={handleUpdate} />
            <Separator />
            <StatsPanel config={currentProject.config} onUpdate={handleUpdate} />
            <Separator />
            <GitHubPanel config={currentProject.config} onUpdate={handleUpdate} />
            <Separator />
            <BadgesPanel config={currentProject.config} onUpdate={handleUpdate} />
          </div>
        </ScrollArea>
      </aside>

      {/* Center - Card Preview */}
      <main className="flex-1 min-w-0 flex items-center justify-center p-8 overflow-auto bg-muted/5 relative">
        <div className="animate-scale-in">
          <DevCardPreview ref={cardRef} config={currentProject.config} rarity={currentProject.rarity} />
        </div>
      </main>

      {/* Right Panel - Theme & Export */}
      <aside className="w-[320px] flex-none border-l border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-6 w-[320px] max-w-full overflow-x-hidden">
            <ThemePanel config={currentProject.config} onUpdate={handleUpdate} />
            <Separator />
            <ExportPanel cardRef={cardRef} projectId={currentProject.id} projectName={currentProject.name} />
          </div>
        </ScrollArea>
      </aside>
    </div>
  </div>;
};