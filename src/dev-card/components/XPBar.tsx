import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface XPBarProps {
  level: number;
  xp: number;
  maxXp: number;
  animated?: boolean;
}

export const XPBar = ({ level, xp, maxXp, animated = true }: XPBarProps) => {
  const percentage = Math.min((xp / maxXp) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-primary fill-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
          <span className="font-mono font-bold text-foreground">
            Level {level}
          </span>
        </div>
        <span className="font-mono text-sm text-muted-foreground">
          {xp.toLocaleString()} / {maxXp.toLocaleString()} XP
        </span>
      </div>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            'bg-gradient-to-r from-primary via-secondary to-primary',
            'bg-[length:200%_100%]',
            animated && 'animate-gradient-shift'
          )}
          style={{ 
            width: `${percentage}%`,
            transition: 'width 0.5s ease-out'
          }}
        />
        <div 
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            'bg-white/20',
            animated && 'shimmer'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
