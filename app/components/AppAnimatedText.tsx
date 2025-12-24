import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AppFonts, FontSize } from '../assets/fonts';
import { AppHeight, AppHorizontalMargin } from '../constants/responsive';
import { lightTheme } from '../theme/AppColors';

// Define a type for the props (if needed)
interface AnimatedTextProps {
	texts: string[]; // Array of texts to display
	duration?: number; // Duration for each text to stay before transitioning (in ms)
	transitionDuration?: number; // Duration of the transition (in ms)
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
	texts,
	duration = 3000,
	transitionDuration = 300,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const translateY = new Animated.Value(50); // Starting position (bottom)


	useEffect(() => {
		const textInterval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
			// Cycle through the texts
		}, duration);

		return () => clearInterval(textInterval);
		// Clean up interval on unmount
	}, [texts.length, duration]);

	// Animate translateY for bottom-to-center-to-top effect
	useEffect(() => {
		Animated.sequence([
			// Move from bottom to center
			Animated.timing(translateY, {
				toValue: 0, // Move to the center
				duration: transitionDuration,
				useNativeDriver: true,
			}),

			// Stay in the center for the text duration
			Animated.delay(duration - 2 * transitionDuration),
			// Stay at the center for the remaining time

			// Move from center to top
			Animated.timing(translateY, {
				toValue: -30, // Move upwards (to top)
				duration: transitionDuration,
				useNativeDriver: true,
			}),
		]).start();
	}, [currentIndex, translateY, duration, transitionDuration]);
	// Trigger animation when text changes

	return (
		<View style={styles.container}>
			<Animated.Text style={[styles.text, { transform: [{ translateY }] }]}>
				{texts[currentIndex]}
			</Animated.Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		paddingHorizontal: 20,
		height: AppHeight._30,
		width: '100%',
		overflow: 'hidden',
		position: 'relative',
	},
	text: {
		marginHorizontal: AppHorizontalMargin._10,
		fontSize: FontSize._14,
		color: lightTheme().primary100,
		position: 'absolute',
		fontFamily: AppFonts.REGULAR
	},
});

export default AnimatedText;
