import { DevCardProject, CardConfig, DEFAULT_CARD_CONFIG, Rarity, GitHubData } from '../types';

const STORAGE_KEY = 'devcard_projects';

export const generateId = (): string => {
  return `dc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getProjects = (): DevCardProject[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveProjects = (projects: DevCardProject[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const getProject = (id: string): DevCardProject | undefined => {
  const projects = getProjects();
  return projects.find(p => p.id === id);
};

export const createProject = (name: string, githubData?: GitHubData): DevCardProject => {
  const project: DevCardProject = {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
    config: {
      ...DEFAULT_CARD_CONFIG,
      name: githubData?.username || 'Developer',
      github: githubData || null,
      avatar: githubData?.avatar || null,
      techStack: githubData?.topLanguages?.map(l => l.toLowerCase()) || [],
    },
    rarity: 'common',
  };

  // Recalculate rarity if GitHub data is present
  if (githubData) {
    project.rarity = calculateRarity(project.config);
  }

  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);

  return project;
};

export const updateProject = (id: string, updates: Partial<DevCardProject>): DevCardProject | undefined => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) return undefined;

  projects[index] = {
    ...projects[index],
    ...updates,
    lastEdited: new Date().toISOString(),
  };

  saveProjects(projects);
  return projects[index];
};

export const updateProjectConfig = (id: string, config: Partial<CardConfig>): DevCardProject | undefined => {
  const project = getProject(id);
  if (!project) return undefined;

  const updatedConfig = { ...project.config, ...config };
  const rarity = calculateRarity(updatedConfig);

  return updateProject(id, { config: updatedConfig, rarity });
};

export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);

  if (filtered.length === projects.length) return false;

  saveProjects(filtered);
  return true;
};

export const duplicateProject = (id: string): DevCardProject | undefined => {
  const project = getProject(id);
  if (!project) return undefined;

  const newProject: DevCardProject = {
    ...project,
    id: generateId(),
    name: `${project.name} (Copy)`,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
  };

  const projects = getProjects();
  projects.push(newProject);
  saveProjects(projects);

  return newProject;
};

export const calculateRarity = (config: CardConfig): Rarity => {
  let score = 0;

  // Skill stats contribution (max 20 points)
  if (config.statsMode === 'stars') {
    const avgStars = Object.values(config.skillStats).reduce((a, b) => a + b, 0) / 4;
    score += avgStars * 4;
  } else {
    score += Math.min(config.xpStats.level / 5, 4) * 5;
  }

  // GitHub contribution (max 30 points)
  if (config.github) {
    score += Math.min(config.github.repoCount / 10, 10);
    score += Math.min(config.github.stars / 50, 10);
    score += Math.min(config.github.contributionStreak / 30, 10);
  }

  // Badge contribution (max 15 points)
  score += config.selectedBadges.length * 5;

  // Tech stack contribution (max 10 points)
  score += Math.min(config.techStack.length * 1.5, 10);

  // Determine rarity
  if (score >= 55) return 'legendary';
  if (score >= 40) return 'epic';
  if (score >= 25) return 'rare';
  return 'common';
};
