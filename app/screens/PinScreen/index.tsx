import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable, StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AppMainContainer from '../../components/AppMainContainer';
import AppText from '../../components/AppText';
import {FontSize} from '../../assets/fonts';
import {Delete} from 'lucide-react-native';
import {useTheme} from '../../theme/ThemeProvider';

const PIN_LENGTH = 4;
const SUCCESS_PIN = '1234';

export default function PinScreen({navigation}: any) {
  const {AppColors} = useTheme();
  const [pin, setPin] = useState<string[]>([]);

  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      const enteredPin = pin.join('');
      if (enteredPin === SUCCESS_PIN) {
        setTimeout(() => {
          navigation?.replace?.('BottomTab');
        }, 300);
      } else {
        triggerShake();
        setTimeout(() => setPin([]), 600);
      }
    }
  }, [pin]);

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-12, {duration: 60}),
      withTiming(12, {duration: 60}),
      withTiming(-8, {duration: 60}),
      withTiming(8, {duration: 60}),
      withTiming(0, {duration: 60}),
    );
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shakeX.value}],
  }));

  const onPressKey = (num: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin([...pin, num]);
    }
  };

  const onDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const KeyButton = ({label, onPress}: any) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    return (
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.85))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        style={styles.key}>
        <Animated.View style={animatedStyle}>
          <AppText
            style={styles.keyText}
            title={label}
            textColor={AppColors.basicWhite}
          />
        </Animated.View>
      </Pressable>
    );
  };

  const DeleteButton = () => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    return (
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.85))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onDelete}
        style={styles.key}>
        <Animated.View style={animatedStyle}>
          <Delete size={30} color={AppColors.basicWhite} />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <AppMainContainer hideTop hideBottom>
      <StatusBar barStyle={'light-content'} translucent={false} />
      <LinearGradient colors={['#141326', '#4A1622']} style={styles.container}>
        <AppText
          style={styles.title}
          title="Enter Pin (1234)"
          textColor="rgba(255,255,255,0.6)"
        />
        <Animated.View style={[styles.dotContainer, shakeStyle]}>
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              style={[styles.dot, pin.length > i && styles.dotFilled]}
            />
          ))}
        </Animated.View>

        <View style={styles.keypad}>
          <View style={styles.keyRow}>
            {[1, 2, 3].map(n => (
              <KeyButton
                key={n}
                label={n.toString()}
                onPress={() => onPressKey(n.toString())}
              />
            ))}
          </View>

          <View style={styles.keyRow}>
            {[4, 5, 6].map(n => (
              <KeyButton
                key={n}
                label={n.toString()}
                onPress={() => onPressKey(n.toString())}
              />
            ))}
          </View>

          <View style={styles.keyRow}>
            {[7, 8, 9].map(n => (
              <KeyButton
                key={n}
                label={n.toString()}
                onPress={() => onPressKey(n.toString())}
              />
            ))}
          </View>

          {/* Fourth row: empty, 0, delete */}
          <View style={styles.keyRow}>
            <View style={styles.key} /> {/* Empty space */}
            <KeyButton label="0" onPress={() => onPressKey('0')} />
            <DeleteButton />
          </View>
        </View>
      </LinearGradient>
    </AppMainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize._22,
    marginBottom: 30,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 50,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotFilled: {
    backgroundColor: '#FFFFFF',
  },
  keypad: {
    width: '80%',
    justifyContent: 'center',
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  key: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: FontSize._26,
  },
});
