import { getToken } from './auth';

/**
 * Base API URL configuration
 * Defaults to backend server at http://localhost:5000/api
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core HTTP client with request headers and token injection
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Intercept request: Attach Authorization Bearer token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (data && (data.error || data.message)) ||
        `Request failed with status ${response.status}`;
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Server is unavailable. Please check that the backend API is running.');
      networkError.status = 503;
      throw networkError;
    }
    throw error;
  }
}

/**
 * Authentication API methods
 */
export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Authenticate user with credentials
   * POST /api/auth/login
   */
  login: (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  /**
   * Retrieve currently authenticated user profile
   * GET /api/auth/me
   */
  getMe: () => {
    return request('/auth/me', {
      method: 'GET'
    });
  }
};

export default {
  baseUrl: API_BASE_URL,
  auth: authApi,
  request
};
