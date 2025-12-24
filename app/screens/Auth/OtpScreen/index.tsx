import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import AppText from '../../../components/AppText';
import AppMainContainer from '../../../components/AppMainContainer';
import { AppDispatch } from '../../../store';
import { useTheme } from '../../../theme/ThemeProvider';
import { AppColorTypes } from '../../../theme/AppColors';
import { AppHorizontalMargin, AppMargin } from '../../../constants/responsive';
import AppOtpView, { AppOtpViewRef } from '../../../components/AppOtpView';
import { t } from '../../../i18n';

declare function alert(message: string): void;

interface OtpScreenProps {
	navigation: any
}

const OtpScreen = (props: OtpScreenProps) => {

	const dispatch: AppDispatch = useDispatch();

	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const [completedOtp, setCompletedOtp] = useState('');

	const otpRef = useRef<AppOtpViewRef>(null);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
		const unsubscribe = props.navigation.addListener('focus', () => {
		});
		return () => {
			backHandler.remove();
			unsubscribe();
		}
	}, [dispatch, props.navigation]);



	const handleOtpComplete = (otp: string) => {
		setCompletedOtp(otp);
		alert(`OTP Complete: ${otp}`);
		console.log('OTP Complete:', otp);
	};

	const submitOtp = () => {
		alert(completedOtp);
	};

	return (
		<AppMainContainer>
			<View style={styles.container}>
				<View style={{ marginBottom: AppMargin._50 }}>
					<AppText title={"OtpScreen"} />
				</View>

				<AppOtpView ref={otpRef}
					onOtpComplete={handleOtpComplete}
					otpLength={4}
					label={t('otpMessage')}
					containerStyle={{ marginTop: AppMargin._50 }}
				/>

			</View>
		</AppMainContainer>
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			marginHorizontal: AppHorizontalMargin._20,
		}
	});
};

export default OtpScreen;