// API Configuration utility
// This ensures we always use the correct API URL from environment variables

const getApiUrl = (): string => {
  // Always use environment variable first
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envApiUrl) {
    console.log('Using API URL from environment:', envApiUrl);
    return envApiUrl;
  }
  
  // Fallback detection (should rarely be used now)
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    console.warn('Using fallback Railway URL - environment variable not found');
    return 'https://web-production-68097.up.railway.app';
  }
  
  // Final fallback for development
  console.warn('Using localhost fallback - no environment variable found');
  return 'http://localhost:8000';
};

export const API_URL = getApiUrl();

// Configuration object for additional settings
export const API_CONFIG = {
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'BFUB CBT System',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
};

// Helper function for making API calls with better error handling
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}/api${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
    ...options,
  };

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    if (API_CONFIG.debug) {
      console.log(`API Call: ${options?.method || 'GET'} ${url}`);
      if (options?.body) {
        console.log('Request Body:', options.body);
      }
    }

    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (API_CONFIG.debug) {
      console.log(`API Response: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`API call timeout after ${API_CONFIG.timeout}ms for ${url}`);
        throw new Error('Request timeout - please check your connection');
      }
    }
    
    console.error(`API call failed for ${url}:`, error);
    throw error;
  }
};

// Log current configuration for debugging
if (API_CONFIG.debug) {
  console.log('API Configuration:', {
    baseUrl: API_URL,
    timeout: API_CONFIG.timeout,
    debug: API_CONFIG.debug,
    environment: process.env.NODE_ENV,
  });
}

// Export for backward compatibility
export default API_URL;
