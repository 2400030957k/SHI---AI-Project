// src/services/api.ts
class ApiService {
  private baseURL: string;

  constructor() {
    // Netlify Functions URL pattern
    this.baseURL = import.meta.env.PROD 
      ? '/.netlify/functions' 
      : 'http://localhost:8888/.netlify/functions';
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async register(userData: { username: string; email: string; password: string }) {
    return this.makeRequest(`${this.baseURL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.makeRequest(`${this.baseURL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Measurements methods
  async saveMeasurements(measurements: any, token: string) {
    return this.makeRequest(`${this.baseURL}/measurements`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(measurements),
    });
  }

  async getMeasurements(token: string) {
    return this.makeRequest(`${this.baseURL}/measurements`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  // Recommendations
  async getRecommendations(measurements: any, token: string) {
    return this.makeRequest(`${this.baseURL}/recommendations`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(measurements),
    });
  }

  // Clothing
  async getClothing() {
    return this.makeRequest(`${this.baseURL}/clothing`);
  }

  // Database initialization
  async initializeDatabase() {
    return this.makeRequest(`${this.baseURL}/init-db`, { method: 'POST' });
  }
}
// Token helpers
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Export a single API object
export const api = new ApiService();

