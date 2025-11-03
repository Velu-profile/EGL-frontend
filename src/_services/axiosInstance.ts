import axios from 'axios';
import { supabase } from './supabaseClient';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_DOMAIN || 'http://localhost:8000',
});

// Setup request interceptor to automatically add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Setup response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the session
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) throw refreshError;

        if (session?.access_token) {
          // Update the authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login by signing out
        await supabase.auth.signOut();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
