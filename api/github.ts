import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_API_BASE = 'https://api.github.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { path } = req.query;

    // Validate path parameter
    if (!path || typeof path !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid path parameter' });
    }

    try {
        // Build GitHub API URL
        const apiUrl = `${GITHUB_API_BASE}/${path}`;

        // Prepare headers
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'DevCard-App/1.0',
        };

        // Add GitHub token if available (from environment variable)
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
            headers['Authorization'] = `token ${githubToken}`;
        }

        // Fetch from GitHub API
        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: `GitHub API error: ${response.statusText}`,
                details: errorData,
            });
        }

        // Get the JSON data
        const data = await response.json();

        // Set caching headers (5 minutes for GitHub data)
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');

        // Return the data
        return res.json(data);

    } catch (error) {
        console.error('GitHub proxy error:', error);
        return res.status(500).json({
            error: 'Failed to fetch from GitHub',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
