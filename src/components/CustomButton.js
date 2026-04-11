import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const CustomButton = ({ title, onPress, variant = 'primary', disabled = false, loading = false }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'social-google':
        return [styles.button, styles.googleButton];
      case 'social-facebook':
        return [styles.button, styles.facebookButton];
      default:
        return [styles.button, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    return variant === 'primary' ? styles.primaryText : styles.socialText;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), (disabled || loading) && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : '#FFF'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#53B175',
  },
  googleButton: {
    backgroundColor: '#5383EC',
  },
  facebookButton: {
    backgroundColor: '#4A66AC',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  socialText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;
