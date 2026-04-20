// Storage adapter - use AsyncStorage for persistent storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache storage instance
let storageInstance = AsyncStorage;

/**
 * Initialize storage
 */
export const initStorage = async () => {
  console.log('✅ Using AsyncStorage for persistent storage');
  return storageInstance;
};

/**
 * Get current storage instance
 */
export const getCurrentStorage = () => {
  return storageInstance;
};
