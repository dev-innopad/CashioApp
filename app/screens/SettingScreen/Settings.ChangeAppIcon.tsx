import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { useDispatch, useSelector } from 'react-redux';
import { Images } from '../../assets/images';
import AppHeader from '../../components/AppHeader';
import AppMainContainer from '../../components/AppMainContainer';
import AppText from '../../components/AppText';
import { borderRadius10, icon20, icon35 } from '../../constants/commonStyle';
import { AppHorizontalMargin, AppMargin, AppVerticalMargin } from '../../constants/responsive';
import { AppDispatch } from '../../store';
import { AppColorTypes } from '../../theme/AppColors';
import { useTheme } from '../../theme/ThemeProvider';
import { setIconId } from '../../store/reducers/appData.slice';
import { changeIcon, resetIcon } from 'react-native-change-icon';
import { AppFonts } from '../../assets/fonts';
import { _showToast } from '../../services/UIs/ToastConfig';

// Static theme options data moved outside of the component
const themeOptions = [
	{ id: 1, label: 'Default', value: 'Default', img: Images.imgDefaultIcon },
	{ id: 2, label: 'Green', value: 'AppIcon1', img: Images.imgAppIcon1 },
];

interface ChangeAppIconProps {
	navigation: any;
}

const ChangeAppIcon = ({ navigation }: ChangeAppIconProps) => {
	const { AppColors, themeId, setThemeId } = useTheme();
	const { iconId } = useSelector((state: any) => state.appData);

	const dispatch: AppDispatch = useDispatch();

	// Memoize styles based on the AppColors
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	// Memoize the renderItem to avoid unnecessary re-renders
	const renderItem = useCallback(({ item }: any) => {
		const selectedIdCompare = iconId == item.id;
		const selectedCondition = iconId == item.id
			? AppColors.primary100
			: AppColors.textColor
		return (
			<Pressable onPress={() => {
				changeIcon(item.value);
				dispatch(setIconId(item.id));
				trigger('impactLight');
				_showToast('App Icon Changed Successfully!', 'success');
			}} style={[styles.buttonContainer]}
				disabled={iconId == item.id}>

				<Image source={item.img}
					style={{
						borderWidth: 1,
						marginRight: AppMargin._15,
						borderColor: AppColors.secondary20,
						...icon35, ...borderRadius10,
					}}
				/>

				<View style={styles.dotIndicator}>
					<AppText label={item.label}
						textColor={selectedCondition}
						style={selectedIdCompare && { fontFamily: AppFonts.MEDIUM }}
					/>
					{selectedIdCompare && <View style={styles.dotIndicatorType} />}
				</View>

			</Pressable>
		);
	}, [iconId, setIconId, dispatch, AppColors, styles]);

	return (
		<AppMainContainer>
			<View style={styles.mainContainer}>
				<AppHeader title="Change App Icon" onBackPress={() => navigation.goBack()} />
				<FlatList data={themeOptions}
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

export default React.memo(ChangeAppIcon);
