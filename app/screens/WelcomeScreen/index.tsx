// screens/WelcomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Images} from '../../assets/images';
import {NavigationKeys} from '../../constants/navigationKeys';

export default function WelcomeScreen({navigation}: any) {
  return (
    <LinearGradient
      colors={['rgb(20, 19, 38)', 'rgba(232, 64, 64, 0.5)']}
      start={{x: 1, y: 0.8}}
      end={{x: 0.5, y: 1.5}}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Cashio</Text>
            <Text style={styles.subtitle}>
              Track your expenses, manage your budget, and achieve your
              financial goals
            </Text>
          </View>

          {/* <Image
            source={require('../assets/welcome-illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
          /> */}

          <Image
            source={Images.imgLogo}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() =>
                navigation.navigate(NavigationKeys.RegisterScreen)
              }>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() =>
                navigation.replace(NavigationKeys.CheckUserScreen)
              }>
              <Text style={styles.secondaryButtonText}>I Have an Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  illustration: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#F4C66A',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    marginBottom: 16,
  },
});
