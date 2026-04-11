import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const ONBOARDING_KEY = 'onboarding_completed';

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const determineInitialRoute = async () => {
      try {
        // Check if onboarding is completed
        const onboardingCompleted = await AsyncStorage.getItem(ONBOARDING_KEY);
        
        // Check if user is authenticated
        const isAuthenticated = await AuthService.isAuthenticated();
        
        if (isAuthenticated === true) {
          setInitialRoute('Home');
        } else if (onboardingCompleted === 'true') {
          setInitialRoute('SignIn');
        } else {
          setInitialRoute('Onboarding');
        }
      } catch (error) {
        console.error('Error determining initial route:', error);
        setInitialRoute('Onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    determineInitialRoute();
  }, []);

  if (isLoading || !initialRoute) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
