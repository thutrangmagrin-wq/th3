import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData, decryptData } from '../utils/encryption';
import { initStorage, getCurrentStorage } from './storageAdapter';

// Keys for AsyncStorage
const STORAGE_KEYS = {
  USER: 'nectar_user',
  CART: 'nectar_cart',
  ORDERS: 'nectar_orders',
  IS_LOGGED_IN: 'nectar_is_logged_in',
};

const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

// Initialize storage on module load
initStorage().catch(error => console.error('Storage init error:', error));

// ============ USER AUTHENTICATION ============

/**
 * Save user login data with encryption
 */
export const saveUserLogin = async (userData) => {
  try {
    const storage = getCurrentStorage();
    
    const dataToStore = {
      ...userData,
      loginTime: new Date().toISOString(),
      expiryTime: Date.now() + TOKEN_EXPIRY_TIME,
    };
    
    const encrypted = encryptData(dataToStore);
    if (!encrypted) throw new Error('Encryption failed');
    
    await storage.setItem(STORAGE_KEYS.USER, encrypted);
    await storage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    console.log('✅ User login saved with encryption');
    return true;
  } catch (error) {
    console.error('❌ Error saving user login:', error);
    return false;
  }
};

/**
 * Get saved user data with decryption and expiry check
 */
export const getSavedUser = async () => {
  try {
    const storage = getCurrentStorage();
    
    const encrypted = await storage.getItem(STORAGE_KEYS.USER);
    if (!encrypted) return null;
    
    const userData = decryptData(encrypted);
    if (!userData) return null;
    
    // Check if login has expired
    if (userData.expiryTime && Date.now() > userData.expiryTime) {
      console.log('⏰ Login session expired');
      await logoutUser();
      return null;
    }
    
    console.log('✅ User data retrieved and decrypted');
    return userData;
  } catch (error) {
    console.error('❌ Error getting saved user:', error);
    return null;
  }
};

/**
 * Check if user is logged in and token is valid
 */
export const isUserLoggedIn = async () => {
  try {
    const storage = getCurrentStorage();
    
    const isLoggedIn = await storage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    if (isLoggedIn !== 'true') return false;
    
    // Check if token has expired
    const user = await getSavedUser();
    return user !== null;
  } catch (error) {
    console.error('❌ Error checking login status:', error);
    return false;
  }
};

/**
 * Logout user - clear all user data
 */
export const logoutUser = async () => {
  try {
    const storage = getCurrentStorage();
    
    await storage.removeItem(STORAGE_KEYS.USER);
    await storage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    console.log('✅ User logged out');
    return true;
  } catch (error) {
    console.error('❌ Error logging out:', error);
    return false;
  }
};

// ============ CART MANAGEMENT ============

/**
 * Save cart items with encryption
 */
export const saveCartItems = async (cartItems) => {
  try {
    const storage = getCurrentStorage();
    
    const encrypted = encryptData(cartItems);
    if (!encrypted) throw new Error('Encryption failed');
    
    await storage.setItem(STORAGE_KEYS.CART, encrypted);
    console.log(`✅ Cart saved with encryption: ${cartItems.length} items`);
    return true;
  } catch (error) {
    console.error('❌ Error saving cart:', error);
    return false;
  }
};

/**
 * Get saved cart items with decryption
 */
export const getSavedCartItems = async () => {
  try {
    const storage = getCurrentStorage();
    
    const encrypted = await storage.getItem(STORAGE_KEYS.CART);
    if (!encrypted) return [];
    
    const cartData = decryptData(encrypted);
    console.log('✅ Cart retrieved and decrypted');
    return cartData || [];
  } catch (error) {
    console.error('❌ Error getting saved cart:', error);
    return [];
  }
};

/**
 * Clear cart
 */
export const clearCart = async () => {
  try {
    const storage = getCurrentStorage();
    
    await storage.removeItem(STORAGE_KEYS.CART);
    console.log('✅ Cart cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    return false;
  }
};

// ============ ORDERS MANAGEMENT ============

/**
 * Save order to history with encryption
 */
export const saveOrder = async (orderData) => {
  try {
    const storage = getCurrentStorage();
    
    // Get existing orders
    const existingOrders = await getSavedOrders();
    
    // Create new order with timestamp
    const newOrder = {
      id: Date.now(),
      ...orderData,
      timestamp: new Date().toISOString(),
    };
    
    // Add to orders array
    const updatedOrders = [newOrder, ...existingOrders];
    
    // Encrypt and save
    const encrypted = encryptData(updatedOrders);
    if (!encrypted) throw new Error('Encryption failed');
    
    await storage.setItem(STORAGE_KEYS.ORDERS, encrypted);
    console.log(`✅ Order saved with encryption: ${newOrder.id}`);
    return newOrder;
  } catch (error) {
    console.error('❌ Error saving order:', error);
    return null;
  }
};

/**
 * Get all saved orders with decryption
 */
export const getSavedOrders = async () => {
  try {
    const storage = getCurrentStorage();
    
    const encrypted = await storage.getItem(STORAGE_KEYS.ORDERS);
    if (!encrypted) return [];
    
    const ordersData = decryptData(encrypted);
    console.log('✅ Orders retrieved and decrypted');
    return ordersData || [];
  } catch (error) {
    console.error('❌ Error getting saved orders:', error);
    return [];
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const orders = await getSavedOrders();
    return orders.find(order => order.id === orderId) || null;
  } catch (error) {
    console.error('❌ Error getting order:', error);
    return null;
  }
};

/**
 * Clear all orders
 */
export const clearAllOrders = async () => {
  try {
    const storage = getCurrentStorage();
    
    await storage.removeItem(STORAGE_KEYS.ORDERS);
    console.log('✅ All orders cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing orders:', error);
    return false;
  }
};

/**
 * Clear all storage (for debugging)
 */
export const clearAllStorage = async () => {
  try {
    const storage = getCurrentStorage();
    
    await storage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('✅ All storage cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing all storage:', error);
    return false;
  }
};
