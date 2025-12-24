import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppColorTypes } from '../../theme/AppColors';
import { AppHeight, AppHorizontalMargin, AppPadding, AppVerticalMargin, AppWidth } from '../../constants/responsive';
import { screenWidth } from '../../constants/metrics';
import { AppShadow } from '../../constants/commonStyle';

// Optional prop to control number of loading items
interface IsLoadingHomeProps {
	count?: number;
	isLoading?: boolean
}

const IsLoadingHome = ({ count = 4, isLoading }: IsLoadingHomeProps) => {
	const { AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);

	// Create dummy data array for loading
	const loadingData = Array.from({ length: count }, (_, i) => ({ id: i.toString() }));

	const renderLoadingItem = () => {
		return (
			<View style={styles.renderContainer}>
				<View style={styles.loadingImage} />
				<View style={styles.textContainer}>
					<View style={styles.loadingTextLine} />
					<View style={[styles.loadingTextLine, styles.loadingRating]} />
				</View>
			</View>
		);
	};

	return (
		(isLoading &&
			<FlatList
				style={{ opacity: .6 }}
				data={loadingData}
				numColumns={2}
				scrollEnabled={false}
				renderItem={renderLoadingItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.flatListContainer}
				showsVerticalScrollIndicator={false}
				columnWrapperStyle={styles.columnWrapper}
				ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
				scrollEventThrottle={16}
			/>
		)
	);
};

const createStyles = (AppColors: AppColorTypes) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			marginHorizontal: AppHorizontalMargin._20,
		},
		renderContainer: {
			backgroundColor: AppColors.secondary10,
			width: screenWidth / 2 - AppWidth._15
		},
		loadingImage: {
			height: AppHeight._250,
			backgroundColor: AppColors.secondary10,
		},
		textContainer: {
			padding: AppPadding._10,
		},
		loadingTextLine: {
			height: AppHeight._15,
			backgroundColor: AppColors.secondary20,
			marginBottom: 5,
		},
		loadingRating: {
			width: '40%', // Make rating line shorter
		},
		flatListContainer: {
			paddingBottom: 20,
		},
		columnWrapper: {
			justifyContent: 'space-between',
			paddingTop: AppVerticalMargin._10,
		},
		itemSeparator: {

		},
	});
};

export default IsLoadingHome;