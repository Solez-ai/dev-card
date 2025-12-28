import { GitHubData } from '../types';

const GITHUB_API = 'https://api.github.com';

interface GitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
}

interface GitHubRepo {
  stargazers_count: number;
  language: string | null;
}

interface GitHubEvent {
  created_at: string;
  type: string;
}

export const fetchGitHubData = async (username: string): Promise<GitHubData> => {
  try {
    // Fetch user profile
    const userResponse = await fetch(`${GITHUB_API}/users/${username}`);
    if (!userResponse.ok) {
      throw new Error('User not found');
    }
    const userData: GitHubUser = await userResponse.json();
    
    // Fetch repositories
    const reposResponse = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`);
    const reposData: GitHubRepo[] = await reposResponse.json();
    
    // Calculate total stars
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    
    // Get top languages
    const languageCounts: Record<string, number> = {};
    reposData.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });
    
    const topLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang);
    
    // Fetch contribution activity (approximate streak)
    const eventsResponse = await fetch(`${GITHUB_API}/users/${username}/events/public?per_page=100`);
    const eventsData: GitHubEvent[] = await eventsResponse.json();
    
    // Calculate approximate streak
    const contributionStreak = calculateStreak(eventsData);
    
    return {
      username,
      avatar: userData.avatar_url,
      repoCount: userData.public_repos,
      stars: totalStars,
      topLanguages,
      contributionStreak,
      lastSynced: new Date().toISOString(),
    };
  } catch (error) {
    throw error;
  }
};

const calculateStreak = (events: GitHubEvent[]): number => {
  if (events.length === 0) return 0;
  
  const pushEvents = events.filter(e => 
    e.type === 'PushEvent' || 
    e.type === 'CreateEvent' || 
    e.type === 'PullRequestEvent'
  );
  
  if (pushEvents.length === 0) return 0;
  
  const dates = pushEvents.map(e => new Date(e.created_at).toDateString());
  const uniqueDates = [...new Set(dates)];
  
  let streak = 1;
  let maxStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i]);
    const previous = new Date(uniqueDates[i - 1]);
    const diffDays = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
  }
  
  return Math.min(maxStreak, 365);
};
