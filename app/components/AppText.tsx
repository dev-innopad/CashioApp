import React from 'react';
import { Pressable, StyleSheet, Text, TextProps } from 'react-native';
import { AppFonts, FontSize } from '../assets/fonts';
import { useTheme } from '../theme/ThemeProvider';

interface AppTextProps extends TextProps {
	title?: string;
	subtitle?: string;
	label?: string;
	textColor?: string;
	fontSize?: number;
	textAlign?: 'left' | 'right' | 'center' | 'justify';
	numberOfLines?: number;
	onPressText?: () => void;
}

const AppText = ({
	title,
	subtitle,
	label,
	style,
	textColor,
	fontSize,
	textAlign = 'left',
	numberOfLines,
	onPressText,
	...props
}: AppTextProps) => {
	const { AppColors } = useTheme();

	let textContent: string | null = '';
	let fontFamily = AppFonts.REGULAR;
	let fontSizeStyle = fontSize;

	// Use switch case to determine the text content, font family, and font size
	switch (true) {
		case !!title:
			textContent = title;
			fontFamily = AppFonts.BOLD;
			fontSizeStyle = fontSize || FontSize._20;
			break;
		case !!subtitle:
			textContent = subtitle;
			fontFamily = AppFonts.MEDIUM;
			fontSizeStyle = fontSize || FontSize._16;
			break;
		case !!label:
			textContent = label;
			fontFamily = AppFonts.REGULAR;
			fontSizeStyle = fontSize || FontSize._14;
			break;
		default:
			textContent = ''; // Default case, empty string
	}

	// Combine the default style with the customized one
	const combinedStyle = [
		styles.text, {
			color: textColor || AppColors.textColor,
			fontSize: fontSizeStyle,
			fontFamily,
			textAlign,
		}, style];

	return (
		<Pressable style={{ pointerEvents: onPressText ? 'auto' : 'none' }} onPress={onPressText}>
			<Text {...props} style={combinedStyle} numberOfLines={numberOfLines}>
				{textContent}
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	text: {
		fontFamily: AppFonts.REGULAR,
	},
});

export default AppText;
