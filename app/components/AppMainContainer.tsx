import React, { ReactNode, useMemo } from 'react';
import { SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { AppColorTypes } from '../theme/AppColors';
import { useTheme } from '../theme/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';

interface AppMainContainerProps {
	topColor?: string;
	hideTop?: boolean;
	bottomColor?: string;
	hideBottom?: boolean;
	children: ReactNode;
	style?: ViewStyle;
	gradientColors?: string[];
	transparentTop?: boolean;  //  prop to toggle top transparency
	transparentBottom?: boolean;  //  prop to toggle button transparency
	useGradient?: boolean; //  prop to toggle LinearGradient
}

const AppMainContainer: React.FC<AppMainContainerProps> = ({
	children,
	style,
	hideTop,
	hideBottom,
	topColor,
	bottomColor,
	transparentTop = false, // top safe area view transparent
	transparentBottom = false, // bottom safe area view transparent
	useGradient = false, // Default to false
}) => {

	const { AppColors } = useTheme();
	const gradientColors = [AppColors.warning, AppColors.primary20]
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const {
		containerStyle,
		topSafeAreaStyle,
		bottomSafeAreaStyle
	} = useMemo(() => {
		return {
			containerStyle: [styles.container, style],
			topSafeAreaStyle: {
				backgroundColor: transparentTop
					? 'transparent'
					: topColor ?? AppColors.background,
			},
			bottomSafeAreaStyle: {
				backgroundColor: transparentBottom
					? 'transparent'
					: bottomColor ?? AppColors.background,
			},
		};
	}, [
		style,
		topColor,
		bottomColor,
		transparentTop,
		transparentBottom,
		AppColors.background,
	]);

	// Dynamically choose between View and LinearGradient
	const Container: any = useGradient
		? LinearGradient
		: View;

	// Props specific to container
	const containerProps = useGradient
		? { colors: gradientColors, style: containerStyle }
		: { style: containerStyle };

	return (
		<Container {...containerProps}>
			{!hideTop && <SafeAreaView style={topSafeAreaStyle} />}
			{children}
			{!hideBottom && <SafeAreaView style={bottomSafeAreaStyle} />}
		</Container>
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: AppColors.background,
		}
	});
};

export default React.memo(AppMainContainer);