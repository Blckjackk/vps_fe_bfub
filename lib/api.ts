// API Configuration utility
// This ensures we always use the correct API URL regardless of environment

const getApiUrl = (): string => {
  // In production (Vercel), use the Railway backend
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://web-production-68097.up.railway.app';
  }
  
  // Use environment variable if available
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:8000';
};

export const API_URL = getApiUrl();

// Helper function for making API calls
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}/api${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error(`API call failed for ${url}:`, error);
    throw error;
  }
};

// Export for backward compatibility
export default API_URL;
