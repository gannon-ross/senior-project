// API service for making requests to the backend

const API_URL = 'http://localhost:3001/api';

/**
 * Make a request to the API
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Request data
 * @param {boolean} includeToken - Whether to include auth token
 * @returns {Promise<Object>} - Response data
 */
const apiRequest = async (endpoint, method = 'GET', data = null, includeToken = false) => {
  const url = `${API_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  // Include auth token if required
  if (includeToken) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`Making ${method} request to ${url}`, data ? { data } : '');

    const response = await fetch(url, options);
    let responseData;

    try {
      responseData = await response.json();
    } catch (error) {
      console.error('Failed to parse response as JSON:', error);
      throw new Error('Invalid response from server');
    }

    console.log(`Response from ${url}:`, responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error(`API request to ${url} failed:`, error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  verifyEmail: (email, code) => apiRequest('/auth/verify-email', 'POST', { email, code }),
  login: (email, password) => apiRequest('/auth/login', 'POST', { email, password }),
  getCurrentUser: () => apiRequest('/auth/me', 'GET', null, true),
};

export default apiRequest;
