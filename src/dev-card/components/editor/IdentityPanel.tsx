import { CardConfig } from '../../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Upload, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IdentityPanelProps {
  config: CardConfig;
  onUpdate: (updates: Partial<CardConfig>) => void;
}

export const IdentityPanel = ({ config, onUpdate }: IdentityPanelProps) => {
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const useGitHubAvatar = () => {
    if (config.github?.avatar) {
      onUpdate({ avatar: config.github.avatar });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <User size={16} className="text-primary" />
        Identity
      </h3>

      {/* Avatar */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Profile Picture</Label>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-16 h-16 rounded-xl overflow-hidden',
            'bg-muted border border-border',
            'flex items-center justify-center'
          )}>
            {config.avatar ? (
              <img 
                src={config.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={24} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
              />
              <Button size="sm" variant="outline" asChild>
                <span className="gap-1.5">
                  <Upload size={14} />
                  Upload
                </span>
              </Button>
            </label>
            {config.github?.avatar && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={useGitHubAvatar}
                className="gap-1.5 text-xs"
              >
                <RefreshCw size={12} />
                Use GitHub
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs text-muted-foreground">
          Name / Username
        </Label>
        <Input
          id="name"
          value={config.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Your name"
          className="bg-muted/50 border-border focus:border-primary"
          maxLength={30}
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs text-muted-foreground">
          Title
        </Label>
        <Input
          id="title"
          value={config.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Full Stack Developer"
          className="bg-muted/50 border-border focus:border-primary"
          maxLength={40}
        />
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <Label htmlFor="tagline" className="text-xs text-muted-foreground">
          Tagline
        </Label>
        <Input
          id="tagline"
          value={config.tagline}
          onChange={(e) => onUpdate({ tagline: e.target.value })}
          placeholder="Building the future"
          className="bg-muted/50 border-border focus:border-primary"
          maxLength={60}
        />
        <p className="text-[10px] text-muted-foreground">
          {config.tagline.length}/60 characters
        </p>
      </div>
    </div>
  );
};
