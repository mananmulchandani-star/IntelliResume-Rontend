// src/config.js
// Centralized environment configuration
// VITE_API_BASE_URL is defined in both .env.development and .env.production

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://insightr-backend-production.up.railway.app';

export const config = {
  apiBaseUrl: API_BASE_URL,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Backward-compatible exports
export const API_URL = API_BASE_URL;
export const API_BASE_URL_EXPORT = API_BASE_URL;

export const getBackendUrl = () => API_BASE_URL;

export default config;