import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Mock API base URL - replace with actual backend URL
const API_BASE_URL = 'https://api.nectar.com';

class AuthService {
  // Token storage methods
  async storeToken(token) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  async getToken() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async removeToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }

  // User storage methods
  async storeUser(user) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Phone authentication
  async authenticateWithPhone(phoneNumber) {
    try {
      // Mock API call - replace with actual backend call
      const response = await fetch(`${API_BASE_URL}/auth/phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        await this.storeToken(data.token);
        await this.storeUser(data.user);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Phone auth error:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection and try again.',
        },
      };
    }
  }

  // Google authentication
  async authenticateWithGoogle() {
    try {
      // Mock implementation - replace with expo-auth-session OAuth flow
      console.log('Google auth not fully implemented - mock response');
      return {
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Google authentication coming soon',
        },
      };
    } catch (error) {
      console.error('Google auth error:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection and try again.',
        },
      };
    }
  }

  // Facebook authentication
  async authenticateWithFacebook() {
    try {
      // Mock implementation - replace with expo-auth-session OAuth flow
      console.log('Facebook auth not fully implemented - mock response');
      return {
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Facebook authentication coming soon',
        },
      };
    } catch (error) {
      console.error('Facebook auth error:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection and try again.',
        },
      };
    }
  }

  // Email/password registration
  async registerWithEmail(credentials) {
    try {
      // Sanitize inputs
      const sanitizedCredentials = {
        username: credentials.username.trim(),
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        agreedToTerms: credentials.agreedToTerms,
        termsAcceptedAt: new Date().toISOString(),
      };

      // Mock API call - replace with actual backend call
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedCredentials),
      });

      const data = await response.json();

      if (data.success) {
        await this.storeToken(data.token);
        await this.storeUser(data.user);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection and try again.',
        },
      };
    }
  }

  // Session management
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }

  async logout() {
    await this.removeToken();
  }
}

export default new AuthService();
