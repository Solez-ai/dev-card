
// Type definitions for Puter.js
declare global {
    const puter: {
        net: {
            fetch: (url: string, options?: any) => Promise<Response>;
        };
    };
}

export const fetchProxyImage = async (url: string): Promise<string> => {
    try {
        const response = await puter.net.fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Puter fetch failed:', error);
        return url; // Fallback to original URL
    }
};
