import { DevCardProject } from '../types';
import { RarityBadge } from './RarityBadge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Edit3, Copy, Trash2, Code2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: DevCardProject;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ 
  project, 
  onEdit, 
  onDuplicate, 
  onDelete 
}: ProjectCardProps) => {
  const themeClass = {
    hacker: '',
    cyberpunk: 'theme-cyberpunk',
    minimal: 'theme-minimal',
    retro: 'theme-retro',
  }[project.config.theme];

  return (
    <div className={cn(themeClass)}>
      <div
        className={cn(
          'group relative overflow-hidden rounded-xl',
          'bg-card border border-border/50',
          'transition-all duration-300',
          'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
          'hover:-translate-y-1'
        )}
      >
        {/* Preview Thumbnail */}
        <div 
          className={cn(
            'relative aspect-[4/3] p-4',
            'bg-gradient-to-br from-muted/50 to-muted',
            'border-b border-border/50'
          )}
        >
          {/* Mini Card Preview */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div 
              className={cn(
                'w-24 h-32 rounded-lg',
                'bg-card border border-border/50',
                'flex flex-col items-center justify-center gap-2',
                'shadow-lg',
                project.rarity === 'legendary' && 'animate-pulse-glow'
              )}
            >
              <Code2 size={24} className="text-primary" />
              <div className="w-12 h-1 bg-primary/30 rounded-full" />
              <div className="w-8 h-1 bg-primary/20 rounded-full" />
            </div>
          </div>

          {/* Rarity Badge */}
          <div className="absolute top-3 right-3">
            <RarityBadge rarity={project.rarity} size="sm" showLabel={false} />
          </div>

          {/* Theme indicator */}
          <div className="absolute bottom-3 left-3">
            <span className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded-full',
              'bg-background/80 backdrop-blur-sm text-muted-foreground'
            )}>
              {project.config.theme}
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate mb-1">
            {project.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>
              {formatDistanceToNow(new Date(project.lastEdited), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Actions Overlay */}
        <div className={cn(
          'absolute inset-0 bg-background/90 backdrop-blur-sm',
          'flex items-center justify-center gap-2',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        )}>
          <Button
            size="sm"
            variant="default"
            onClick={() => onEdit(project.id)}
            className="gap-1.5"
          >
            <Edit3 size={14} />
            Edit
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onDuplicate(project.id)}
            className="gap-1.5"
          >
            <Copy size={14} />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(project.id)}
            className="gap-1.5"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};
