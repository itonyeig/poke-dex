import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling if needed
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can normalize errors here if needed
    return Promise.reject(error);
  }
);

