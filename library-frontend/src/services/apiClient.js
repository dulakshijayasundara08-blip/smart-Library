import axios from 'axios';

// Single place that knows the backend's base URL. Swap this via an env var
// (VITE_API_BASE_URL) instead of hardcoding localhost:8080 across every component.
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
