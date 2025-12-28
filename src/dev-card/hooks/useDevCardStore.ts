import { useState, useCallback, useEffect } from 'react';
import { DevCardProject, CardConfig } from '../types';
import {
  getProjects,
  getProject,
  createProject,
  updateProjectConfig,
  deleteProject as deleteProjectFromStorage,
  duplicateProject as duplicateProjectInStorage
} from '../utils/storage';
import { fetchGitHubData } from '../utils/github';

export const useDevCardStore = () => {
  const [projects, setProjects] = useState<DevCardProject[]>([]);
  const [currentProject, setCurrentProject] = useState<DevCardProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(() => {
    const storedProjects = getProjects();
    setProjects(storedProjects.sort((a, b) =>
      new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
    ));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const loadProject = useCallback((id: string) => {
    const project = getProject(id);
    if (project) {
      setCurrentProject(project);
    }
    return project;
  }, []);

  const createNewProject = useCallback(async (name: string, githubUsername?: string) => {
    let githubData = undefined;

    if (githubUsername) {
      try {
        githubData = await fetchGitHubData(githubUsername);
      } catch (error) {
        console.error('Failed to fetch GitHub data during project creation:', error);
      }
    }

    const project = createProject(name, githubData);
    loadProjects();
    return project;
  }, [loadProjects]);

  const updateConfig = useCallback((config: Partial<CardConfig>) => {
    if (!currentProject) return;

    const updated = updateProjectConfig(currentProject.id, config);
    if (updated) {
      setCurrentProject(updated);
      loadProjects();
    }
  }, [currentProject, loadProjects]);

  const deleteProject = useCallback((id: string) => {
    const success = deleteProjectFromStorage(id);
    if (success) {
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      loadProjects();
    }
    return success;
  }, [currentProject, loadProjects]);

  const duplicateProject = useCallback((id: string) => {
    const newProject = duplicateProjectInStorage(id);
    if (newProject) {
      loadProjects();
    }
    return newProject;
  }, [loadProjects]);

  return {
    projects,
    currentProject,
    isLoading,
    loadProjects,
    loadProject,
    createNewProject,
    updateConfig,
    deleteProject,
    duplicateProject,
    setCurrentProject,
  };
};
