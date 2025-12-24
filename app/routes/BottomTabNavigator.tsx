import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC, useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { trigger } from "react-native-haptic-feedback";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icons } from '../assets/icons';
import { AppFonts } from '../assets/fonts';
import { AppShadow } from '../constants/commonStyle';
import { NavigationKeys } from '../constants/navigationKeys';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import { AppColorTypes } from '../theme/AppColors';
import { useTheme } from '../theme/ThemeProvider';
import { AppHeight, AppMargin } from '../constants/responsive';

const BottomTab = createBottomTabNavigator();

interface TabItem {
	icon: string;
	text: string;
	screen: string;
}

interface CustomBottomTabProps {
	tabValue: TabItem[];
	state: any;
	navigation: any;
}

const CustomBottomTab: FC<CustomBottomTabProps> = ({ tabValue, state, navigation }) => {

	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const renderTabItem = (item: TabItem, index: React.Key | null | undefined) => {

		const isSelected = state.index == index;
		const iconSource = Icons[item.icon as keyof typeof Icons];
		const textColor = isSelected
			? AppColors.primary100
			: AppColors.secondary60;

		return (
			<TouchableOpacity key={index} style={{ alignItems: 'center' }}
				onPress={() => {
					navigation.navigate(item.screen);
					trigger('impactLight');
				}}>

				<Image source={iconSource} style={{ marginTop: 15, tintColor: textColor }} />

				{/* uncomment if you want to show texts */}
				{/* <AppText style={[styles.textStyle, { color: textColor }]}
					label={item.text}
				/> */}
			</TouchableOpacity>
		);
	};

	return (
		<View style={[AppShadow, styles.AppMainContainer]}>
			<View style={styles.subContainer}>
				{tabValue.map((item, index) => renderTabItem(item, index))}
			</View>
		</View>
	);

};

const BottomTabNavigation: FC = () => {

	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const tabValue: TabItem[] = [
		{ icon: 'icnHome', text: 'Home', screen: NavigationKeys.HomeScreen },
		{ icon: 'icnSetting', text: 'Setting', screen: NavigationKeys.SettingScreen },
	];

	return (
		<View style={styles.insideContainer}>
			<BottomTab.Navigator initialRouteName={NavigationKeys.HomeScreen}
				tabBar={(props) => <CustomBottomTab {...props} tabValue={tabValue} />}
				screenOptions={{ headerShown: false, animation: 'shift' }}>
				<BottomTab.Screen name={NavigationKeys.HomeScreen} component={HomeScreen} />
				<BottomTab.Screen name={NavigationKeys.SettingScreen} component={SettingScreen} />
			</BottomTab.Navigator>
		</View>
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		AppMainContainer: {
			bottom: 0,
			position: 'absolute',
			width: '100%',
			backgroundColor: AppColors.background,
		},

		subContainer: {
			flexDirection: 'row',
			height: AppHeight._70,
			justifyContent: 'space-evenly',
			alignSelf: 'center',
			width: '100%',
		},

		textStyle: {
			marginTop: AppMargin._10,
			fontSize: 12,
			fontFamily: AppFonts.REGULAR,
		},

		insideContainer: {
			flex: 1,
			zIndex: 1,
			backgroundColor: AppColors.background
		},
	});
};

export default BottomTabNavigation;