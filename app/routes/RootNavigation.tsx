import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import I18n from 'react-native-i18n';
import { useSelector } from 'react-redux';
import { NavigationKeys } from '../constants/navigationKeys';
import AppearanceScreen from '../screens/SettingScreen/Settings.Appearance';
import SplashScreen from '../screens/SplashScreen';
import BottomTabNavigation from './BottomTabNavigator';
import SettingsChangeLanguage from '../screens/SettingScreen/Settings.ChangeLanguage';
import SettingsChangeAppIcon from '../screens/SettingScreen/Settings.ChangeAppIcon';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

const RootNavigation: React.FC = (props: any) => {

	const stackOptions: NativeStackNavigationOptions = { animation: 'none' };
	const stackScreenOptions: NativeStackNavigationOptions = { gestureEnabled: true };

	const appData = useSelector((state: any) => state.appData);
	I18n.locale = appData.localize;

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
				<Stack.Screen name={NavigationKeys.SplashScreen} component={SplashScreen} />
				<Stack.Screen options={stackOptions} name={NavigationKeys.AuthNavigator} component={AuthNavigator} />
				<Stack.Screen options={stackOptions} name={NavigationKeys.BottomTab} component={BottomTabNavigation} />
				<Stack.Screen options={stackScreenOptions} name={NavigationKeys.AppearanceScreen} component={AppearanceScreen} />
				<Stack.Screen options={stackScreenOptions} name={NavigationKeys.SettingsChangeLanguage} component={SettingsChangeLanguage} />
				<Stack.Screen options={stackScreenOptions} name={NavigationKeys.SettingChangeAppIcon} component={SettingsChangeAppIcon} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigation;