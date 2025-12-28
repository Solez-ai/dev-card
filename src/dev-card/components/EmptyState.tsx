import { Code2, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  onCreate: () => void;
}

export const EmptyState = ({ onCreate }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Animated Icon */}
      <div className="relative mb-8 group cursor-pointer" onClick={onCreate}>
        <div className={cn(
          'w-48 h-64 rounded-2xl',
          'bg-card border-2 border-dashed border-muted-foreground/25',
          'flex flex-col items-center justify-center gap-4',
          'group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300',
          'animate-float shadow-xl'
        )}>
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Plus size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="space-y-2 w-full px-6">
            <div className="h-2 w-2/3 bg-muted/50 rounded-full mx-auto" />
            <div className="h-2 w-full bg-muted/30 rounded-full" />
            <div className="h-2 w-4/5 bg-muted/30 rounded-full mx-auto" />
          </div>
        </div>

        {/* Glow behind */}
        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </div>

      <h2 className="text-3xl font-bold mb-3 gradient-text">
        Welcome to DevCard
      </h2>

      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        Create stunning developer cards to showcase your skills,
        tech stack, and achievements. Share them anywhere!
      </p>

      <Button
        size="lg"
        onClick={onCreate}
        className="gap-2 text-lg px-8 py-6 glow-primary"
      >
        <Plus size={20} />
        Create Your First DevCard
      </Button>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl">
        {[
          { icon: '⚡', title: 'Instant Preview', desc: 'See changes in real-time' },
          { icon: '🎨', title: '4 Themes', desc: 'From hacker to minimal' },
          { icon: '📤', title: 'Easy Export', desc: 'PNG, SVG, or share link' },
        ].map((feature, i) => (
          <div
            key={i}
            className={cn(
              'p-4 rounded-xl',
              'bg-muted/30 border border-border/50',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
          >
            <Sparkles size={24} className="text-primary mb-2" />
            <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
