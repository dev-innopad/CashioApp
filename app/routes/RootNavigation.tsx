import {NavigationContainer} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import I18n from 'react-native-i18n';
import {useSelector} from 'react-redux';
import {NavigationKeys} from '../constants/navigationKeys';
import AppearanceScreen from '../screens/SettingScreen/Settings.Appearance';
import SplashScreen from '../screens/SplashScreen';
import BottomTabNavigation from './BottomTabNavigator';
import SettingsChangeLanguage from '../screens/SettingScreen/Settings.ChangeLanguage';
import SettingsChangeAppIcon from '../screens/SettingScreen/Settings.ChangeAppIcon';
import AuthNavigator from './AuthNavigator';
import PinScreen from '../screens/PinScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CheckUserScreen from '../screens/CheckUserScreen';

const Stack = createNativeStackNavigator();

const RootNavigation: React.FC = (props: any) => {
  const stackOptions: NativeStackNavigationOptions = {animation: 'none'};
  const stackScreenOptions: NativeStackNavigationOptions = {
    gestureEnabled: true,
  };

  const appData = useSelector((state: any) => state.appData);
  I18n.locale = appData.localize;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen
          name={NavigationKeys.SplashScreen}
          component={SplashScreen}
        />
        <Stack.Screen
          options={stackOptions}
          name={NavigationKeys.AuthNavigator}
          component={AuthNavigator}
        />
        <Stack.Screen
          options={stackOptions}
          name={NavigationKeys.BottomTab}
          component={BottomTabNavigation}
        />
        <Stack.Screen
          options={stackScreenOptions}
          name={NavigationKeys.AppearanceScreen}
          component={AppearanceScreen}
        />
        <Stack.Screen
          options={stackScreenOptions}
          name={NavigationKeys.SettingsChangeLanguage}
          component={SettingsChangeLanguage}
        />
        <Stack.Screen
          options={stackScreenOptions}
          name={NavigationKeys.SettingChangeAppIcon}
          component={SettingsChangeAppIcon}
        />
        <Stack.Screen
          options={{animation: 'none'}}
          name={NavigationKeys.PinScreen}
          component={PinScreen}
        />
        <Stack.Screen
          options={stackScreenOptions}
          name={NavigationKeys.AddExpenseScreen}
          component={AddExpenseScreen}
        />
        <Stack.Screen
          options={stackScreenOptions}
          name={NavigationKeys.WelcomeScreen}
          component={WelcomeScreen}
        />
        <Stack.Screen
          options={stackScreenOptions}
          name={NavigationKeys.RegisterScreen}
          component={RegisterScreen}
        />
        <Stack.Screen
          options={stackScreenOptions}
          name={NavigationKeys.CheckUserScreen}
          component={CheckUserScreen}
        />
        <Stack.Screen
          // options={stackScreenOptions}
          name={NavigationKeys.AddCategoryScreen}
          component={AddCategoryScreen}
          options={{
            headerShown: false,
            presentation: 'modal', // Makes it slide up like a modal
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
