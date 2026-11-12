
import api from "./api";

// Register a new user
export const registerUser = async (userData) => {
    const response = await api.post(
        "/api/auth/register",
        userData
    );

    return response.data;
};

// Login an existing user
export const loginUser = async (credentials) => {
    const response = await api.post(
        "/api/auth/login",
        credentials
    );

    return response.data;
};

// Get currently logged-in user
// Get currently logged-in user
export const getCurrentUser = async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
};

 

export default api;
