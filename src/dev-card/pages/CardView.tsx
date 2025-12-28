import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DevCardPreview } from '../components/DevCardPreview';
import { getProject } from '../utils/storage';
import { DevCardProject } from '../types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code2, Edit3, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<DevCardProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getProject(id);
      if (found) {
        setProject(found);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Loader2 size={32} className="text-primary animate-spin" />
          <span className="text-lg text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Code2 size={64} className="text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Card Not Found</h1>
        <p className="text-muted-foreground mb-6">This DevCard doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft size={18} />
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const themeClass = {
    hacker: '',
    cyberpunk: 'theme-cyberpunk',
    minimal: 'theme-minimal',
    retro: 'theme-retro',
  }[project.config.theme];

  return (
    <div className={cn('min-h-screen bg-background', themeClass)}>
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 noise pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 size={24} className="text-primary" />
            <span className="font-semibold text-foreground">{project.name}</span>
          </div>
          <Button 
            onClick={() => navigate(`/editor/${project.id}`)} 
            variant="outline"
            className="gap-2"
          >
            <Edit3 size={16} />
            Edit
          </Button>
        </div>
      </header>

      {/* Card Display */}
      <main className="relative flex items-center justify-center min-h-[calc(100vh-73px)] p-8">
        <div className="animate-scale-in">
          <DevCardPreview
            config={project.config}
            rarity={project.rarity}
          />
        </div>
      </main>
    </div>
  );
};
