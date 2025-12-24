import React, { useMemo } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import { allCenter, borderRadius10 } from '../constants/commonStyle';
import { AppPadding } from '../constants/responsive';
import { AppColorTypes } from '../theme/AppColors';
import { useTheme } from '../theme/ThemeProvider';

interface AppLoaderProps {
	isLoading?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading }) => {
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		(isLoading &&
			<Modal visible={isLoading}
				transparent={true}
				animationType="fade"
				onRequestClose={() => { }}>
				<View style={styles.overlayContainer}>
					<View style={styles.innerContainer}>
						<Spinner
							isVisible={isLoading}
							size={24}
							type={'Wave'}
							color={AppColors.primary100}
						/>
					</View>
				</View>
			</Modal>
		)
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		overlayContainer: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.4)',
			padding: AppPadding._15,
			...allCenter
		},
		innerContainer: {
			padding: AppPadding._25,
			backgroundColor: AppColors.basicWhite,
			...borderRadius10
		}
	});
};

export default AppLoader;
