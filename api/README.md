# API Documentation

This directory contains Vercel Serverless Functions that act as backend proxies to bypass CORS restrictions.

## Endpoints

### 1. Image Proxy
**Endpoint:** `GET /api/image-proxy?url=<encoded-url>`

**Purpose:** Fetch external images server-side to avoid CORS issues and ensure canvas safety for exports.

**Parameters:**
- `url` (required): The external image URL to fetch (must be URL-encoded)

**Allowed Domains:**
- `skillicons.dev`
- `avatars.githubusercontent.com`
- `github.com`
- `raw.githubusercontent.com`

**Features:**
- Validates domain whitelist
- Enforces 5MB file size limit
- Returns raw image bytes with correct Content-Type
- Adds caching headers (1 hour)
- CORS-enabled responses

**Example:**
```javascript
const imageUrl = 'https://skillicons.dev/icons?i=typescript,react';
const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
const response = await fetch(proxyUrl);
const blob = await response.blob();
```

### 2. GitHub API Proxy
**Endpoint:** `GET /api/github?path=<api-path>`

**Purpose:** Forward GitHub API requests server-side to avoid CORS and handle authentication.

**Parameters:**
- `path` (required): The GitHub API path (e.g., `users/username` or `repos/owner/repo`)

**Features:**
- Forwards requests to `api.github.com`
- Injects GitHub token from environment variables (if available)
- Handles rate limits
- Returns JSON responses
- Adds caching headers (5 minutes)
- CORS-enabled responses

**Example:**
```javascript
const response = await fetch('/api/github?path=users/octocat');
const userData = await response.json();
```

## Environment Variables

Create a `.env` file in the root directory (or configure in Vercel dashboard):

```bash
# GitHub Personal Access Token
# Generate at: https://github.com/settings/tokens
# Required scopes: public_repo (or repo for private repos)
GITHUB_TOKEN=ghp_your_token_here
```

## Security Features

1. **Domain Whitelisting**: Image proxy only allows specific trusted domains
2. **File Size Limits**: Maximum 5MB for images
3. **URL Validation**: Prevents arbitrary internal network access
4. **Token Security**: GitHub token never exposed to frontend
5. **Rate Limiting**: Inherits Vercel's built-in rate limiting

## Deployment

These functions are automatically deployed with your Vercel project. No additional configuration needed.

### Local Development

To test locally:
```bash
npm install -g vercel
vercel dev
```

### Production Deployment

```bash
vercel --prod
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (missing/invalid parameters)
- `403`: Forbidden (domain not whitelisted)
- `405`: Method not allowed
- `413`: Payload too large
- `500`: Server error
