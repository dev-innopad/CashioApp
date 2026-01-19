import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {FC, useMemo, useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import {trigger} from 'react-native-haptic-feedback';
import {Icons} from '../assets/icons';
import {AppFonts} from '../assets/fonts';
import {AppShadow} from '../constants/commonStyle';
import {NavigationKeys} from '../constants/navigationKeys';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import ReportScreen from '../screens/ReportScreen';
import BudgetScreen from '../screens/BudgetScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {AppColorTypes} from '../theme/AppColors';
import {useTheme} from '../theme/ThemeProvider';

// Import Lucide icons
import {
  Home as HomeIcon,
  BarChart3 as ChartIcon,
  Wallet as WalletIcon,
  User as UserIcon,
  Plus,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const BottomTab = createBottomTabNavigator();

interface TabItem {
  icon: string;
  text: string;
  screen: string;
  iconComponent?: React.ComponentType<any>;
}

interface CustomBottomTabProps {
  tabValue: TabItem[];
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomBottomTab: FC<CustomBottomTabProps> = ({
  tabValue,
  state,
  navigation,
}) => {
  const {AppColors} = useTheme();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);
  const [fabScale] = useState(new Animated.Value(1));
  const [fabRotation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fabScale, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(fabScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  const handleFabPress = () => {
    // Scale animation
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fabRotation, {
        toValue: fabRotation.__getValue() + 180,
        duration: 300,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        useNativeDriver: true,
      }),
    ]).start();

    trigger('impactMedium');

    // Navigate after animation
    setTimeout(() => {
      navigation.navigate('AddExpenseScreen');
    }, 150);
  };

  const rotateInterpolate = fabRotation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const renderTabItem = (item: TabItem, index: number) => {
    const isSelected = state.index === index;
    const iconSource = Icons[item.icon as keyof typeof Icons];
    const IconComponent = item.iconComponent;

    return (
      <TouchableOpacity
        key={index}
        style={styles.tabItem}
        onPress={() => {
          navigation.navigate(item.screen);
          trigger('impactLight');
        }}
        activeOpacity={0.7}>
        <View style={styles.iconWrapper}>
          <View
            style={[
              styles.iconBackground,
              isSelected && styles.activeIconBackground,
            ]}>
            {IconComponent ? (
              <IconComponent
                size={22}
                color={isSelected ? '#FFFFFF' : '#8B8BA0'}
              />
            ) : (
              <Image
                source={iconSource}
                style={[
                  styles.iconImage,
                  {
                    tintColor: isSelected ? '#FFFFFF' : '#8B8BA0',
                  },
                ]}
              />
            )}
          </View>
        </View>

        {/* <Text style={[styles.textStyle, isSelected && styles.activeTextStyle]}>
          {item.text}
        </Text> */}

        {isSelected && <View style={styles.activePill} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bottomTabContainer}>
      {/* Background with curved effect */}
      <View style={styles.backgroundCurve} />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={handleFabPress}
        activeOpacity={0.9}>
        <Animated.View
          style={[
            styles.fabOuterGlow,
            {
              transform: [{scale: fabScale}, {rotate: rotateInterpolate}],
            },
          ]}>
          <LinearGradient
            colors={['#FF6B35', '#F97316', '#FDBA74']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              borderRadius: 100,
              // borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}>
            {/* <View style={styles.iconCenterContainer}> */}
            <Plus size={25} color="#FFFFFF" />
            {/* </View> */}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {/* Tab Items */}
      <View style={styles.tabBar}>
        {tabValue.map((item, index) => renderTabItem(item, index))}
      </View>
    </View>
  );
};

const BottomTabNavigation: FC = () => {
  const {AppColors} = useTheme();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  const tabValue: TabItem[] = [
    {
      icon: 'icnHome',
      text: 'Home',
      screen: NavigationKeys.HomeScreen,
      iconComponent: HomeIcon,
    },
    {
      icon: 'icnReport',
      text: 'Insights',
      screen: NavigationKeys.ReportScreen,
      iconComponent: ChartIcon,
    },
    {
      icon: 'icnBudget',
      text: 'Budget',
      screen: NavigationKeys.BudgetScreen,
      iconComponent: WalletIcon,
    },
    {
      icon: 'icnProfile',
      text: 'Profile',
      screen: NavigationKeys.ProfileScreen,
      iconComponent: UserIcon,
    },
  ];

  return (
    <BottomTab.Navigator
      initialRouteName={NavigationKeys.HomeScreen}
      tabBar={props => <CustomBottomTab {...props} tabValue={tabValue} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
      safeAreaInsets={{bottom: 0}}>
      <BottomTab.Screen
        name={NavigationKeys.HomeScreen}
        component={HomeScreen}
      />
      <BottomTab.Screen
        name={NavigationKeys.ReportScreen}
        component={ReportScreen}
      />
      <BottomTab.Screen
        name={NavigationKeys.BudgetScreen}
        component={BudgetScreen}
      />
      <BottomTab.Screen
        name={NavigationKeys.ProfileScreen}
        component={ProfileScreen}
      />
    </BottomTab.Navigator>
  );
};

const createStyles = (AppColors: AppColorTypes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppColors.background,
    },
    bottomTabContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 90,
      backgroundColor: 'transparent',
    },
    backgroundCurve: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 90,
      backgroundColor: '#1F1D3A',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      // paddingHorizontal: 16,
    },
    tabItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      // paddingVertical: 8,
      // position: 'relative',
    },
    iconWrapper: {
      marginBottom: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBackground: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeIconBackground: {
      backgroundColor: 'rgba(249, 115, 22, 0.15)',
      borderColor: 'rgba(249, 115, 22, 0.3)',
    },
    iconImage: {
      width: 22,
      height: 22,
      resizeMode: 'contain',
    },
    textStyle: {
      fontSize: 11,
      fontFamily: AppFonts.MEDIUM,
      color: '#8B8BA0',
      letterSpacing: 0.3,
      marginTop: 2,
    },
    activeTextStyle: {
      color: '#F97316',
      fontFamily: AppFonts.SEMIBOLD,
    },
    activePill: {
      position: 'absolute',
      top: -12,
      width: 28,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#F97316',
      shadowColor: '#F97316',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 3,
    },
    fabContainer: {
      // position: 'absolute',
      top: -25,
      alignSelf: 'center',
      // zIndex: 20,
    },
    fabOuterGlow: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      // alignItems: 'center',
      // justifyContent: 'center',
      shadowColor: '#F97316',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
    },
    fabGradient: {
      width: 56,
      height: 56,
      position: 'absolute',
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    iconCenterContainer: {
      flex: 1,
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default BottomTabNavigation;
