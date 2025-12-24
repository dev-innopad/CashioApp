import { FlashList, FlashListProps } from '@shopify/flash-list';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { trigger } from 'react-native-haptic-feedback';
import { useDispatch, useSelector } from 'react-redux';
import { FontSize } from '../../assets/fonts';
import AppMainContainer from '../../components/AppMainContainer';
import AppText from '../../components/AppText';
import AppTopTab from '../../components/AppTopTab';
import { allCenter, AppShadow } from '../../constants/commonStyle';
import { screenWidth, windowWidth } from '../../constants/metrics';
import { AppHeight, AppHorizontalMargin, AppHorizontalPadding, AppMargin, AppPadding, AppVerticalMargin, AppWidth } from '../../constants/responsive';
import { t } from '../../i18n';
import { GET_AIRING, GET_COMPLETED, GET_UPCOMING } from '../../services/API/endpoints';
import { APIMethods } from '../../services/API/methods';
import { AppDispatch } from '../../store';
import { setData } from '../../store/reducers/userData.slice';
import { AppColorTypes } from '../../theme/AppColors';
import { useTheme } from '../../theme/ThemeProvider';
import IsLoadingHome from './isLoading';
import Spinner from 'react-native-spinkit';
interface HomeScreenProps {
	navigation: any;
}

