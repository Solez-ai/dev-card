import { Rarity } from '../types';
import { Gem, Star, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const rarityConfig = {
  common: {
    icon: Star,
    label: 'Common',
    gradient: 'from-zinc-400 to-zinc-600',
    glow: 'shadow-zinc-500/30',
    textColor: 'text-zinc-300',
  },
  rare: {
    icon: Gem,
    label: 'Rare',
    gradient: 'from-blue-400 to-cyan-500',
    glow: 'shadow-blue-500/40',
    textColor: 'text-blue-300',
  },
  epic: {
    icon: Sparkles,
    label: 'Epic',
    gradient: 'from-purple-400 to-pink-500',
    glow: 'shadow-purple-500/40',
    textColor: 'text-purple-300',
  },
  legendary: {
    icon: Crown,
    label: 'Legendary',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    glow: 'shadow-yellow-500/50',
    textColor: 'text-yellow-300',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 18,
};

export const RarityBadge = ({ rarity, size = 'md', showLabel = true }: RarityBadgeProps) => {
  const config = rarityConfig[rarity];
  const Icon = config.icon;
  
  return (
    <div 
      className={cn(
        'inline-flex items-center font-mono font-semibold rounded-full',
        'bg-gradient-to-r backdrop-blur-sm border border-white/10',
        config.gradient,
        sizeClasses[size],
        rarity === 'legendary' && 'animate-pulse-glow'
      )}
    >
      <Icon size={iconSizes[size]} className="drop-shadow-lg" />
      {showLabel && (
        <span className="drop-shadow-lg">{config.label}</span>
      )}
    </div>
  );
};
