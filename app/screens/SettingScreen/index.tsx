import React, { useCallback, useMemo } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontSize } from '../../assets/fonts';
import { Icons } from '../../assets/icons';
import AppMainContainer from '../../components/AppMainContainer';
import AppText from '../../components/AppText';
import { AppName, AppSettingVersion, icon20 } from '../../constants/commonStyle';
import { SettingList } from '../../constants/constantStrings';
import { NavigationKeys } from '../../constants/navigationKeys';
import { AppHeight, AppMargin, AppVerticalMargin } from '../../constants/responsive';
import { t } from '../../i18n';
import { _showToast } from '../../services/UIs/ToastConfig';
import { AppDispatch, RootState } from '../../store';
import { setIsLogin } from '../../store/reducers/appData.slice';
import AppAlertBox from '../../subviews/AppAlertBox';
import { AppColorTypes, darkTheme } from '../../theme/AppColors';
import { useTheme } from '../../theme/ThemeProvider';

interface SettingItem {
	desc: string | undefined;
	id: number;
	title: string;
	icon: any;
}

const SettingScreen = ({ navigation }: { navigation: any }) => {

	const { AppColors } = useTheme();
	const dispatch = useDispatch<AppDispatch>();
	const AppLang = useSelector((state: RootState) => state.appData.localize);

	// State and refs
	const [isModalVisible, setModalVisible] = React.useState(false);
	const scaleValue = React.useRef(new Animated.Value(1)).current;
	const borderRadius = React.useRef(new Animated.Value(0)).current;

	// Animation handlers
	const toggleLogoutModal = useCallback(() => {

		const toValue = isModalVisible ? 1 : 0.90
		const borderRadiusValue = isModalVisible ? 0 : 10

		Animated.parallel([
			Animated.spring(scaleValue, {
				toValue,
				friction: 10,
				useNativeDriver: true,
			}),
			Animated.timing(borderRadius, {
				toValue: borderRadiusValue,
				duration: 300,
				useNativeDriver: true,
			})
		]).start();
		setModalVisible(prev => !prev);
	}, [isModalVisible]);

	// Handlers
	const confirmLogout = useCallback(() => {
		navigation.reset({
			index: 0,
			routes: [{ name: NavigationKeys.AuthNavigator }],
		});
		dispatch(setIsLogin(false));
		_showToast('Logout Successful', 'success');
	}, [navigation, dispatch]);

	// Memoized components
	const renderSettingItem = useCallback(({ item }: { item: SettingItem }) => {

		const isLastItem = SettingList[SettingList.length - 1].id === item.id;
		const iconColor = isLastItem ? AppColors.error : AppColors.primary100;
		const textColor = isLastItem ? AppColors.error : AppColors.primary100;
		const descColor = isLastItem ? AppColors.error : AppColors.secondary60;
		const backIconColor = isLastItem ? AppColors.error : AppColors.primary60;

		return (
			<Pressable onPress={() => settingSwitchCase(item)}
				style={styles.settingItemContainer}>

				<View style={styles.settingItemContent}>
					<Image source={item.icon}
						style={styles.settingIcon}
						tintColor={iconColor}
					/>
					<View style={styles.textContainer}>
						<AppText subtitle={t(item.title)}
							fontSize={FontSize._14}
							textColor={textColor}
						/>
						{item?.desc && (
							<AppText label={t(item.desc)}
								fontSize={FontSize._10}
								textColor={descColor}
							/>)}
					</View>
				</View>

				<Image source={Icons.icnBack}
					style={[styles.backIcon, { tintColor: backIconColor }]}
				/>
			</Pressable>
		);
	}, [AppColors, AppLang]);

	const renderFooter = useCallback(() => (
		<View style={styles.versionText}>
			<AppText label={AppName}
				textColor={AppColors.secondary60}
			/>
			<AppText label={`( ${AppSettingVersion} )`}
				fontSize={FontSize._10}
				textColor={AppColors.primary100}
			/>
		</View>
	), [AppColors]);

	const settingSwitchCase = (item: SettingItem) => {
		switch (item?.id) {
			// ----- Add Cases as per your needs ----- //
			case 0: navigation.navigate(NavigationKeys.AppearanceScreen); break;
			case 1: navigation.navigate(NavigationKeys.SettingChangeAppIcon); break;
			case 2: navigation.navigate(NavigationKeys.SettingsChangeLanguage); break;
			case 7: toggleLogoutModal(); break;
			default: alert(item.title); break;
			// ----- Add Cases as per your needs ----- //
		}
	}

	// Styles
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	return (
		<View style={styles.rootContainer}>
			<Animated.View style={[styles.subContainer,
			{ transform: [{ scale: scaleValue }], borderRadius }]}>
				<AppMainContainer>
					<View style={styles.container}>
						<AppText title={t('settings')}
							textColor={AppColors.primary100}
							fontSize={FontSize._24}
						/>

						<FlatList data={SettingList}
							keyExtractor={(item) => item.id.toString()}
							renderItem={renderSettingItem}
							ItemSeparatorComponent={() => <View style={styles.separator} />}
							ListFooterComponent={renderFooter}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.listContentContainer}
							style={styles.flatList}
						/>
					</View>
				</AppMainContainer>

				<AppAlertBox isVisible={isModalVisible}
					hideAlert={toggleLogoutModal}
					title='Logout'
					message='Are you sure you want to logout?'
					buttons={[
						{
							text: "Cancel",
							type: "cancel",
							onPress: () => console.log("Cancelled")
						},
						{
							text: "Confirm",
							onPress: confirmLogout
						}
					]}
				/>
			</Animated.View>
		</View>
	);
};

const createStyles = (AppColors: AppColorTypes) => StyleSheet.create({
	rootContainer: {
		flex: 1,
		backgroundColor: darkTheme().background,
	},
	subContainer: {
		flex: 1,
		overflow: 'hidden'
	},
	container: {
		flex: 1,
		marginHorizontal: 20,
	},
	flatList: {
		flex: 1
	},
	listContentContainer: {
		paddingBottom: AppVerticalMargin._100,
		paddingTop: AppVerticalMargin._30
	},
	settingItemContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	settingItemContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	textContainer: {
		width: '85%'
	},
	settingIcon: {
		marginRight: AppMargin._10,
		...icon20,
	},
	backIcon: {
		height: AppHeight._10,
		width: AppHeight._10,
		transform: [{ rotate: '180deg' }],
	},
	separator: {
		height: 1,
		backgroundColor: AppColors.secondary10,
		marginVertical: AppVerticalMargin._20,
	},
	versionText: {
		marginTop: AppMargin._50,
		alignItems: 'center'
	},
});

export default React.memo(SettingScreen);