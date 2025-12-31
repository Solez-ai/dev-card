/**
 * Fetch an image through the backend proxy to avoid CORS issues
 * @param url - The external image URL to fetch
 * @returns Promise resolving to a data URL (base64) for canvas-safe usage
 */
export const fetchProxyImage = async (url: string): Promise<string> => {
    try {
        // Use backend proxy instead of direct fetch
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error(`Proxy failed: ${response.status} ${response.statusText}`);
        }

        // Convert to blob then to data URL for canvas safety
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Image proxy fetch failed:', error);
        // Return original URL as fallback (may have CORS issues but better than nothing)
        return url;
    }
};
