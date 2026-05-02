/**
 * Application Configuration
 * 
 * To disable authentication during development, set AUTH_ENABLED to false.
 * This allows bypassing the API key requirement.
 */

interface AppConfig {
  /** Enable/disable authentication */
  AUTH_ENABLED: boolean;
  /** API base URL (to be configured when backend is ready) */
  API_BASE_URL: string;
  /** Default API key for development (when auth is disabled) */
  DEV_API_KEY: string;
}

export const config: AppConfig = {
  // Set to false to disable authentication for development
  AUTH_ENABLED: true,
  
  // API configuration (update when backend is ready)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // Development API key (used when AUTH_ENABLED is false)
  DEV_API_KEY: 'dev-key-12345',
};

/**
 * Check if authentication is required
 */
export const isAuthEnabled = (): boolean => config.AUTH_ENABLED;

/**
 * Get API key from localStorage or dev key if auth is disabled
 */
export const getApiKey = (): string | null => {
  if (!config.AUTH_ENABLED) {
    return config.DEV_API_KEY;
  }
  return localStorage.getItem('apiKey');
};

/**
 * Save API key to localStorage
 */
export const setApiKey = (key: string): void => {
  localStorage.setItem('apiKey', key);
};

/**
 * Clear API key from localStorage
 */
export const clearApiKey = (): void => {
  localStorage.removeItem('apiKey');
};
