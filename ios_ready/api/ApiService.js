/**
 * ACTIFY iOS-Ready API Service
 * Optimized for mobile performance and offline capabilities
 */

import axios from 'axios';

class ApiService {
  constructor() {
    // Use environment variable for backend URL
    this.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
    this.api = axios.create({
      baseURL: `${this.baseURL}/api`,
      timeout: 15000, // Increased timeout for mobile networks
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const session = this.getStoredSession();
        if (session) {
          config.headers.Authorization = `Bearer ${session}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          // Trigger re-authentication
          window.dispatchEvent(new CustomEvent('auth:required'));
        }
        return Promise.reject(error);
      }
    );
  }

  // Storage methods (iOS-ready for AsyncStorage migration)
  getStoredUser() {
    try {
      const user = localStorage.getItem('actify_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  getStoredSession() {
    return localStorage.getItem('actify_session');
  }

  setAuth(user, session) {
    localStorage.setItem('actify_user', JSON.stringify(user));
    localStorage.setItem('actify_session', session);
    localStorage.setItem('actify_auth_timestamp', Date.now().toString());
  }

  clearAuth() {
    localStorage.removeItem('actify_user');
    localStorage.removeItem('actify_session');
    localStorage.removeItem('actify_auth_timestamp');
  }

  // Authentication API
  async login(credentials) {
    try {
      const response = await this.api.post('/login', credentials);
      if (response.data.message === "Login successful") {
        this.setAuth(response.data.user, response.data.session_id);
        return { success: true, user: response.data.user };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  }

  async register(userData) {
    try {
      const response = await this.api.post('/users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  }

  // Global Activities API
  async getCurrentGlobalActivity() {
    try {
      const response = await this.api.get('/daily-global-activity/current');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getGlobalFeed(userId, friendsOnly = true) {
    try {
      const response = await this.api.get(
        `/daily-global-activity/feed?user_id=${userId}&friends_only=${friendsOnly}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async submitGlobalActivity(userId, description, photoFile) {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('description', description);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await this.api.post('/daily-global-activity/complete', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Submission failed' };
    }
  }

  // Groups API
  async getUserGroups(userId) {
    try {
      const response = await this.api.get(`/users/${userId}/groups`);
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createGroup(userId, groupData) {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      Object.keys(groupData).forEach(key => {
        formData.append(key, groupData[key]);
      });

      const response = await this.api.post('/groups', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to create group' };
    }
  }

  async joinGroupByCode(userId, inviteCode) {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('invite_code', inviteCode.toUpperCase());

      const response = await this.api.post('/groups/join-by-code', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to join group' };
    }
  }

  async getGroupFeed(groupId, userId) {
    try {
      const response = await this.api.get(`/groups/${groupId}/daily-activity-feed?user_id=${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Friends API
  async getUserFollowing(userId) {
    try {
      const response = await this.api.get(`/users/${userId}/following`);
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUserFollowers(userId) {
    try {
      const response = await this.api.get(`/users/${userId}/followers`);
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchUsers(query) {
    try {
      const response = await this.api.get(`/users/search?q=${encodeURIComponent(query)}`);
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async followUser(followerId, targetUserId) {
    try {
      const formData = new FormData();
      formData.append('follower_id', followerId);

      const response = await this.api.post(`/users/${targetUserId}/follow`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to follow user' };
    }
  }

  async unfollowUser(followerId, targetUserId) {
    try {
      const formData = new FormData();
      formData.append('follower_id', followerId);

      const response = await this.api.post(`/users/${targetUserId}/unfollow`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to unfollow user' };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export default new ApiService();