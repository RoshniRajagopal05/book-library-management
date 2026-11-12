
import axios from "axios";


// Store JWT and unauthorized callback in memory
let authToken = null;
let unauthorizedHandler = null;

// Update JWT
export const setAuthToken = (token) => {
    authToken = token;
};

// Register callback for unauthorized responses
export const setUnauthorizedHandler = (handler) => {
    unauthorizedHandler = handler;
};

// Create Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Request interceptor: attach JWT automatically
api.interceptors.request.use(
    (config) => {
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            unauthorizedHandler?.();
        }

        return Promise.reject(error);
    }
);

export default api;
