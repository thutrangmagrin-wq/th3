import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const CustomInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  rightIcon = null,
  error = '',
  validated = false,
}) => {
  // Ensure validated is boolean
  const isValidated = validated === true;
  
  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#7C7C7C"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        {isValidated && !rightIcon && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    paddingBottom: 8,
  },
  inputError: {
    borderBottomColor: '#F44336',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#181725',
    paddingVertical: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  checkmark: {
    color: '#53B175',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput;
