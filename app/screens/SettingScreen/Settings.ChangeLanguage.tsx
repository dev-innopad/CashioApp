import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { useDispatch, useSelector } from 'react-redux';
import { AppFonts, FontSize } from '../../assets/fonts';
import AppHeader from '../../components/AppHeader';
import AppMainContainer from '../../components/AppMainContainer';
import AppText from '../../components/AppText';
import { AppHorizontalMargin, AppMargin, AppVerticalMargin } from '../../constants/responsive';
import { AppDispatch, RootState } from '../../store'; // Import RootState
import { setLocalize } from '../../store/reducers/appData.slice';
import { AppColorTypes } from '../../theme/AppColors';
import { useTheme } from '../../theme/ThemeProvider';

// Static theme options data moved outside of the component
const themeOptions = [
	{ id: 1, value: 'en', label: '🇺🇸   English' },
	{ id: 2, value: 'sp', label: '🇪🇸   Spanish' },
	{ id: 3, value: 'jp', label: '🇯🇵   Japanese' },
];

interface ChangeLanguageProps {
	navigation: any;
}

const ChangeLanguage = ({ navigation }: ChangeLanguageProps) => {
	const { AppColors } = useTheme();
	const dispatch: AppDispatch = useDispatch();
	const localize = useSelector((state: RootState) => state.appData.localize); // Get the current language from Redux

	// Memoize styles based on the AppColors
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	// Memoize the renderItem to avoid unnecessary re-renders
	const renderItem = useCallback(({ item }: any) => {
		const isSelected = localize === item.value; // Check if the current language matches the item
		const selectedCondition = isSelected
			? AppColors.primary100
			: AppColors.textColor;

		return (
			<Pressable
				onPress={() => {
					dispatch(setLocalize(item.value)); // Update the language in Redux
					trigger('impactLight'); // Trigger haptic feedback
				}}
				style={[styles.buttonContainer]}
				disabled={isSelected}>

				<View style={styles.dotIndicator}>
					<AppText label={item.label}
						fontSize={FontSize._16}
						textColor={selectedCondition}
						style={isSelected && { fontFamily: AppFonts.MEDIUM }}
					/>
					{isSelected && <View style={styles.dotIndicatorType} />}
				</View>

			</Pressable>
		);

	}, [localize, AppColors, styles]);

	return (
		<AppMainContainer>
			<View style={styles.mainContainer}>
				<AppHeader title="Change Language" onBackPress={() => navigation.goBack()} />
				<FlatList
					data={themeOptions}
					style={styles.flatList}
					renderItem={renderItem}
					keyExtractor={(item) => item.id.toString()}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
				/>
			</View>
		</AppMainContainer>
	);
};

// Memoized style creation to prevent recalculation on each render
const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		mainContainer: {
			marginHorizontal: AppHorizontalMargin._20,
			flex: 1,
		},
		flatList: {
			paddingTop: AppVerticalMargin._20,
		},
		buttonContainer: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		separator: {
			height: 1,
			backgroundColor: AppColors.secondary10,
			marginVertical: AppVerticalMargin._20,
		},
		dotIndicator: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		dotIndicatorType: {
			height: AppMargin._5,
			width: AppMargin._5,
			backgroundColor: AppColors.primary100,
			borderRadius: 100
		}
	});
};

export default React.memo(ChangeLanguage);