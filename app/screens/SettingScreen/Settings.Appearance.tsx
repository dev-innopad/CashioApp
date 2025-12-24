import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { GestureResponderEvent } from 'react-native-modal';
import switchTheme from 'react-native-theme-switch-animation';
import { useDispatch, useSelector } from 'react-redux';
import { AppFonts, FontSize } from '../../assets/fonts';
import { Icons } from '../../assets/icons';
import AppHeader from '../../components/AppHeader';
import AppMainContainer from '../../components/AppMainContainer';
import AppText from '../../components/AppText';
import { icon20 } from '../../constants/commonStyle';
import { AppHorizontalMargin, AppMargin, AppVerticalMargin } from '../../constants/responsive';
import { AppDispatch, RootState } from '../../store';
import { setThemeColor, setThemeColorId } from '../../store/reducers/appData.slice';
import { colorOptions, AppColorTypes } from '../../theme/AppColors';
import { THEME_ID_DARK, THEME_ID_LIGHT, THEME_ID_SYSTEM, useTheme } from '../../theme/ThemeProvider';

// Theme options data
const themeOptions = [
	{ id: THEME_ID_SYSTEM, label: 'System Default', icn: Icons.icnSetting },
	{ id: THEME_ID_LIGHT, label: 'Light Theme', icn: Icons.icnLightTheme },
	{ id: THEME_ID_DARK, label: 'Dark Theme', icn: Icons.icnDarkTheme },
];

interface AppearanceScreenProps {
	navigation: any;
}

// Constants for responsive design
const NUM_COLUMNS = 5;
const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_MARGIN = AppHorizontalMargin._20 * 2; // Left + Right margin
const GAP_BETWEEN_BOXES = 8 * (NUM_COLUMNS - 1); // total gaps between columns
const COLOR_BOX_SIZE = (SCREEN_WIDTH - HORIZONTAL_MARGIN - GAP_BETWEEN_BOXES) / NUM_COLUMNS;

