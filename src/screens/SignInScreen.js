import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Logo from '../components/Logo';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import AuthService from '../services/AuthService';
import { validatePhoneNumber } from '../utils/validation';

const SignInScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneAuth = async () => {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await AuthService.authenticateWithPhone(phoneNumber);
      
      if (result.success) {
        navigation.replace('Home', { user: result.user });
      } else {
        if (result.error.code === 'NETWORK_ERROR') {
          Alert.alert('Network Error', result.error.message);
        } else {
          setError(result.error.message || 'Authentication failed');
        }
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await AuthService.authenticateWithGoogle();
      
      if (result.success) {
        navigation.replace('Home', { user: result.user });
      } else {
        if (result.error.code !== 'NOT_IMPLEMENTED') {
          Alert.alert('Error', result.error.message);
        } else {
          Alert.alert('Coming Soon', result.error.message);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    try {
      const result = await AuthService.authenticateWithFacebook();
      
      if (result.success) {
        navigation.replace('Home', { user: result.user });
      } else {
        if (result.error.code !== 'NOT_IMPLEMENTED') {
          Alert.alert('Error', result.error.message);
        } else {
          Alert.alert('Coming Soon', result.error.message);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Logo size="large" />
      </View>

      <Text style={styles.title}>Get your groceries</Text>
      <Text style={styles.title}>with nectar</Text>

      <View style={styles.inputContainer}>
        <CustomInput
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            if (error) setError('');
          }}
          placeholder="+880"
          keyboardType="phone-pad"
          error={error}
        />
      </View>

      <Text style={styles.orText}>Or connect with social media</Text>

      <View style={styles.socialButtonsContainer}>
        <CustomButton
          title="Continue with Google"
          onPress={handleGoogleAuth}
          variant="social-google"
          loading={loading}
        />
        <CustomButton
          title="Continue with Facebook"
          onPress={handleFacebookAuth}
          variant="social-facebook"
          loading={loading}
        />
      </View>

      <TouchableOpacity onPress={navigateToSignUp} style={styles.signUpLink}>
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={styles.signUpTextBold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  orText: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 14,
    marginVertical: 20,
  },
  socialButtonsContainer: {
    marginTop: 10,
  },
  signUpLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#181725',
  },
  signUpTextBold: {
    color: '#53B175',
    fontWeight: '600',
  },
});

export default SignInScreen;
