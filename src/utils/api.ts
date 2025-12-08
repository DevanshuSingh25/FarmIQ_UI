/**
 * Get the API base URL for making backend requests
 */
export function getAPIBaseURL(): string {
    // Use environment variable or fallback to production URL
    return import.meta.env.VITE_API_URL || 'https://farmiq-ui-backend.onrender.com/api';
}
