import { CardConfig, AVAILABLE_BADGES } from '../../types';
import { Label } from '@/components/ui/label';
import { BadgeIcon } from '../BadgeIcon';
import { Award, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgesPanelProps {
  config: CardConfig;
  onUpdate: (updates: Partial<CardConfig>) => void;
}

export const BadgesPanel = ({ config, onUpdate }: BadgesPanelProps) => {
  const toggleBadge = (badgeId: string) => {
    const isSelected = config.selectedBadges.includes(badgeId);
    
    if (isSelected) {
      onUpdate({
        selectedBadges: config.selectedBadges.filter(id => id !== badgeId),
      });
    } else if (config.selectedBadges.length < 3) {
      onUpdate({
        selectedBadges: [...config.selectedBadges, badgeId],
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Award size={16} className="text-primary" />
        Badges
      </h3>

      <Label className="text-xs text-muted-foreground">
        Select up to 3 badges ({config.selectedBadges.length}/3)
      </Label>

      <div className="space-y-2">
        {AVAILABLE_BADGES.map(badge => {
          const isSelected = config.selectedBadges.includes(badge.id);
          const isDisabled = !isSelected && config.selectedBadges.length >= 3;
          
          return (
            <button
              key={badge.id}
              onClick={() => toggleBadge(badge.id)}
              disabled={isDisabled}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg',
                'border transition-all duration-200',
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted/30 border-border hover:border-primary/50',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                isSelected ? 'bg-primary/20' : 'bg-muted'
              )}>
                <BadgeIcon 
                  iconName={badge.icon} 
                  size={20} 
                  className={isSelected ? 'text-primary' : 'text-muted-foreground'}
                />
              </div>
              
              <div className="flex-1 text-left">
                <div className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-primary' : 'text-foreground'
                )}>
                  {badge.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {badge.description}
                </div>
              </div>

              {isSelected && (
                <Check size={18} className="text-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
