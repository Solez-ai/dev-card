export type Theme = 'hacker' | 'cyberpunk' | 'minimal' | 'retro';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type StatsMode = 'stars' | 'xp';

export type CardShape = 'rounded' | 'sharp' | 'glass';

export interface SkillStats {
  problemSolving: number;
  backend: number;
  frontend: number;
  debugging: number;
}

export interface XPStats {
  level: number;
  xp: number;
  maxXp: number;
  yearsExperience: number;
}

export interface GitHubData {
  username: string;
  avatar: string;
  repoCount: number;
  stars: number;
  topLanguages: string[];
  contributionStreak: number;
  lastSynced: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CardConfig {
  // Identity
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  
  // Tech Stack
  techStack: string[];
  
  // Stats
  statsMode: StatsMode;
  skillStats: SkillStats;
  xpStats: XPStats;
  
  // Badges
  selectedBadges: string[];
  
  // GitHub
  github: GitHubData | null;
  
  // Styling
  theme: Theme;
  cardShape: CardShape;
  customColors: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  fontStyle: 'mono' | 'futuristic';
}

export interface DevCardProject {
  id: string;
  name: string;
  createdAt: string;
  lastEdited: string;
  config: CardConfig;
  rarity: Rarity;
}

export const AVAILABLE_BADGES: Badge[] = [
  { id: 'opensource', name: 'Open Source Contributor', icon: 'GitBranch', description: 'Active open source contributor' },
  { id: 'streak', name: '100-Day Streak', icon: 'Flame', description: 'Maintained 100+ day coding streak' },
  { id: 'startup', name: 'Startup Builder', icon: 'Rocket', description: 'Built and launched a startup' },
  { id: 'hackathon', name: 'Hackathon Winner', icon: 'Trophy', description: 'Won a hackathon competition' },
  { id: 'algorithm', name: 'Algorithm Addict', icon: 'Brain', description: 'DSA enthusiast and problem solver' },
];

export const AVAILABLE_TECH = [
  'js', 'ts', 'react', 'nextjs', 'vue', 'angular', 'svelte', 'nodejs',
  'python', 'django', 'flask', 'java', 'spring', 'kotlin', 'go', 'rust',
  'cpp', 'cs', 'dotnet', 'php', 'laravel', 'ruby', 'rails', 'swift',
  'flutter', 'dart', 'mongodb', 'postgres', 'mysql', 'redis', 'graphql',
  'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'vercel', 'netlify',
  'git', 'github', 'gitlab', 'figma', 'tailwind', 'sass', 'webpack',
  'vite', 'prisma', 'supabase', 'firebase', 'tensorflow', 'pytorch'
];

export const DEFAULT_CARD_CONFIG: CardConfig = {
  name: 'Developer',
  title: 'Full Stack Developer',
  tagline: 'Building the future, one commit at a time',
  avatar: '',
  techStack: ['js', 'ts', 'react', 'nodejs'],
  statsMode: 'stars',
  skillStats: {
    problemSolving: 4,
    backend: 3,
    frontend: 4,
    debugging: 3,
  },
  xpStats: {
    level: 15,
    xp: 7500,
    maxXp: 10000,
    yearsExperience: 3,
  },
  selectedBadges: [],
  github: null,
  theme: 'hacker',
  cardShape: 'rounded',
  customColors: {},
  fontStyle: 'mono',
};
