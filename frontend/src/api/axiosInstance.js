import axios from "axios";

export const API = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// Response interceptor to automatically refresh tokens on 401 errors
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip interceptor if the error occurred on login, registration, logout, or refresh-token endpoint
        if (
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/logout") ||
            originalRequest.url?.includes("/auth/refresh-token")
        ) {
            return Promise.reject(error);
        }

        // If the error response is 401 and the request has not been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // If a token refresh is already in progress, wait in queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => API(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                // Request a token refresh. The server will update the HttpOnly cookies.
                await API.post("/auth/refresh-token");
                isRefreshing = false;
                
                // Resolve all waiting requests in the queue
                processQueue(null);
                
                // Retry the original request
                return API(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                // Reject all queued requests
                processQueue(refreshError);

                // Refresh token is expired or invalid. Force log out the user if not already on login/register pages.
                if (
                    typeof window !== "undefined" &&
                    window.location.pathname !== "/login" &&
                    window.location.pathname !== "/register"
                ) {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);