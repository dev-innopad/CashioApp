import React, {useEffect} from 'react';
import {StyleSheet, Image, StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import {Images} from '../../assets/images';
import {AppFonts} from '../../assets/fonts';
import index from '../OnboardingScreen';
import {useSelector} from 'react-redux';
import {NavigationKeys} from '../../constants/navigationKeys';

const SplashScreen = ({navigation}: any) => {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const isAuthenticated = useSelector(
    (state: any) => state.userData.isAuthenticated,
  );
  const isLoading = useSelector((state: any) => state.userData.isLoading);
  const currentUser = useSelector((state: any) => state.userData.currentUser);

  useEffect(() => {
    // Start animations
    logoScale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });

    logoOpacity.value = withDelay(200, withTiming(1, {duration: 800}));
    textOpacity.value = withDelay(400, withTiming(1, {duration: 800}));

    // Check if user exists
    setTimeout(() => {
      if (isLoading) return;

      console.log(
        'isAuthenticated && currentUser',
        isAuthenticated,
        currentUser,
      );

      if (isAuthenticated && currentUser) {
        if (currentUser.isFirstLogin) {
          navigation.replace(NavigationKeys.PinScreen);
        } else {
          navigation.replace(NavigationKeys.PinScreen);
        }
      } else {
        // No user found, go to welcome screen
        navigation.replace(NavigationKeys.WelcomeScreen);
      }
    }, 2000);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: logoScale.value}],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['rgb(20, 19, 38)', 'rgba(232, 64, 64, 0.5)']}
      start={{x: 1, y: 0.8}}
      end={{x: 0.5, y: 1.5}}
      style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={logoAnimatedStyle}>
        <Image
          source={Images.imgLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.appName, textAnimatedStyle]}>
        Cashio
      </Animated.Text>

      <Animated.Text style={[styles.tagline, textAnimatedStyle]}>
        YOUR EXPENSE TRACKER, SIMPLIFIED
      </Animated.Text>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontFamily: AppFonts.EXTRA_BOLD,
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: AppFonts.MEDIUM,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
});
