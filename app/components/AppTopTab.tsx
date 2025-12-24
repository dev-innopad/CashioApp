import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { AppFonts, FontSize } from '../assets/fonts';
import AppText from './AppText';
import { AppHeight } from '../constants/responsive';

interface Tab {
	id: string;
	title: string;
}

interface AppTopTabProps {
	tabs: Tab[];
	initialTabIndex?: number;
	onTabChange?: (tabIndex: number) => void;
	activeTextColor?: string;
	activeButtonColor?: string;
	inactiveTextColor?: string;
	backgroundColor?: string;
	gapSize?: number;
	animationDuration?: number;
}

const AppTopTab: React.FC<AppTopTabProps> = ({
	tabs,
	initialTabIndex = 0,
	onTabChange,
	activeTextColor = '#007AFF',
	activeButtonColor = '#FFFF',
	inactiveTextColor = '#3C3C43',
	backgroundColor = '#E5E5EA',
	gapSize = 2,
	animationDuration = 200,
}) => {
	const [activeTab, setActiveTab] = useState(initialTabIndex);
	const indicatorAnim = useRef(new Animated.Value(initialTabIndex)).current;
	const containerRef = useRef<View>(null);
	const [containerWidth, setContainerWidth] = useState(0);

	const handleTabPress = (index: number) => {
		setActiveTab(index);
		onTabChange?.(index);

		Animated.timing(indicatorAnim, {
			toValue: index,
			duration: animationDuration,
			useNativeDriver: true,
		}).start();
	};

	const tabWidth = containerWidth / tabs.length;
	const indicatorWidth = tabWidth - (gapSize * 2);

	const translateX = indicatorAnim.interpolate({
		inputRange: tabs.map((_, i) => i),
		outputRange: tabs.map((_, i) => i * tabWidth + gapSize),
	});

	return (
		<View
			ref={containerRef}
			style={[styles.container, { backgroundColor, borderRadius: 10 }]}
			onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
		>
			{/* Background container with gap */}
			<View style={styles.tabsContainer}>
				{tabs.map((tab, index) => (
					<TouchableOpacity
						key={tab.id}
						style={[styles.tab, { width: tabWidth }]}
						onPress={() => {
							handleTabPress(index);
							trigger('impactLight');
						}}
						activeOpacity={0.7}>

						<AppText fontSize={FontSize._12} label={tab.title} style={[
							{ color: inactiveTextColor },
							activeTab === index && {
								color: activeTextColor,
								fontFamily: AppFonts.MEDIUM
							}]} />

					</TouchableOpacity>
				))}
			</View>

			{/* Animated selection box with gap */}
			{containerWidth > 0 && (
				<Animated.View
					style={[
						styles.indicator,
						{
							width: indicatorWidth,
							backgroundColor: activeButtonColor,
							transform: [{ translateX }],
							borderRadius: 8,
						},
					]}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: AppHeight._35,
		flexDirection: 'row',
		padding: 2,
		alignSelf: 'center',
	},
	tabsContainer: {
		flexDirection: 'row',
		flex: 1,
		position: 'relative',
		zIndex: 2,
	},
	tab: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	indicator: {
		position: 'absolute',
		top: 2,
		bottom: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		zIndex: 1,
	},
});

export default AppTopTab;