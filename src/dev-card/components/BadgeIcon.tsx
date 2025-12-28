import { GitBranch, Flame, Rocket, Trophy, Brain, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  GitBranch,
  Flame,
  Rocket,
  Trophy,
  Brain,
};

export const BadgeIcon = ({ iconName, size = 16, className }: BadgeIconProps) => {
  const Icon = iconMap[iconName] || GitBranch;
  
  return (
    <Icon 
      size={size} 
      className={cn('text-current', className)} 
    />
  );
};
