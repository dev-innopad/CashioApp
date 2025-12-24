import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Images } from '../../assets/images';
import { allCenter } from '../../constants/commonStyle';
import { AppDispatch } from '../../store';
import { AppColorTypes } from '../../theme/AppColors';
import { useTheme } from '../../theme/ThemeProvider';

interface SplashScreenProps {
	navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = (props) => {
	const dispatch: AppDispatch = useDispatch();
	const isLogin = useSelector((state: any) => state.appData.isLogin);
	const { AppColors } = useTheme();
	const styles = createStyles(AppColors);

	useEffect(() => {
		const unsubscribe = props.navigation.addListener('focus', () => {
			setTimeout(() => {
				switch (isLogin) {
					case true: props.navigation.navigate('BottomTab');
						break;
					case false: props.navigation.navigate('BottomTab');
						break;
					default:
				}
			}, 2000);
		});

		return () => { unsubscribe() };
	}, [isLogin, props.navigation, dispatch]);

	return (
		<View style={styles.container}>
			<Image source={Images.imgSplash} />
		</View>
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: AppColors.background,
			...allCenter,
		},
	});
};

export default SplashScreen;
