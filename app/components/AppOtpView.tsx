import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { NativeSyntheticEvent, Platform, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { AppHeight, AppMargin, AppVerticalPadding } from '../constants/responsive';
import { AppColorTypes } from '../theme/AppColors';
import { useTheme } from '../theme/ThemeProvider';
import AppDynamicText from './AppDynamicText';

interface AppOtpViewProps {
	otpLength?: number;
	onOtpComplete?: (otp: string) => void;
	autoFocus?: boolean;
	containerStyle?: object;
	inputStyle?: object;
	label?: string;
}

export interface AppOtpViewRef {
	focus: () => void;
	clear: () => void;
}

const AppOtpView = forwardRef<AppOtpViewRef, AppOtpViewProps>(({
	otpLength = 4,
	onOtpComplete,
	autoFocus = true,
	containerStyle = {},
	inputStyle = {},
	label = `Please enter the OTP we've sent to your mobile/email`
}, ref) => {
	const { AppColors } = useTheme();
	const styles = createStyles(AppColors);
	const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
	const inputs = useRef<Array<TextInput>>([]);

	// Expose component methods via ref
	useImperativeHandle(ref, () => ({
		focus: () => {
			inputs.current[0]?.focus();
		},
		clear: () => {
			setOtp(Array(otpLength).fill(''));
			inputs.current[0]?.focus();
		},
	}));

	const getInputSize = (otpLength: number) => {
		if (otpLength <= 4) {
			return {
				width: AppHeight._50,
				height: AppHeight._50,
			};
		} else if (otpLength === 6) {
			return {
				width: AppHeight._40,
				height: AppHeight._40,
			};
		} else {
			return {
				width: AppHeight._35,
				height: AppHeight._35,
			};
		}
	};

	useEffect(() => {
		const combinedOtp = otp.join('');
		if (combinedOtp.length === otpLength && onOtpComplete) {
			onOtpComplete(combinedOtp);
		}
	}, [otp, otpLength, onOtpComplete]);

	const handleChange = (text: string, index: number) => {
		// Handle paste operation
		if (text.length === otpLength) {
			const otpArray = text.split('').slice(0, otpLength);
			setOtp(otpArray);
			inputs.current[otpLength - 1]?.focus();
			return;
		}

		// Handle single digit input
		const newOtp = [...otp];
		newOtp[index] = text;
		setOtp(newOtp);

		// Auto focus next input
		if (text && index < otpLength - 1) {
			inputs.current[index + 1]?.focus();
		}
	};

	const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
		if (e.nativeEvent.key === 'Backspace') {

			const newOtp = [...otp];

			// If current input is empty, delete previous digit
			if (!otp[index] && index > 0) {
				newOtp[index - 1] = '';
				setOtp(newOtp);
				inputs.current[index - 1]?.focus();
			}

			// If current input has value, clear it
			else if (otp[index]) {
				newOtp[index] = '';
				setOtp(newOtp);
			}
		}
	};

	const inputSize = getInputSize(otpLength);

	return (
		<View style={styles.container}>

			<AppDynamicText text={label}
				boldPhrases={['mobile number', 'email', 'otp']}
				links={[{
					phrase: 'Login',
					onPress: () => alert(`I'am Batman!!`),
				}]}
			/>

			<View style={[styles.otpContainer, containerStyle]}>

				{Array(otpLength).fill(0).map((_, index) => (
					<TextInput key={index}
						ref={(ref) => ref && (inputs.current[index] = ref)}
						style={[
							styles.input, inputStyle,
							inputSize, otp[index]
								? styles.filledInput : {},
						]}
						value={otp[index]}
						onChangeText={(text) => handleChange(text, index)}
						onKeyPress={(e) => handleKeyPress(e, index)}
						keyboardType="number-pad"
						maxLength={index === 0 ? otpLength : 1}
						textContentType={index === 0 ? "oneTimeCode" : "none"}
						autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'off'}
						autoFocus={autoFocus && index === 0}
						returnKeyType={index === otpLength - 1 ? 'done' : 'next'}
						returnKeyLabel='done'
					/>
				))}
			</View>
		</View>
	);
});

const createStyles = (AppColors: AppColorTypes) => StyleSheet.create({
	container: {
		// marginLeft: AppHorizontalMargin._20,
	},
	otpContainer: {
		marginTop: AppVerticalPadding._20,
		flexDirection: 'row',
		gap: AppMargin._10
	},
	input: {
		borderWidth: 1,
		borderColor: AppColors.primary10,
		textAlign: 'center',
		fontSize: 18,
		color: AppColors.basicBlack,
		backgroundColor: AppColors.background,
	},
	filledInput: {
		borderColor: AppColors.primary100,
		backgroundColor: AppColors.primary10,
	},
});

export default AppOtpView;