import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code2, Github, Sparkles, RefreshCw } from 'lucide-react';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, githubUsername?: string) => void;
  isLoading?: boolean;
}

export const CreateProjectDialog = ({
  open,
  onOpenChange,
  onCreate,
  isLoading = false
}: CreateProjectDialogProps) => {
  const [name, setName] = useState('');
  const [githubUsername, setGithubUsername] = useState('');

  const resetFields = () => {
    setName('');
    setGithubUsername('');
  };

  // Reset fields when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetFields();
    }
    onOpenChange(isOpen);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), githubUsername.trim() || undefined);
    // Note: onOpenChange(false) is now handled by the parent or after success
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-strong sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <Code2 size={24} className="text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Create New DevCard</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Set up your new developer card project
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Project Name
            </Label>
            <Input
              id="name"
              placeholder="My Awesome DevCard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="bg-muted/50 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="text-sm font-medium flex items-center gap-2">
              <Github size={16} />
              GitHub Username
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="github"
              placeholder="octocat"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              disabled={isLoading}
              className="bg-muted/50 border-border focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              We'll fetch your avatar and stats from GitHub
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isLoading}
            className="gap-2 min-w-[140px]"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Create Project
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
