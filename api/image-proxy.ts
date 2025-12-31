import type { VercelRequest, VercelResponse } from '@vercel/node';

// Whitelist of allowed domains for image fetching
const ALLOWED_DOMAINS = [
    'skillicons.dev',
    'avatars.githubusercontent.com',
    'github.com',
    'raw.githubusercontent.com',
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.query;

    // Validate URL parameter
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid URL parameter' });
    }

    try {
        // Parse and validate the URL
        const targetUrl = new URL(url);

        // Check if domain is whitelisted
        const isAllowed = ALLOWED_DOMAINS.some(domain =>
            targetUrl.hostname === domain || targetUrl.hostname.endsWith(`.${domain}`)
        );

        if (!isAllowed) {
            return res.status(403).json({
                error: 'Domain not allowed',
                allowedDomains: ALLOWED_DOMAINS
            });
        }

        // Fetch the image
        const response = await fetch(targetUrl.toString(), {
            headers: {
                'User-Agent': 'DevCard-Proxy/1.0',
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: `Failed to fetch image: ${response.statusText}`
            });
        }

        // Check content length
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
            return res.status(413).json({ error: 'File too large (max 5MB)' });
        }

        // Get the image buffer
        const buffer = await response.arrayBuffer();

        if (buffer.byteLength > MAX_FILE_SIZE) {
            return res.status(413).json({ error: 'File too large (max 5MB)' });
        }

        // Get content type
        const contentType = response.headers.get('content-type') || 'image/png';

        // Set caching headers (1 hour)
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');

        // Send the image
        return res.send(Buffer.from(buffer));

    } catch (error) {
        console.error('Image proxy error:', error);
        return res.status(500).json({
            error: 'Failed to proxy image',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
