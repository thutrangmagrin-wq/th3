import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

const ONBOARDING_KEY = 'onboarding_completed';

const OnboardingScreen = ({ navigation }) => {
  useEffect(() => {
    // Mark onboarding as completed when screen is displayed
    const markOnboardingComplete = async () => {
      try {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      } catch (error) {
        console.error('Error marking onboarding complete:', error);
      }
    };
    markOnboardingComplete();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🥕</Text>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.title}>to our store</Text>
              <Text style={styles.subtitle}>Get your groceries in as fast as one hour</Text>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Get Started"
                onPress={handleGetStarted}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 60,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default OnboardingScreen;
