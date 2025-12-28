
// Type definitions for Puter.js
declare global {
    const puter: {
        net: {
            fetch: (url: string, options?: any) => Promise<Response>;
        };
    };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProxyImage = async (url: string, retries = 3): Promise<string> => {
    for (let i = 0; i < retries; i++) {
        try {
            // Check if puter is defined
            if (typeof puter === 'undefined') {
                console.warn('Puter.js not loaded yet, waiting...');
                await sleep(1000);
                continue;
            }

            const response = await puter.net.fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error(`Puter fetch attempt ${i + 1} failed:`, error);
            if (i === retries - 1) {
                // Return original URL as last resort, but this will likely fail CORS
                console.error('All puter fetch attempts failed, falling back to raw URL');
                return url;
            }
            await sleep(1000 * (i + 1)); // Exponential backoff-ish
        }
    }
    return url;
};
