import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData, decryptData } from '../utils/encryption';

const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Custom hook for AsyncStorage with encryption and expiry
 */
export const useStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Save data with encryption and expiry
   */
  const setItem = useCallback(async (key, value, expiryTime = TOKEN_EXPIRY_TIME) => {
    try {
      setLoading(true);
      setError(null);

      const dataToStore = {
        value,
        timestamp: Date.now(),
        expiry: Date.now() + expiryTime,
      };

      const encrypted = encryptData(dataToStore);
      if (!encrypted) {
        throw new Error('Encryption failed');
      }

      await AsyncStorage.setItem(key, encrypted);
      console.log(`✅ Saved ${key} with expiry in ${expiryTime / 1000 / 60 / 60} hours`);
      return true;
    } catch (err) {
      console.error(`❌ Error saving ${key}:`, err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get data with decryption and expiry check
   */
  const getItem = useCallback(async (key) => {
    try {
      setLoading(true);
      setError(null);

      const encrypted = await AsyncStorage.getItem(key);
      if (!encrypted) {
        return null;
      }

      const decrypted = decryptData(encrypted);
      if (!decrypted) {
        throw new Error('Decryption failed');
      }

      // Check if data has expired
      if (decrypted.expiry && Date.now() > decrypted.expiry) {
        console.log(`⏰ ${key} has expired, removing...`);
        await AsyncStorage.removeItem(key);
        return null;
      }

      console.log(`✅ Retrieved ${key}`);
      return decrypted.value;
    } catch (err) {
      console.error(`❌ Error retrieving ${key}:`, err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove item
   */
  const removeItem = useCallback(async (key) => {
    try {
      setLoading(true);
      setError(null);

      await AsyncStorage.removeItem(key);
      console.log(`✅ Removed ${key}`);
      return true;
    } catch (err) {
      console.error(`❌ Error removing ${key}:`, err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear all storage
   */
  const clear = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await AsyncStorage.clear();
      console.log('✅ All storage cleared');
      return true;
    } catch (err) {
      console.error('❌ Error clearing storage:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if token is expired
   */
  const isTokenExpired = useCallback(async (key) => {
    try {
      const encrypted = await AsyncStorage.getItem(key);
      if (!encrypted) return true;

      const decrypted = decryptData(encrypted);
      if (!decrypted || !decrypted.expiry) return true;

      return Date.now() > decrypted.expiry;
    } catch (err) {
      console.error('Error checking token expiry:', err);
      return true;
    }
  }, []);

  /**
   * Refresh token expiry
   */
  const refreshToken = useCallback(async (key, expiryTime = TOKEN_EXPIRY_TIME) => {
    try {
      const value = await getItem(key);
      if (value) {
        await setItem(key, value, expiryTime);
        console.log(`✅ Token ${key} refreshed`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error refreshing token:', err);
      return false;
    }
  }, [getItem, setItem]);

  return {
    setItem,
    getItem,
    removeItem,
    clear,
    isTokenExpired,
    refreshToken,
    loading,
    error,
  };
};
