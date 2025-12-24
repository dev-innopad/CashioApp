import React, { useState } from 'react';
import { Dimensions, Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
	clamp,
	FadeIn,
	FadeOut,
	interpolate,
	interpolateColor,
	runOnJS,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue
} from 'react-native-reanimated';

interface AppCircleSliderProps {
	data: { id: string; image: string; title?: string }[];
	itemSize?: number;
	spacing?: number;
	onChange?: (index: number) => void;
	style?: ViewStyle;
	imageStyle?: ImageStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AppCircleSlider: React.FC<AppCircleSliderProps> = ({
	data,
	itemSize = SCREEN_WIDTH * 0.24,
	spacing = 12,
	onChange,
	style,
	imageStyle,
}) => {

	const [activeIndex, setActiveIndex] = useState(0);
	const scrollX = useSharedValue(0);

	const itemTotalSize = itemSize + spacing;

	const onScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = clamp(
				event.contentOffset.x / itemTotalSize, 0,
				data?.length - 1
			);
			const newIndex = Math.round(scrollX.value);
			if (newIndex !== activeIndex) {
				runOnJS(setActiveIndex)(newIndex);
				if (onChange) runOnJS(onChange)(newIndex);
			}
		},
	});

	const CarouselItem = ({ item, index }: { item: any; index: number }) => {
		const animatedStyle = useAnimatedStyle(() => {
			return {
				borderWidth: 4,
				borderColor: interpolateColor(
					scrollX.value,
					[index - 1, index, index + 1],
					['transparent', 'rgba(255,255,255,0.5)', 'transparent']
				),
				// transform: [{
				// 	translateY: interpolate(
				// 		scrollX.value,
				// 		[index - 1, index, index + 1],
				// 		[itemSize / 10, 0, itemSize / 10]
				// 	),
				// }],
			};
		});

		return (
			<Animated.View style={[{
				width: itemSize,
				height: itemSize,
				// borderRadius: itemSize / 2,
				overflow: 'hidden',
			}, animatedStyle]}>
				<Image source={{ uri: item.image }}
					style={[styles.image, imageStyle,
					{ width: '100%', height: '100%' }]}
				/>
			</Animated.View>
		);
	};

	return (
		<View style={[styles.container, style]}>

			<View style={StyleSheet.absoluteFillObject}>
				<Animated.Image
					key={`Image-${activeIndex}`}
					source={{ uri: data[activeIndex]?.image }}
					style={{ flex: 1 }}
					entering={FadeIn.duration(300)}
					exiting={FadeOut.duration(300)}
				/>
			</View>

			<Animated.FlatList
				horizontal
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<CarouselItem item={item} index={index} />
				)}
				showsHorizontalScrollIndicator={false}
				style={{ flexGrow: 0, height: itemSize * 1.2 }}
				contentContainerStyle={{
					paddingHorizontal: (SCREEN_WIDTH - itemSize) / 2,
					gap: spacing,
				}}
				onScroll={onScroll}
				scrollEventThrottle={16}
				snapToInterval={itemTotalSize}
				decelerationRate="fast"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
		justifyContent: 'flex-end',
	},
	image: {
		// borderRadius: 999, // force circle
	},
});

export default AppCircleSlider;