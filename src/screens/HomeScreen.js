import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import AuthService from '../services/AuthService';

const HomeScreen = ({ navigation, route }) => {
  const user = route.params?.user;

  const handleLogout = async () => {
    await AuthService.logout();
    navigation.replace('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Nectar!</Text>
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user.username}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          variant="primary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#181725',
    textAlign: 'center',
    marginBottom: 40,
  },
  userInfo: {
    backgroundColor: '#F2F3F2',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#181725',
    fontWeight: '600',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
