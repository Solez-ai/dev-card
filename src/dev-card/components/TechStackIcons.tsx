import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Theme } from '../types';
import { fetchProxyImage } from '../utils/puter';

interface TechStackIconsProps {
  techs: string[];
  theme: Theme;
  maxDisplay?: number;
}

export const TechStackIcons = ({ techs, theme, maxDisplay = 8 }: TechStackIconsProps) => {
  const displayTechs = techs.slice(0, maxDisplay);
  const isDark = theme !== 'minimal';
  const iconUrl = `https://skillicons.dev/icons?i=${displayTechs.join(',')}&theme=${isDark ? 'dark' : 'light'}`;

  const [imgSrc, setImgSrc] = useState(iconUrl);

  useEffect(() => {
    let mounted = true;

    // Reset to URL on change, then fetch proxy
    setImgSrc(iconUrl);

    const loadProxyImage = async () => {
      // Small delay to debounce rapid changes
      await new Promise(r => setTimeout(r, 500));
      if (!mounted) return;

      if (displayTechs.length > 0) {
        const dataUrl = await fetchProxyImage(iconUrl);
        if (mounted) setImgSrc(dataUrl);
      }
    };

    loadProxyImage();

    return () => {
      mounted = false;
    };
  }, [iconUrl, displayTechs.length]);

  if (displayTechs.length === 0) {
    return (
      <div className="text-muted-foreground text-sm font-mono">
        No tech stack selected
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      <img
        src={imgSrc}
        alt="Tech Stack"
        className={cn(
          'h-10 object-contain',
          'filter drop-shadow-lg'
        )}
        loading="lazy"
        crossOrigin="anonymous"
      />
      {techs.length > maxDisplay && (
        <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
          +{techs.length - maxDisplay} more
        </span>
      )}
    </div>
  );
};
