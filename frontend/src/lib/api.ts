import axios, { AxiosError } from "axios";
import { getApiBaseUrl } from "./apiOrigin";

const API_BASE_URL = getApiBaseUrl();

type AuthStorage = {
  accessToken: string;
  refreshToken: string;
  user: any;
};

interface ErrorResponse {
  success: false;
  error: string;
  errorCode?: string;
  details?: any;
}

// Error codes that indicate true authentication failures requiring logout
const AUTH_FAILURE_CODES = [
  'TOKEN_EXPIRED',
  'TOKEN_INVALID',
  'NO_TOKEN',
  'AUTH_FAILED'
];

const storageKey = "ruhama_auth";

export const getStoredAuth = (): AuthStorage | null => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredAuth = (auth: AuthStorage | null) => {
  if (!auth) {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, JSON.stringify(auth));
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  
  if (auth?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  } else {
    console.error('❌ NO TOKEN - Request to:', config.url);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;
    const errorMessage = error.response?.data?.error || error.message;

    // Log error for debugging with full context
    console.error('API Error:', {
      status,
      errorCode,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method,
      timestamp: new Date().toISOString()
    });

    // Handle true authentication failures - only redirect on these
    if (status === 401 && errorCode && AUTH_FAILURE_CODES.includes(errorCode)) {
      console.warn('Authentication failure detected, clearing session and redirecting to login');
      setStoredAuth(null);
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - no response received from server');
      // Don't redirect on network errors - let the component handle it
    }

    // For all other errors (validation, permission, etc.), let the calling code handle them
    // The session is preserved and user stays logged in
    return Promise.reject(error);
  }
);
