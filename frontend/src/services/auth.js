/**
 * Authentication storage utility for SwasthyaGrid
 * Manages JWT tokens and session data in browser storage
 */

const TOKEN_KEY = 'swasthyagrid_token';
const USER_KEY = 'swasthyagrid_user';

export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  return Boolean(token && token.trim().length > 0);
};

export const logout = () => {
  removeToken();
  removeUser();
};