const AppearanceScreen = ({ navigation }: AppearanceScreenProps) => {

	const { AppColors, themeId, setThemeId } = useTheme();

	const dispatch: AppDispatch = useDispatch();
	const currentColorScheme = useColorScheme();

	// Get pre-selected colorId from Redux store
	const reduxSelectedColorId: any = useSelector((state: RootState) => state.appData.themeColorId);

	// Initialize local state with Redux value
	const [selectedColorId, setSelectedColorId] = useState<number | null>(reduxSelectedColorId ?? null);

	// Sync local state if Redux value changes
	useEffect(() => {
		if (reduxSelectedColorId !== selectedColorId) {
			setSelectedColorId(reduxSelectedColorId);
		}
	}, [reduxSelectedColorId]);

	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	// Animated values for themeOptions and colorOptions lists
	const themeAnimations = useRef(themeOptions.map(() => new Animated.Value(0))).current;
	const colorAnimations = useRef(colorOptions.map(() => new Animated.Value(0))).current;

	const onPressThemeChange = (e: GestureResponderEvent, itemId: number) => {
		const { pageX, pageY } = e.nativeEvent;

		trigger?.('impactLight');

		switchTheme({
			switchThemeFunction: () => { setThemeId(itemId); },
			animationConfig: {
				type: 'circular', duration: 1000,
				startingPoint: { cx: pageX, cy: pageY },
			},
		});
	};

	const themePalette = useMemo(() => {
		const colorKeys = Object.keys(AppColors) as Array<keyof AppColorTypes>;

		const sortByNumericSuffix = (a: string, b: string) => {
			const getNum = (key: string) => parseInt(key.replace(/[^0-9]/g, ''), 10);
			return getNum(b) - getNum(a);
		};

		const primaryColors = colorKeys
			.filter(k => k.startsWith('primary'))
			.sort(sortByNumericSuffix);

		const secondaryColors = colorKeys
			.filter(k => k.startsWith('secondary'))
			.sort(sortByNumericSuffix);

		return {
			primaryColors: primaryColors.map(key => ({
				id: key.replace(/^primary/, 'Primary '),
				color: AppColors[key]
			})),
			secondaryColors: secondaryColors.map(key => ({
				id: key.replace(/^secondary/, 'Secondary '),
				color: AppColors[key]
			})),
		};
	}, [AppColors]);

	const renderColorPreviewItem = useCallback(
		({ item }: { item: { id: string; color: string } }) => (
			<View style={styles.colorPreviewItem}>
				<View style={[styles.colorPreviewBox, { backgroundColor: item.color }]} />
				<View style={{ flex: 1 }}>
					<AppText label={item.id} style={styles.colorLabel} />
					<AppText label={item.color} style={styles.colorCode} fontSize={FontSize._8} />
				</View>
			</View>
		),
		[styles]
	);

	const renderThemeItem = useCallback(
		({ item, index }: { item: typeof themeOptions[0], index: number }) => {
			const selected = themeId === item.id;
			const textColor = selected ? AppColors.primary100 : AppColors.textColor;
			return (
				<Pressable
					onPress={(e) => onPressThemeChange(e, item.id)}
					style={styles.buttonContainer}
					disabled={selected}
				>
					<Image source={item.icn} style={[{ marginRight: AppMargin._15, tintColor: textColor }, icon20]} />
					<View style={styles.dotIndicator}>
						<AppText
							label={item.label}
							textColor={textColor}
							style={selected ? { fontFamily: AppFonts.MEDIUM } : undefined}
						/>
						{selected && <View style={styles.dotIndicatorType} />}
					</View>
				</Pressable>
			);
		},
		[themeId, AppColors, styles, themeAnimations, onPressThemeChange]
	);

	const renderColorItem = useCallback(
		({ item, index }: { item: typeof colorOptions[0], index: number }) => {
			const isSelected = selectedColorId === item.id;
			return (
				<Pressable
					onPress={() => {
						setSelectedColorId(item.id);
						dispatch(setThemeColorId(item.id));
						dispatch(setThemeColor(item.color));
						trigger('impactLight');
						console.log('Selected color:', item.color);
					}}
					style={[
						styles.colorBox,
						{ backgroundColor: item.color }
					]}
				>
					{isSelected && <View style={styles.innerCircle} />}
				</Pressable>
			);
		},
		[selectedColorId, styles, dispatch, colorAnimations]
	);

	return (
		<AppMainContainer>
			<View style={styles.mainContainer}>

				<AppHeader title="Appearance" onBackPress={() => navigation.goBack()} />
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: AppHorizontalMargin._200 }}>
					{/* Theme options */}
					<FlatList
						data={themeOptions}
						renderItem={renderThemeItem}
						keyExtractor={(item) => item.id.toString()}
						ItemSeparatorComponent={() => <View style={styles.separator} />}
						style={styles.flatList}
						scrollEnabled={false}
					/>

					<View style={{ height: AppVerticalMargin._30 }} />

					{/* Anime theme colors */}
					<AppText subtitle="Change theme color" style={styles.sectionTitle} />
					<FlatList
						data={colorOptions}
						renderItem={renderColorItem}
						keyExtractor={(item) => item.id.toString()}
						numColumns={NUM_COLUMNS}
						showsVerticalScrollIndicator={false}
						columnWrapperStyle={styles.colorRow}
						ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
					/>

					{/* Generated Theme Palette */}
					<View style={{ marginTop: AppVerticalMargin._30 }}>
						<AppText subtitle="Primary Color Shades" style={styles.sectionTitle} />
						<FlatList data={themePalette.primaryColors}
							renderItem={renderColorPreviewItem}
							keyExtractor={(item) => item.id}
							ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
							scrollEnabled={false}
						/>

						<View style={{ height: AppVerticalMargin._30 }} />

						<AppText subtitle="Secondary Color Shades" style={styles.sectionTitle} />
						<FlatList data={themePalette.secondaryColors}
							renderItem={renderColorPreviewItem}
							keyExtractor={(item) => item.id}
							ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
							scrollEnabled={false}
						/>
					</View>
				</ScrollView>
			</View>
		</AppMainContainer>
	);
};

const createStyles = (AppColors: AppColorTypes) =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			paddingHorizontal: AppHorizontalMargin._20,
			backgroundColor: AppColors.background,
		},
		flatList: {
			marginTop: 10,
			width: '100%',
		},
		buttonContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: AppVerticalMargin._10,
		},
		dotIndicator: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			flex: 1,
		},
		dotIndicatorType: {
			width: 5,
			height: 5,
			backgroundColor: AppColors.primary100,
			borderRadius: 100,
			marginLeft: 10,
		},
		separator: {
			height: 1,
			backgroundColor: AppColors.secondary10,
			marginVertical: AppVerticalMargin._15,
		},
		colorBox: {
			width: COLOR_BOX_SIZE,
			height: COLOR_BOX_SIZE,
			marginRight: 8,
			justifyContent: 'center',
			alignItems: 'center',
		},

		innerCircle: {
			width: COLOR_BOX_SIZE / 2,
			height: COLOR_BOX_SIZE / 2,
			backgroundColor: AppColors.basicWhite,
		},
		colorRow: {
			justifyContent: 'space-between',
		},
		colorPreviewItem: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: 10,
			backgroundColor: AppColors.segmentBackground
		},
		colorPreviewBox: {
			width: 40,
			height: 40,
			marginRight: 15,
		},
		colorLabel: {
			fontWeight: '600',
			color: AppColors.textColor,
		},
		colorCode: {
			color: AppColors.secondary60,
		},
		sectionTitle: {
			fontWeight: '700',
			fontSize: FontSize._14,
			marginBottom: AppMargin._10,
			color: AppColors.textColor,
		},
	});

export default AppearanceScreen;
