import { forwardRef, useState, useEffect } from 'react';
import { CardConfig, Rarity, AVAILABLE_BADGES } from '../types';
import { RarityBadge } from './RarityBadge';
import { SkillStars } from './SkillStars';
import { XPBar } from './XPBar';
import { TechStackIcons } from './TechStackIcons';
import { BadgeIcon } from './BadgeIcon';
import { cn } from '@/lib/utils';
import { fetchProxyImage } from '../utils/imageProxy';
import { Github, Code2, Star, GitFork, Flame, User } from 'lucide-react';

interface DevCardPreviewProps {
  config: CardConfig;
  rarity: Rarity;
  className?: string;
  useProxy?: boolean;
}

export const DevCardPreview = forwardRef<HTMLDivElement, DevCardPreviewProps>(
  ({ config, rarity, className, useProxy = false }, ref) => {
    // ... [No changes to helpers] ...
    const themeClass = {
      hacker: '',
      cyberpunk: 'theme-cyberpunk',
      minimal: 'theme-minimal',
      retro: 'theme-retro',
    }[config.theme];

    const shapeClass = {
      rounded: 'rounded-2xl',
      sharp: 'rounded-none',
      glass: 'rounded-3xl',
    }[config.cardShape];

    const selectedBadges = AVAILABLE_BADGES.filter(b =>
      config.selectedBadges.includes(b.id)
    ).slice(0, 3);

    const hasGitHub = !!config.github;
    const hasBadges = selectedBadges.length > 0;
    const needsExtraHeight = hasGitHub && hasBadges;

    const [avatarSrc, setAvatarSrc] = useState(config.avatar || config.github?.avatar || '');

    useEffect(() => {
      const url = config.avatar || config.github?.avatar;
      if (!url) return;

      let mounted = true;

      // Update immediately
      setAvatarSrc(url);

      if (!useProxy) return;

      const loadProxy = async () => {
        const proxyUrl = await fetchProxyImage(url);
        if (mounted) setAvatarSrc(proxyUrl);
      };

      loadProxy();
      return () => { mounted = false; };
    }, [config.avatar, config.github?.avatar, useProxy]);

    return (
      <div className={cn(themeClass, className)}>
        {/* ... [Wrapper div] ... */}
        <div
          ref={ref}
          className={cn(
            'relative w-[380px] p-6',
            needsExtraHeight ? 'min-h-[580px]' : 'aspect-[3/4]',
            'bg-card border-2 border-border/50',
            shapeClass,
            config.cardShape === 'glass' && 'glass backdrop-blur-xl',
            config.theme === 'retro' && 'scanlines',
            'shadow-2xl'
          )}
          style={{
            boxShadow: `0 0 60px hsl(var(--primary) / 0.15), 0 0 100px hsl(var(--primary) / 0.1)`
          }}
        >
          {/* ... [Backgrounds] ... */}
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
          <div className="absolute inset-0 noise pointer-events-none" />
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/20 via-transparent to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Code2 size={20} className="text-primary" />
                <span className="font-mono text-xs text-muted-foreground tracking-wider">
                  DEV.CARD
                </span>
              </div>
              <RarityBadge rarity={rarity} size="sm" />
            </div>

            {/* Identity Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className={cn(
                'w-16 h-16 rounded-xl overflow-hidden',
                'bg-muted border-2 border-primary/30',
                'flex items-center justify-center',
                'shadow-lg',
                config.theme === 'retro' && 'rounded-none'
              )}>
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={config.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={cn(
                  'text-xl font-bold truncate text-foreground',
                  config.fontStyle === 'mono' ? 'font-mono' : 'font-outfit'
                )}>
                  {config.name || 'Developer'}
                </h2>
                <p className="text-sm font-medium text-primary truncate">
                  {config.title || 'Full Stack Developer'}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {config.tagline || 'Building the future'}
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <div className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                Tech Stack
              </div>
              <TechStackIcons
                techs={config.techStack}
                theme={config.theme}
                useProxy={useProxy}
              />
            </div>

            {/* Stats Section */}
            <div className="flex-1">
              <div className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">
                {config.statsMode === 'stars' ? 'Skills' : 'Experience'}
              </div>

              {config.statsMode === 'stars' ? (
                <div className="space-y-2">
                  <SkillStars label="Problem Solving" value={config.skillStats.problemSolving} readonly />
                  <SkillStars label="Backend" value={config.skillStats.backend} readonly />
                  <SkillStars label="Frontend" value={config.skillStats.frontend} readonly />
                  <SkillStars label="Debugging" value={config.skillStats.debugging} readonly />
                </div>
              ) : (
                <XPBar
                  level={config.xpStats.level}
                  xp={config.xpStats.xp}
                  maxXp={config.xpStats.maxXp}
                />
              )}
            </div>

            {/* Bottom AchievementsSection */}
            {(config.github || selectedBadges.length > 0) && (
              <div className="mt-auto pt-4 space-y-3">
                {/* GitHub Stats */}
                {config.github && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-primary/10">
                      <div className="flex items-center gap-2">
                        <Github size={14} className="text-primary" />
                        <span className="text-[10px] font-bold font-mono text-primary/80 tracking-tight">
                          GITHUB.STATS
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        @{config.github.username}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-center gap-1 text-foreground font-black text-xs">
                          {config.github.repoCount}
                        </div>
                        <div className="text-[9px] uppercase tracking-tighter text-muted-foreground font-medium">Repos</div>
                      </div>
                      <div className="space-y-0.5 border-x border-primary/10">
                        <div className="flex items-center justify-center gap-1 text-foreground font-black text-xs">
                          <Star size={10} className="fill-current text-yellow-500" />
                          {config.github.stars}
                        </div>
                        <div className="text-[9px] uppercase tracking-tighter text-muted-foreground font-medium">Stars</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-center gap-1 text-foreground font-black text-xs">
                          <Flame size={10} className="text-orange-500" />
                          {config.github.contributionStreak}
                        </div>
                        <div className="text-[9px] uppercase tracking-tighter text-muted-foreground font-medium">Streak</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Badges */}
                {selectedBadges.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedBadges.map(badge => (
                      <div
                        key={badge.id}
                        className={cn(
                          'flex items-center gap-1.5 px-2 py-1 rounded-full',
                          'bg-primary/10 border border-primary/20',
                          'text-[10px] font-bold font-mono text-primary uppercase tracking-tighter',
                          'shadow-sm sm:px-3'
                        )}
                        title={badge.description}
                      >
                        <BadgeIcon iconName={badge.icon} size={10} />
                        <span>{badge.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Border Glow Effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-inherit pointer-events-none',
              'border-2 border-transparent',
              rarity === 'legendary' && 'animate-pulse-border'
            )}
            style={{
              borderRadius: 'inherit'
            }}
          />
        </div>
      </div>
    );
  }
);

DevCardPreview.displayName = 'DevCardPreview';
