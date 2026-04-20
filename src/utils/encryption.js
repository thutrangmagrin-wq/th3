// Simple encryption/decryption utility for React Native
// Note: This is a basic implementation. For production, use a proper encryption library

const SECRET_KEY = 'nectar_secret_key_2024';

/**
 * Convert string to base64 (React Native compatible)
 */
const stringToBase64 = (str) => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    console.error('Base64 encode error:', error);
    return null;
  }
};

/**
 * Convert base64 to string (React Native compatible)
 */
const base64ToString = (base64) => {
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (error) {
    console.error('Base64 decode error:', error);
    return null;
  }
};

/**
 * Simple encryption using base64 + XOR
 */
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const base64 = stringToBase64(jsonString);
    
    if (!base64) throw new Error('Base64 encoding failed');
    
    // Simple XOR encryption
    let encrypted = '';
    for (let i = 0; i < base64.length; i++) {
      encrypted += String.fromCharCode(
        base64.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
      );
    }
    
    // Convert encrypted string to base64 for safe storage
    return stringToBase64(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Simple decryption
 */
export const decryptData = (encryptedData) => {
  try {
    // Convert from base64
    const encrypted = base64ToString(encryptedData);
    
    if (!encrypted) throw new Error('Base64 decoding failed');
    
    // Simple XOR decryption
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(
        encrypted.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
      );
    }
    
    // Decode from base64
    const jsonString = base64ToString(decrypted);
    
    if (!jsonString) throw new Error('Base64 decoding failed');
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
