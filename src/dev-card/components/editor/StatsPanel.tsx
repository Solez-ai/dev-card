import { CardConfig, StatsMode } from '../../types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { SkillStars } from '../SkillStars';
import { BarChart3, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  config: CardConfig;
  onUpdate: (updates: Partial<CardConfig>) => void;
}

export const StatsPanel = ({ config, onUpdate }: StatsPanelProps) => {
  const setStatsMode = (mode: StatsMode) => {
    onUpdate({ statsMode: mode });
  };

  const updateSkillStat = (skill: keyof typeof config.skillStats, value: number) => {
    onUpdate({
      skillStats: {
        ...config.skillStats,
        [skill]: value,
      },
    });
  };

  const updateXPStat = (key: keyof typeof config.xpStats, value: number) => {
    onUpdate({
      xpStats: {
        ...config.xpStats,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <BarChart3 size={16} className="text-primary" />
        Stats Mode
      </h3>

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setStatsMode('stars')}
          className={cn(
            'flex items-center justify-center gap-2 p-3 rounded-lg',
            'border transition-all duration-200',
            config.statsMode === 'stars'
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/50'
          )}
        >
          <Star size={18} className={config.statsMode === 'stars' ? 'fill-current' : ''} />
          <span className="text-sm font-medium">Star Rating</span>
        </button>
        <button
          onClick={() => setStatsMode('xp')}
          className={cn(
            'flex items-center justify-center gap-2 p-3 rounded-lg',
            'border transition-all duration-200',
            config.statsMode === 'xp'
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/50'
          )}
        >
          <Zap size={18} className={config.statsMode === 'xp' ? 'fill-current' : ''} />
          <span className="text-sm font-medium">XP Mode</span>
        </button>
      </div>

      {/* Star Rating Mode */}
      {config.statsMode === 'stars' && (
        <div className="space-y-3 pt-2">
          <SkillStars
            label="Problem Solving"
            value={config.skillStats.problemSolving}
            onChange={(v) => updateSkillStat('problemSolving', v)}
          />
          <SkillStars
            label="Backend"
            value={config.skillStats.backend}
            onChange={(v) => updateSkillStat('backend', v)}
          />
          <SkillStars
            label="Frontend"
            value={config.skillStats.frontend}
            onChange={(v) => updateSkillStat('frontend', v)}
          />
          <SkillStars
            label="Debugging"
            value={config.skillStats.debugging}
            onChange={(v) => updateSkillStat('debugging', v)}
          />
        </div>
      )}

      {/* XP Mode */}
      {config.statsMode === 'xp' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">Level</Label>
              <span className="text-xs font-mono text-primary">{config.xpStats.level}</span>
            </div>
            <Slider
              value={[config.xpStats.level]}
              onValueChange={([v]) => updateXPStat('level', v)}
              min={1}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">Current XP</Label>
              <span className="text-xs font-mono text-primary">{config.xpStats.xp.toLocaleString()}</span>
            </div>
            <Slider
              value={[config.xpStats.xp]}
              onValueChange={([v]) => updateXPStat('xp', v)}
              min={0}
              max={config.xpStats.maxXp}
              step={100}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">Max XP</Label>
              <span className="text-xs font-mono text-primary">{config.xpStats.maxXp.toLocaleString()}</span>
            </div>
            <Slider
              value={[config.xpStats.maxXp]}
              onValueChange={([v]) => updateXPStat('maxXp', v)}
              min={1000}
              max={100000}
              step={1000}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">Years Experience</Label>
              <span className="text-xs font-mono text-primary">{config.xpStats.yearsExperience}</span>
            </div>
            <Slider
              value={[config.xpStats.yearsExperience]}
              onValueChange={([v]) => updateXPStat('yearsExperience', v)}
              min={0}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
