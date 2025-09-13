const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Authentication
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Measurements
  saveMeasurements: async (measurements: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/measurements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(measurements),
    });
    return response.json();
  },

  getUserMeasurements: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/measurements`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Recommendations
  getRecommendations: async (measurements: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(measurements),
    });
    return response.json();
  },
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};