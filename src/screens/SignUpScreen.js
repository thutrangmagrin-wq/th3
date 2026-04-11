import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Logo from '../components/Logo';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import AuthService from '../services/AuthService';
import { validateEmail, validatePassword } from '../utils/validation';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Debounced email validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        const valid = validateEmail(email);
        setIsEmailValid(valid);
        if (!valid && email.length > 0) {
          setEmailError('Please enter a valid email address');
        } else {
          setEmailError('');
        }
      } else {
        setIsEmailValid(false);
        setEmailError('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [email]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setTermsError('');

    // Validate all fields
    let hasError = false;

    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      hasError = true;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, and number');
      hasError = true;
    }

    if (!agreedToTerms) {
      setTermsError('You must accept the terms to continue');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const result = await AuthService.registerWithEmail({
        username: username.trim(),
        email: email.trim(),
        password,
        agreedToTerms,
      });

      if (result.success) {
        navigation.replace('Home', { user: result.user });
      } else {
        if (result.error.code === 'EMAIL_EXISTS') {
          Alert.alert(
            'Email Already Registered',
            'This email is already registered. Please sign in.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign In', onPress: navigateToSignIn },
            ]
          );
        } else if (result.error.code === 'NETWORK_ERROR') {
          Alert.alert('Network Error', result.error.message);
        } else {
          Alert.alert('Error', result.error.message || 'Registration failed');
        }
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Logo size="medium" />
      </View>

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Enter your credentials to continue</Text>

      <View style={styles.formContainer}>
        <CustomInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
        />

        <CustomInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError('');
          }}
          placeholder="Email"
          keyboardType="email-address"
          error={emailError}
          validated={isEmailValid}
        />

        <CustomInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError('');
          }}
          placeholder="Password"
          secureTextEntry={!showPassword}
          error={passwordError}
          rightIcon={
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          }
        />

        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => {
              setAgreedToTerms(!agreedToTerms);
              if (termsError) setTermsError('');
            }}
          >
            <View style={[styles.checkboxBox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              By continuing you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {termsError ? <Text style={styles.termsError}>{termsError}</Text> : null}
        </View>

        <CustomButton
          title="Sign Up"
          onPress={handleSignUp}
          variant="primary"
          loading={loading}
          disabled={loading}
        />

        <TouchableOpacity onPress={navigateToSignIn} style={styles.signInLink}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#181725',
  },
  subtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 8,
    marginBottom: 30,
  },
  formContainer: {
    marginTop: 10,
  },
  eyeIcon: {
    fontSize: 20,
  },
  termsContainer: {
    marginVertical: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#7C7C7C',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#53B175',
    borderColor: '#53B175',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#7C7C7C',
    lineHeight: 18,
  },
  termsLink: {
    color: '#53B175',
  },
  termsError: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 30,
  },
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#181725',
  },
  signInTextBold: {
    color: '#53B175',
    fontWeight: '600',
  },
});

export default SignUpScreen;
