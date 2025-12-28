import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillStarsProps {
  label: string;
  value: number;
  maxValue?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export const SkillStars = ({ 
  label, 
  value, 
  maxValue = 5, 
  onChange, 
  readonly = false 
}: SkillStarsProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-mono text-muted-foreground min-w-[100px]">
        {label}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: maxValue }).map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              'transition-all duration-200 hover:scale-110',
              readonly && 'cursor-default'
            )}
          >
            <Star
              size={18}
              className={cn(
                'transition-all duration-300',
                i < value 
                  ? 'fill-primary text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]' 
                  : 'text-muted-foreground/30'
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
