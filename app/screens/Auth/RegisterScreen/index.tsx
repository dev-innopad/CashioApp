import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { FontSize } from '../../../assets/fonts';
import AppMainContainer from '../../../components/AppMainContainer';
import AppText from '../../../components/AppText';
import { AppVerticalMargin } from '../../../constants/responsive';
import { useTheme } from '../../../theme/ThemeProvider';

const RegisterScreen = (props: any) => {

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
					{/* Register UI */}
				</View>

			</View>
		</AppMainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		orContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			marginTop: AppVerticalMargin._20,
		},
	});
};

export default RegisterScreen;