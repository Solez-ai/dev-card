import { useState } from 'react';
import { CardConfig } from '../../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { fetchGitHubData } from '../../utils/github';
import { Github, RefreshCw, Check, AlertCircle, GitFork, Star, Flame, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface GitHubPanelProps {
  config: CardConfig;
  onUpdate: (updates: Partial<CardConfig>) => void;
}

export const GitHubPanel = ({ config, onUpdate }: GitHubPanelProps) => {
  const [username, setUsername] = useState(config.github?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      const data = await fetchGitHubData(username.trim());
      onUpdate({
        github: data,
        techStack: data.topLanguages.map((l: string) => l.toLowerCase())
      });
      toast({
        title: 'GitHub synced!',
        description: `Fetched data for @${username}`,
      });
    } catch (error) {
      toast({
        title: 'Sync failed',
        description: 'Could not fetch GitHub data. Check the username.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearGitHub = () => {
    onUpdate({ github: null });
    setUsername('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Github size={16} className="text-primary" />
        GitHub Integration
      </h3>

      {/* Username Input */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Username</Label>
        <div className="flex gap-2">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && username.trim()) {
                handleSync();
              }
            }}
            placeholder="octocat"
            className="bg-muted/50 border-border focus:border-primary"
          />
          <Button
            onClick={handleSync}
            disabled={isLoading || !username.trim()}
            size="sm"
            className="shrink-0"
          >
            {isLoading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
          </Button>
        </div>
      </div>

      {/* GitHub Data Display */}
      {config.github && (
        <div className="space-y-3 p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={config.github.avatar}
                alt={config.github.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                  @{config.github.username}
                  <Check size={14} className="text-green-500" />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Synced {formatDistanceToNow(new Date(config.github.lastSynced), { addSuffix: true })}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearGitHub}
              className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
            >
              <AlertCircle size={14} />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-foreground font-bold">
                <GitFork size={14} />
                {config.github.repoCount}
              </div>
              <div className="text-[10px] text-muted-foreground">Repos</div>
            </div>
            <div className="text-center p-2 rounded bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-foreground font-bold">
                <Star size={14} className="fill-current text-yellow-500" />
                {config.github.stars}
              </div>
              <div className="text-[10px] text-muted-foreground">Stars</div>
            </div>
            <div className="text-center p-2 rounded bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-foreground font-bold">
                <Flame size={14} className="text-orange-500" />
                {config.github.contributionStreak}
              </div>
              <div className="text-[10px] text-muted-foreground">Streak</div>
            </div>
          </div>

          {/* Top Languages */}
          {config.github.topLanguages.length > 0 && (
            <div>
              <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                <Code size={10} />
                Top Languages
              </div>
              <div className="flex flex-wrap gap-1">
                {config.github.topLanguages.map(lang => (
                  <span
                    key={lang}
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-mono',
                      'bg-primary/10 text-primary border border-primary/30'
                    )}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!config.github && (
        <div className="p-4 rounded-lg bg-muted/20 border border-dashed border-border text-center">
          <Github size={24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Connect your GitHub to display<br />repos, stars, and streak
          </p>
        </div>
      )}
    </div>
  );
};
