import axios from 'axios';

const api = axios.create({
    baseURL: 'https://stream-step-hzsn.vercel.app/api',
    withCredentials: true
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api; 