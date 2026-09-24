// Central place for environment-driven config.
// Set VITE_API_URL in a .env file to point at your backend
// (defaults to localhost:5000 for local development).
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