const HomeScreen = (props: HomeScreenProps) => {

	const dispatch: AppDispatch = useDispatch();

	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	const userData = useSelector((state: any) => state.userData);
	const localize = useSelector((state: any) => state.appData);

	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isPaginating, setIsPaginating] = useState(false);

	const [hasMore, setHasMore] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [showScrollToTop, setShowScrollToTop] = useState(false);

	// const [listingData, setListingData] = useState([]);

	const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Track initial load

	//@ts-ignore
	const flatListRef = useRef<FlashListProps>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current;

	const [activeTab, setActiveTab] = useState<number>(0);

	// Define your tabs
	const TopTabs: any = [
		{ id: 1, title: 'Airing', },
		{ id: 2, title: 'Upcoming', },
		{ id: 3, title: 'Completed', }
	];

	// Handle tab press
	const handleTabPress = (id: any) => {
		setActiveTab(id);
		scrollToTop();
	};

	useEffect(() => {
		fetchData(1)
	}, [activeTab]);

	const fetchData = async (page: number) => {
		try {

			if (page === 1) {
				page === 1
					&& !isRefreshing
					&& setIsLoading(true);
			} else {
				setIsPaginating(true);
			}

			let LOOPING_DATA;

			switch (activeTab) {
				case 0: LOOPING_DATA = GET_AIRING; break;
				case 1: LOOPING_DATA = GET_UPCOMING; break;
				case 2: LOOPING_DATA = GET_COMPLETED; break;
				default: LOOPING_DATA = GET_UPCOMING; break;
			}

			const params = { page };
			const response: any = await APIMethods.get(LOOPING_DATA, params, []);
			const data = response?.data;

			if (page === 1) {
				// setListingData(data);
				dispatch(setData(data));
				setInitialLoadComplete(true); // Set initial load complete
			} else {
				// const updatedData: any = [...listingData, ...data];
				const updatedData: any = [...userData?.items, ...data];
				dispatch(setData(updatedData));
				// setListingData(updatedData);
			}

			setHasMore(data.length > 0);

		} catch (error) {
			console.error(error);
			setHasMore(false);
		} finally {
			if (page === 1) {
				setIsLoading(false);
				setIsRefreshing(false);
			} else {
				setIsPaginating(false);
			}
		}
	};

	const loadMoreData = async () => {
		if (!isPaginating && hasMore && initialLoadComplete) {
			const nextPage = currentPage + 1;
			await fetchData(nextPage);
			setCurrentPage(nextPage);
			trigger('impactLight');
		}
	};

	const handleRefresh = async () => {
		setIsRefreshing(true);
		setCurrentPage(1);
		setHasMore(true);
		await fetchData(1);
	};

	const fadeButton = (val: number) => {
		Animated.timing(fadeAnim, {
			toValue: val,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const scrollToTop = () => {
		if (flatListRef.current) {
			flatListRef.current.scrollToOffset({ offset: 0, animated: true });
			trigger('impactHeavy');
		}
	};

	const renderListItem = ({ item, index }: any) => {
		const itemTitles = item.title_english || item.title;
		const itemRatings = item.score ?? 0;
		return (
			<Pressable key={index} style={styles.renderContainer}>
				<FastImage source={{ uri: item?.images?.jpg?.large_image_url }} style={styles.itemImage} />
				<View style={styles.textContainer}>
					<AppText fontSize={FontSize._12} numberOfLines={2} subtitle={itemTitles} textColor={AppColors.textColor} />
					<AppText fontSize={FontSize._12} style={styles.ratingText} subtitle={`⭐ ${itemRatings}`} textColor={AppColors.textColor} />
				</View>
			</Pressable>
		);
	};

	const renderFooter = () => {
		if (!isPaginating || !hasMore) return null;
		return (
			<View style={{ ...allCenter }}>
				<Spinner type={'Circle'}
					size={14}
					color={AppColors.primary100}
					style={styles.footerLoader}
				/>
			</View>
		);
	};

	return (
		<AppMainContainer>
			<View style={styles.subMainContainer}>

				<AppText title={`${t('title')} ${userData.userName}`}
					textColor={AppColors.primary100}
				/>

				<View style={{ marginVertical: AppVerticalMargin._10 }}>
					<AppTopTab tabs={TopTabs}
						onTabChange={handleTabPress}
						initialTabIndex={activeTab}
						activeTextColor={AppColors.textColor}
						inactiveTextColor={AppColors.textColor}
						backgroundColor={AppColors.segmentBackground}
						activeButtonColor={AppColors.secondary10}
						animationDuration={150}
					/>
				</View>

				<View style={styles.flatListContainerWrapper}>
					{isLoading ? (
						<IsLoadingHome isLoading={isLoading} />
					) : (
						<FlashList	//  data={listingData}
							data={userData?.items}
							// estimatedItemSize={300} only for flatlist
							ref={flatListRef}
							removeClippedSubviews={true}
							numColumns={2}
							renderItem={renderListItem}
							keyExtractor={(item, index) => index.toString()}
							contentContainerStyle={styles.flatListContainer}
							showsVerticalScrollIndicator={false}
							refreshControl={
								<RefreshControl
									refreshing={isRefreshing}
									onRefresh={handleRefresh}
									colors={[AppColors.primary100]}
									tintColor={AppColors.primary100}
								/>
							}
							ListFooterComponent={renderFooter}
							onEndReached={loadMoreData}
							onEndReachedThreshold={0.2}
							ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
							onScroll={(event) => {
								const offsetY = event.nativeEvent.contentOffset.y;
								if (offsetY > 100 && !showScrollToTop) {
									setShowScrollToTop(true);
									fadeButton(1);
								} else if (offsetY <= 100 && showScrollToTop) {
									setShowScrollToTop(false);
									fadeButton(0);
								}
							}}
							scrollEventThrottle={16}
						/>
					)}
				</View>

			</View>

			<Pressable onPress={scrollToTop}>
				<Animated.View style={[styles.scrollToTopButton, {
					backgroundColor: AppColors.primary100,
					opacity: fadeAnim
				}]}>
					{isRefreshing
						? <ActivityIndicator />
						: <AppText label={"Scroll to Top!"}
							textColor={AppColors.basicWhite} />}
				</Animated.View>
			</Pressable>

		</AppMainContainer>
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return (
		StyleSheet.create({
			renderContainer: {
				backgroundColor: AppColors.secondary10,
				width: screenWidth / 2 - AppWidth._15
			},
			subMainContainer: {
				marginHorizontal: AppHorizontalMargin._10,
				flex: 1,
			},
			flatListContainerWrapper: {
				flex: 1,
			},
			flatListContainer: {
				paddingBottom: AppVerticalMargin._75,
				paddingTop: AppVerticalMargin._10,
			},
			itemImage: {
				height: AppHeight._250,
			},
			textContainer: {
				padding: AppPadding._10,
			},
			ratingText: {
				marginTop: AppMargin._5,
			},
			footerLoader: {
				marginVertical: 10,
			},
			columnWrapper: {
				justifyContent: 'space-between',
			},
			itemSeparator: {
				height: AppHeight._10,
			},
			scrollToTopButton: {
				position: 'absolute',
				bottom: AppHeight._50, // Adjust this value as needed
				right: windowWidth / 3,
				paddingHorizontal: AppHorizontalPadding._20,
				paddingVertical: AppVerticalMargin._10,
				borderRadius: 20,
				justifyContent: 'center',
				alignItems: 'center',
				...AppShadow,
			},
		})
	)
}

export default HomeScreen;