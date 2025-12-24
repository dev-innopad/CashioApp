import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AppFonts, FontSize } from '../assets/fonts';
import { Icons } from '../assets/icons';
import { AppHeight } from '../constants/responsive';
import { useTheme } from '../theme/ThemeProvider';
import AppText from './AppText';

type AppHeaderProps = {
	title?: string;
	onBackPress?: () => void;
	backgroundColor?: string;
	textColor?: string;
};

const AppHeader = ({ title, onBackPress, backgroundColor, textColor }: AppHeaderProps) => {

	const { AppColors } = useTheme();

	return (
		<View style={[styles.headerContainer, { backgroundColor: backgroundColor ?? AppColors.background }]}>
			<Pressable onPress={onBackPress} style={styles.iconContainer}>
				<Image source={Icons.icnBack}
					style={[styles.headerIcon, { tintColor: textColor ?? AppColors.primary100 }]}
				/>
			</Pressable>

			<View style={styles.titleContainer}>
				<AppText subtitle={title || 'Settings'}
					textColor={textColor ?? AppColors.primary100}
					style={styles.titleText}
				/>
			</View>

			<View style={styles.emptySpace} />
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: AppHeight._10,
		justifyContent: 'space-between',
	},
	iconContainer: {

	},
	titleContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center', // Center the title
	},
	titleText: {
		fontSize: FontSize._16,
		fontFamily: AppFonts.BOLD,
	},
	headerIcon: {
		width: AppHeight._20,
		height: AppHeight._20,
	},
	emptySpace: {
		width: AppHeight._20,
	},
});

export default AppHeader;
