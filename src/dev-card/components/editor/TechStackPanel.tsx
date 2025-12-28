import { useState } from 'react';
import { CardConfig, AVAILABLE_TECH } from '../../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Search, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechStackPanelProps {
  config: CardConfig;
  onUpdate: (updates: Partial<CardConfig>) => void;
}

export const TechStackPanel = ({ config, onUpdate }: TechStackPanelProps) => {
  const [search, setSearch] = useState('');
  
  const filteredTech = AVAILABLE_TECH.filter(tech => 
    tech.toLowerCase().includes(search.toLowerCase()) &&
    !config.techStack.includes(tech)
  );

  const addTech = (tech: string) => {
    if (config.techStack.length < 12) {
      onUpdate({ techStack: [...config.techStack, tech] });
    }
  };

  const removeTech = (tech: string) => {
    onUpdate({ techStack: config.techStack.filter(t => t !== tech) });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Layers size={16} className="text-primary" />
        Tech Stack
      </h3>

      {/* Selected Tech */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Selected ({config.techStack.length}/12)
        </Label>
        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg bg-muted/30 border border-border/50">
          {config.techStack.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              No technologies selected
            </span>
          ) : (
            config.techStack.map(tech => (
              <span
                key={tech}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1',
                  'bg-primary/10 border border-primary/30 rounded-md',
                  'text-xs font-mono text-primary'
                )}
              >
                {tech}
                <button
                  onClick={() => removeTech(tech)}
                  className="hover:text-destructive transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search technologies..."
          className="pl-9 bg-muted/50 border-border focus:border-primary"
        />
      </div>

      {/* Available Tech */}
      <ScrollArea className="h-[200px]">
        <div className="grid grid-cols-3 gap-1.5 pr-4">
          {filteredTech.slice(0, 30).map(tech => (
            <Button
              key={tech}
              size="sm"
              variant="ghost"
              onClick={() => addTech(tech)}
              disabled={config.techStack.length >= 12}
              className={cn(
                'justify-start text-xs font-mono h-8',
                'hover:bg-primary/10 hover:text-primary'
              )}
            >
              <Plus size={12} className="mr-1 shrink-0" />
              <span className="truncate">{tech}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Preview URL */}
      {config.techStack.length > 0 && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground break-all">
            Icons from skillicons.dev
          </p>
        </div>
      )}
    </div>
  );
};
