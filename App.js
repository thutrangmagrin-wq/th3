import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ImageBackground, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Auto navigate from splash to onboarding after 3 seconds
  React.useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Splash Screen
  if (currentScreen === 'splash') {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Text style={styles.splashLogo}>🥕</Text>
          <Text style={styles.splashTitle}>nectar</Text>
          <Text style={styles.splashSubtitle}>online groceries</Text>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  // Onboarding Screen
  if (currentScreen === 'onboarding') {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('./assets/onboarding-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.onboardingContent}>
              <Text style={styles.logoEmoji}>🥕</Text>
              <Text style={styles.onboardingTitle}>Welcome</Text>
              <Text style={styles.onboardingTitle}>to our store</Text>
              <Text style={styles.onboardingSubtitle}>Get your groceries in as fast as one hour</Text>
              
              <Text style={styles.authorName}>Đỗ Quỳnh Thu Trang</Text>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => setCurrentScreen('signin')}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <StatusBar style="light" />
      </View>
    );
  }

  // Sign In Screen
  if (currentScreen === 'signin') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('./assets/signin-logo.png')}
            style={styles.signinLogo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Get your groceries</Text>
        <Text style={styles.title}>with nectar</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="+880"
            placeholderTextColor="#7C7C7C"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.orText}>Or connect with social media</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookButton}>
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by Đỗ Quỳnh Thu Trang</Text>
        </View>

        <StatusBar style="dark" />
      </ScrollView>
    );
  }

  // Sign Up Screen
  if (currentScreen === 'signup') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmojiSmall}>🥕</Text>
        </View>

        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#7C7C7C"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#7C7C7C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {email.includes('@') && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7C7C7C"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => alert('Sign up successful!')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('signin')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by Đỗ Quỳnh Thu Trang</Text>
        </View>

        <StatusBar style="dark" />
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogo: {
    fontSize: 100,
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#FFF',
    letterSpacing: 4,
    marginTop: 8,
    opacity: 0.9,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 40,
  },
  logoEmojiSmall: {
    fontSize: 60,
  },
  onboardingTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    opacity: 0.9,
  },
  authorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  signinLogo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 8,
    marginBottom: 30,
  },
  inputContainer: {
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#181725',
    paddingVertical: 12,
  },
  checkmark: {
    color: '#53B175',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  googleButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#5383EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  facebookButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#4A66AC',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 14,
    marginVertical: 20,
  },
  termsContainer: {
    marginVertical: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#7C7C7C',
    lineHeight: 18,
    textAlign: 'center',
  },
  termsLink: {
    color: '#53B175',
  },
  linkText: {
    fontSize: 14,
    color: '#181725',
    textAlign: 'center',
    marginTop: 20,
  },
  linkTextBold: {
    color: '#53B175',
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7C7C7C',
    fontStyle: 'italic',
  },
});
