import React, { Fragment, forwardRef } from 'react';
import { Image, Pressable, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { AppFonts, FontSize } from '../assets/fonts'; // Assuming you have these already
import { Icons } from '../assets/icons';
import { borderRadius10 } from '../constants/commonStyle';
import { AppHeight, AppHorizontalMargin, AppHorizontalPadding } from '../constants/responsive';
import { AppColorTypes } from '../theme/AppColors';
import { useTheme } from '../theme/ThemeProvider';
import AppText from './AppText';

interface AppTextInputProps extends TextInputProps {
	leftIcon?: any;
	rightIcon?: any;
	onLeftIconPress?: () => void;
	onRightIconPress?: () => void;
	containerStyle?: ViewStyle | any;
	inputStyle?: ViewStyle;
	label?: string;
	textColor?: string;
	fontSize?: number;
	errorHandle?: any;
	errorMessage?: string;
}

const AppTextInput = forwardRef<TextInput, AppTextInputProps>(({
	leftIcon,
	rightIcon,
	onLeftIconPress,
	onRightIconPress,
	containerStyle,
	inputStyle,
	label,
	textColor,
	fontSize = FontSize._14,
	errorHandle,
	errorMessage,
	...props
}: AppTextInputProps, ref) => {

	const { AppColors } = useTheme();

	const styles = createStyles(AppColors);
	let fontSizeStyle = fontSize;
	let fontFamily = AppFonts.REGULAR;

	if (label) {
		fontSizeStyle = FontSize._14; // You can adjust the font size based on the label
		fontFamily = AppFonts.MEDIUM;
	}

	return (
		<Fragment>
			<View style={[styles.container, containerStyle]}>
				{leftIcon ? (
					<Pressable disabled={!onLeftIconPress} onPress={onLeftIconPress} style={styles.iconWrapper}>
						<Image style={styles.icon} tintColor={AppColors.primary100} source={leftIcon} />
					</Pressable>
				) : null}

				<TextInput
					{...props}
					ref={ref} // Forwarding ref to the TextInput component
					placeholderTextColor={AppColors.secondary40}
					style={[styles.input, {
						fontSize: fontSizeStyle,
						fontFamily,
						color: textColor || AppColors.primary100,
						marginHorizontal: leftIcon || rightIcon ? 0 : AppHorizontalPadding._20,
					}, inputStyle]}
				/>

				{rightIcon ? (
					<Pressable disabled={!onRightIconPress} onPress={onRightIconPress} style={styles.iconWrapper}>
						<Image style={styles.icon} tintColor={AppColors.primary100} source={rightIcon} />
					</Pressable>
				) : null}
			</View>

			{errorHandle &&
				<View style={styles.errorContainer}>
					<Image style={styles.errorImage} source={Icons.icnInfo} />
					<AppText label={errorHandle}
						style={{ marginLeft: AppHorizontalMargin._5 }}
						textColor={AppColors.error}
						fontSize={FontSize._12}
					/>
				</View>
			}

		</Fragment>
	);
});

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			borderWidth: 1,
			borderColor: AppColors.secondary60,
			height: AppHeight._50,
			...borderRadius10
		},
		iconWrapper: {
			marginHorizontal: AppHorizontalMargin._15,
		},
		icon: {
			width: AppHeight._25,
			height: AppHeight._25,
		},
		input: {
			flex: 1,
			height: AppHeight._50,
			paddingVertical: 0,
		},
		errorContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: AppHeight._5
		},
		errorImage: {
			width: AppHeight._15,
			height: AppHeight._15,
			tintColor: AppColors.error
		}
	});
};

export default AppTextInput;
