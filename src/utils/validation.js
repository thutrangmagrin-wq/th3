import validator from 'validator';
import { parsePhoneNumber } from 'libphonenumber-js';

// Email validation
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email.trim());
};

// Password validation - at least 8 chars with 1 uppercase, 1 lowercase, 1 number
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasMinLength && hasUppercase && hasLowercase && hasNumber;
};

// Phone number validation - E.164 format
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== 'string') return false;
  
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return parsed && parsed.isValid();
  } catch (error) {
    return false;
  }
};
