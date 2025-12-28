import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Theme } from '../types';
import { fetchProxyImage } from '../utils/puter';

interface TechStackIconsProps {
  techs: string[];
  theme: Theme;
  maxDisplay?: number;
  useProxy?: boolean;
}

export const TechStackIcons = ({ techs, theme, maxDisplay = 8, useProxy = false }: TechStackIconsProps) => {
  const displayTechs = techs.slice(0, maxDisplay);
  const isDark = theme !== 'minimal';
  const iconUrl = `https://skillicons.dev/icons?i=${displayTechs.join(',')}&theme=${isDark ? 'dark' : 'light'}`;

  const [imgSrc, setImgSrc] = useState<string>(iconUrl);

  useEffect(() => {
    let mounted = true;

    // Reset to URL on change, then fetch proxy


    const loadProxyImage = async () => {
      // Small delay to debounce rapid changes
      if (!useProxy) return;

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
  }, [iconUrl, displayTechs.length, useProxy]);

  if (displayTechs.length === 0) {
    return (
      <div className="text-muted-foreground text-sm font-mono">
        No tech stack selected
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center min-h-[40px]">
      <img
        src={imgSrc}
        alt="Tech Stack"
        className={cn(
          'h-10 object-contain',
          'filter drop-shadow-lg'
        )}
        loading="lazy"
      />
      {techs.length > maxDisplay && (
        <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
          +{techs.length - maxDisplay} more
        </span>
      )}
    </div>
  );
};
