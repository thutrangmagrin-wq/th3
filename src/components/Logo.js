import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Logo = ({ size = 'medium' }) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40 };
      case 'large':
        return { width: 80, height: 80 };
      default:
        return { width: 60, height: 60 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 36;
    }
  };

  return (
    <View style={[styles.container, getSizeStyle()]}>
      <Text style={[styles.emoji, { fontSize: getTextSize() }]}>🥕</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  emoji: {
    textAlign: 'center',
  },
});

export default Logo;
