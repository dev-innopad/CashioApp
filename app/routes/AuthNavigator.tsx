import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NavigationKeys } from '../constants/navigationKeys';
import LoginScreen from '../screens/Auth/LoginScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import AppSlideShow from '../screens/Auth/AppSlideShow';

const Stack = createNativeStackNavigator();

const AuthNavigator: React.FC = () => {
	return (
		<Stack.Navigator initialRouteName={NavigationKeys.LoginScreen} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={NavigationKeys.LoginScreen} component={LoginScreen} />
			<Stack.Screen name={NavigationKeys.OtpScreen} component={OtpScreen} />
			<Stack.Screen name={NavigationKeys.AppSlideShow} component={AppSlideShow} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;