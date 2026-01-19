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

const SplashScreen = ({navigation}: any) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });

    opacity.value = withDelay(200, withTiming(1, {duration: 800}));

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'PinScreen'}],
      });
    }, 2200);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={['rgb(20, 19, 38)', 'rgba(232, 64, 64, 0.5)']}
      start={{x: 1, y: 0.8}}
      end={{x: 0.5, y: 1.5}}
      style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={animatedStyle}>
        <Image
          source={Images.imgLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.appName, animatedStyle]}>
        Cashio
      </Animated.Text>

      <Animated.Text style={[styles.tagline, animatedStyle]}>
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
