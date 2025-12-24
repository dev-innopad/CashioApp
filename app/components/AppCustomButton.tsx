import React, { memo } from 'react';
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Spinner from 'react-native-spinkit';
import { FontSize } from '../assets/fonts';
import { borderRadius10 } from '../constants/commonStyle';
import { AppHeight, AppHorizontalPadding, AppVerticalPadding } from '../constants/responsive';
import { useTheme } from '../theme/ThemeProvider';
import AppText from './AppText';

interface AppCustomButtonProps {
	label: string;
	onPress: () => void;
	backgroundColor?: string;
	textColor?: string;
	fontSize?: number;
	borderRadius?: number;
	style?: ViewStyle;
	textStyle?: TextStyle;
	isBottom?: boolean;
	containerStyle?: ViewStyle;
	isLoading?: boolean;
}

const AppCustomButton = ({
	label,
	onPress,
	backgroundColor,
	textColor,
	fontSize = FontSize._14,
	borderRadius = borderRadius10.borderRadius,
	style,
	textStyle,
	isBottom = false,
	isLoading = false,
	containerStyle,
}: AppCustomButtonProps) => {
	const { AppColors } = useTheme();

	const buttonStyles = [
		styles.button, {
			backgroundColor: backgroundColor || AppColors.primary100,
			borderRadius,
		}, style];

	const buttonTextStyles = [
		styles.buttonText,
		textStyle,
	];

	const containerStyles = [
		styles.container,
		isBottom && styles.flexBottom,
		containerStyle,
	];

	return (
		<View style={containerStyles}>
			<Pressable style={buttonStyles} onPress={onPress}>
				{!isLoading ? <AppText label={label}
					fontSize={fontSize}
					textColor={textColor || AppColors.textColor}
					style={buttonTextStyles}
				/> : <Spinner type={'Wave'}
					isVisible={isLoading}
					size={AppHeight._20}
					color={AppColors.basicWhite}
				/>}
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// flex: 1,
	},
	flexBottom: {
		justifyContent: 'flex-end'
	},
	button: {
		paddingVertical: AppVerticalPadding._15,
		paddingHorizontal: AppHorizontalPadding._20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		textAlign: 'center',
	},
});

// Memoize to avoid unnecessary re-renders when props remain the same
export default memo(AppCustomButton);
