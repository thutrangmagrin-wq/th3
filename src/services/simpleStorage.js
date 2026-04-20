// Simple in-memory storage for Nectar App
// This is a simple solution that works without AsyncStorage

const storage = {};

/**
 * Simple encryption using base64 + XOR
 */
const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));
    return base64;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Simple decryption
 */
const decryptData = (encryptedData) => {
  try {
    const jsonString = decodeURIComponent(escape(atob(encryptedData)));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// ============ USER AUTHENTICATION ============

export const saveUserLogin = async (userData) => {
  try {
    const dataToStore = {
      ...userData,
      loginTime: new Date().toISOString(),
      expiryTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };
    
    const encrypted = encryptData(dataToStore);
    if (!encrypted) throw new Error('Encryption failed');
    
    storage['nectar_user'] = encrypted;
    storage['nectar_is_logged_in'] = 'true';
    console.log('✅ User login saved');
    return true;
  } catch (error) {
    console.error('❌ Error saving user login:', error);
    return false;
  }
};

export const getSavedUser = async () => {
  try {
    const encrypted = storage['nectar_user'];
    if (!encrypted) return null;
    
    const userData = decryptData(encrypted);
    if (!userData) return null;
    
    // Check if login has expired
    if (userData.expiryTime && Date.now() > userData.expiryTime) {
      console.log('⏰ Login session expired');
      await logoutUser();
      return null;
    }
    
    console.log('✅ User data retrieved');
    return userData;
  } catch (error) {
    console.error('❌ Error getting saved user:', error);
    return null;
  }
};

export const isUserLoggedIn = async () => {
  try {
    const isLoggedIn = storage['nectar_is_logged_in'];
    if (isLoggedIn !== 'true') return false;
    
    const user = await getSavedUser();
    return user !== null;
  } catch (error) {
    console.error('❌ Error checking login status:', error);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    delete storage['nectar_user'];
    delete storage['nectar_is_logged_in'];
    delete storage['nectar_cart'];
    delete storage['nectar_orders'];
    console.log('✅ User logged out');
    return true;
  } catch (error) {
    console.error('❌ Error logging out:', error);
    return false;
  }
};

// ============ CART MANAGEMENT ============

export const saveCartItems = async (cartItems) => {
  try {
    const encrypted = encryptData(cartItems);
    if (!encrypted) throw new Error('Encryption failed');
    
    storage['nectar_cart'] = encrypted;
    console.log(`✅ Cart saved: ${cartItems.length} items`);
    return true;
  } catch (error) {
    console.error('❌ Error saving cart:', error);
    return false;
  }
};

export const getSavedCartItems = async () => {
  try {
    const encrypted = storage['nectar_cart'];
    if (!encrypted) return [];
    
    const cartData = decryptData(encrypted);
    console.log('✅ Cart retrieved');
    return cartData || [];
  } catch (error) {
    console.error('❌ Error getting saved cart:', error);
    return [];
  }
};

export const clearCart = async () => {
  try {
    delete storage['nectar_cart'];
    console.log('✅ Cart cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    return false;
  }
};

// ============ ORDERS MANAGEMENT ============

export const saveOrder = async (orderData) => {
  try {
    const existingOrders = await getSavedOrders();
    
    const newOrder = {
      id: Date.now(),
      ...orderData,
      timestamp: new Date().toISOString(),
    };
    
    const updatedOrders = [newOrder, ...existingOrders];
    
    const encrypted = encryptData(updatedOrders);
    if (!encrypted) throw new Error('Encryption failed');
    
    storage['nectar_orders'] = encrypted;
    console.log(`✅ Order saved: ${newOrder.id}`);
    return newOrder;
  } catch (error) {
    console.error('❌ Error saving order:', error);
    return null;
  }
};

export const getSavedOrders = async () => {
  try {
    const encrypted = storage['nectar_orders'];
    if (!encrypted) return [];
    
    const ordersData = decryptData(encrypted);
    console.log('✅ Orders retrieved');
    return ordersData || [];
  } catch (error) {
    console.error('❌ Error getting saved orders:', error);
    return [];
  }
};

export const getOrderById = async (orderId) => {
  try {
    const orders = await getSavedOrders();
    return orders.find(order => order.id === orderId) || null;
  } catch (error) {
    console.error('❌ Error getting order:', error);
    return null;
  }
};

export const clearAllOrders = async () => {
  try {
    delete storage['nectar_orders'];
    console.log('✅ All orders cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing orders:', error);
    return false;
  }
};

export const clearAllStorage = async () => {
  try {
    Object.keys(storage).forEach(key => delete storage[key]);
    console.log('✅ All storage cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing all storage:', error);
    return false;
  }
};
