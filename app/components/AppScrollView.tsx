import React, { ReactNode, memo } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppHeight } from '../constants/responsive';

interface AppScrollViewProps {
	children?: ReactNode;
	extraHeight?: number;
	bounces?: boolean;
}

const AppScrollView: React.FC<AppScrollViewProps> = ({
	children,
	extraHeight = AppHeight._20, // Default value provided directly
	bounces = true, // Default to true
}) => {
	return (
		<KeyboardAwareScrollView
			bounces={bounces}
			showsVerticalScrollIndicator={false}
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			extraHeight={extraHeight}
			keyboardShouldPersistTaps="handled" // Ensures taps on the screen are handled even when the keyboard is open
			enableOnAndroid={true} // Ensures it works on Android
			keyboardOpeningTime={Number.MAX_VALUE}>
			{children}
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		flexGrow: 1, // Ensures content takes up the remaining space if necessary
	},
});

export default memo(AppScrollView); // Prevent unnecessary re-renders with React.memo