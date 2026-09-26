import axios from "axios";

// Shared Axios instance for authenticated API calls.
const api = axios.create({
    // Use the app's public base URL for all outgoing requests.
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    // Include cookies in cross-site requests when required by the backend.
    withCredentials: true
});

// Attach the current Clerk session token to every request.
api.interceptors.request.use(async (config) => {
    try {
        // Guard against missing Clerk on the client before trying to read the session.
        if (window.Clerk?.session) {
            const token = await window.Clerk.session.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (err) {
        // Log token refresh issues without breaking the request itself.
        console.error("Error in API request interceptor getting Clerk token");
    }
    return config;
});

export default api;