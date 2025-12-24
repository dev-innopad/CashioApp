import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { FontSize } from '../../../assets/fonts';
import AppMainContainer from '../../../components/AppMainContainer';
import AppText from '../../../components/AppText';
import { AppVerticalMargin } from '../../../constants/responsive';
import { AppColorTypes } from '../../../theme/AppColors';
import { useTheme } from '../../../theme/ThemeProvider';

const LoginScreen = (props: any) => {

	const dispatch = useDispatch()
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<AppMainContainer>
			<View style={{ flex: 1 }}>

				<View>
					<AppText fontSize={FontSize._32} title={`Login`} />
				</View>

				<View style={{ flex: 1 }}>
					{/* login UI */}
				</View>

			</View>
		</AppMainContainer>
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		orContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			marginTop: AppVerticalMargin._20,
		},
	});
};

export default LoginScreen;