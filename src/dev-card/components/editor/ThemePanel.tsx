import { CardConfig, Theme, CardShape } from '../../types';
import { Label } from '@/components/ui/label';
import { Palette, Square, Circle, Hexagon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemePanelProps {
  config: CardConfig;
  onUpdate: (updates: Partial<CardConfig>) => void;
}

const themes: { id: Theme; name: string; preview: string; accent: string }[] = [
  { id: 'hacker', name: 'Dark Hacker', preview: 'bg-[#0a0f0a]', accent: 'border-green-500' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk', preview: 'bg-[#1a0a1a]', accent: 'border-pink-500' },
  { id: 'minimal', name: 'Minimal Clean', preview: 'bg-[#fafafa]', accent: 'border-blue-500' },
  { id: 'retro', name: 'Retro Terminal', preview: 'bg-[#0f0805]', accent: 'border-amber-500' },
];

const shapes: { id: CardShape; name: string; icon: typeof Square }[] = [
  { id: 'rounded', name: 'Rounded', icon: Circle },
  { id: 'sharp', name: 'Sharp', icon: Square },
  { id: 'glass', name: 'Glass', icon: Hexagon },
];

const fontStyles: { id: 'mono' | 'futuristic'; name: string }[] = [
  { id: 'mono', name: 'Monospace' },
  { id: 'futuristic', name: 'Futuristic' },
];

export const ThemePanel = ({ config, onUpdate }: ThemePanelProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Palette size={16} className="text-primary" />
        Theme & Style
      </h3>

      {/* Theme Selection */}
      <div className="space-y-2 min-w-0">
        <Label className="text-xs text-muted-foreground">Theme</Label>
        <div className="grid grid-cols-1 gap-2 w-full">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => onUpdate({ theme: theme.id })}
              className={cn(
                'relative p-3 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3',
                config.theme === theme.id
                  ? cn('border-primary', theme.accent)
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn(
                'w-12 h-10 rounded-md shrink-0',
                theme.preview,
                'border border-white/10'
              )} />
              <span className={cn(
                'text-xs font-medium truncate',
                config.theme === theme.id ? 'text-primary' : 'text-foreground'
              )}>
                {theme.name}
              </span>
              {config.theme === theme.id && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card Shape */}
      <div className="space-y-2 min-w-0">
        <Label className="text-xs text-muted-foreground">Card Shape</Label>
        <div className="grid grid-cols-3 gap-2 w-full">
          {shapes.map(shape => {
            const Icon = shape.icon;
            return (
              <button
                key={shape.id}
                onClick={() => onUpdate({ cardShape: shape.id })}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg',
                  'border transition-all duration-200',
                  config.cardShape === shape.id
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/50'
                )}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{shape.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Style */}
      <div className="space-y-2 min-w-0">
        <Label className="text-xs text-muted-foreground">Font Style</Label>
        <div className="grid grid-cols-2 gap-2 w-full">
          {fontStyles.map(font => (
            <button
              key={font.id}
              onClick={() => onUpdate({ fontStyle: font.id })}
              className={cn(
                'flex items-center justify-center gap-2 p-2 rounded-lg',
                'border transition-all duration-200',
                config.fontStyle === font.id
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/50',
                font.id === 'mono' ? 'font-mono' : 'font-outfit'
              )}
            >
              <Monitor size={14} />
              <span className="text-xs font-medium">{font.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
