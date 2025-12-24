import React, { useEffect, useMemo } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import AppText from '../../components/AppText';
import AppMainContainer from '../../components/AppMainContainer';
import { AppDispatch } from '../../store';
import { useTheme } from '../../theme/ThemeProvider';
import { AppColorTypes } from '../../theme/AppColors';
import { AppHorizontalMargin } from '../../constants/responsive';

declare function alert(message: string): void;

interface NewScreenProps {
	navigation: any
}

const NewScreen = (props: NewScreenProps) => {

	const dispatch: AppDispatch = useDispatch();
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
		const unsubscribe = props.navigation.addListener('focus', () => {

		});

		return () => {
			backHandler.remove();
			unsubscribe();
		}
	}, [dispatch, props.navigation]);

	return (
		<AppMainContainer>
			<View style={styles.container}>
				<AppText title={`NewScreen`} />
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

export default NewScreen;