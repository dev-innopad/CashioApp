import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { trigger } from "react-native-haptic-feedback";
import Modal from 'react-native-modal';
import AppText from '../components/AppText.tsx';
import { AppShadow, borderRadius10 } from '../constants/commonStyle.ts';
import { AppHorizontalMargin, AppPadding, AppVerticalPadding } from '../constants/responsive.ts';
import { lightTheme } from '../theme/AppColors.ts';
import { FontSize } from '../assets/fonts/index.ts';

interface ButtonProps {
	text: string;
	onPress: () => void;
	type?: 'cancel' | 'default';
	style?: object;
}

interface AppAlertBoxProps {
	isVisible: boolean;
	hideAlert: () => void;
	title: string;
	message: string;
	buttons: ButtonProps[];
	icon?: any;
	warningColor?: string;
	primaryColor?: string;
	errorColor?: string;
	textColor?: string;
}

const AppAlertBox = ({
	isVisible,
	hideAlert,
	title = 'title',
	message = 'message',
	icon,
	warningColor = lightTheme.warning,
	primaryColor = lightTheme.primary100,
	errorColor = lightTheme.error,
	textColor = lightTheme.textColor,
	buttons = [{
		text: "Cancel",
		type: "cancel",
		onPress: () => console.log("cancel pressed")
	}, {
		text: "Confirm",
		onPress: () => console.log("ok pressed")
	}],
}: AppAlertBoxProps) => {

	const styles = createStyles({
		warning: warningColor,
		primary100: primaryColor,
		error: errorColor,
		basicWhite: '#FFFFFF',
		basicBlack: textColor
	});

	const handleButtonPress = (button: ButtonProps) => {
		button.onPress();
		hideAlert();
	};

	return (
		<Modal isVisible={isVisible}
			onBackdropPress={hideAlert}
			onBackButtonPress={hideAlert}
			backdropTransitionOutTiming={1}
			backdropTransitionInTiming={500}
			useNativeDriver={true}
			onModalWillShow={() => trigger('impactMedium')}
			backdropOpacity={.7}
			animationIn='fadeInUp'
			animationOut='fadeOutDown'
			animationInTiming={750}
			animationOutTiming={250}
			avoidKeyboard={true}
			useNativeDriverForBackdrop={true}
		>
			<View style={styles.modalContainer}>
				<View style={{ padding: AppPadding._20, paddingBottom: AppPadding._30 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						{icon && <Image style={{ tintColor: warningColor }} source={icon} />}
						<AppText
							style={{ marginLeft: icon ? AppPadding._10 : 0 }}
							textColor={textColor}
							title={title}
						/>
					</View>
					<AppText
						style={{ marginTop: AppPadding._20 }}
						textColor={textColor}
						label={message}
					/>
				</View>

				<View style={styles.buttonsContainer}>
					{buttons?.map((button, index) => (
						<Pressable
							key={index}
							style={[
								styles.button,
								button.style,
								button.type === 'cancel' && { backgroundColor: errorColor }
							]}
							onPress={() => {
								if (button.type === 'cancel') {
									trigger('notificationError');
								} else {
									trigger('notificationSuccess');
								}
								handleButtonPress(button);
							}}
						>
							<AppText subtitle={button.text}
								textColor="#FFFFFF" // White text for buttons
								fontSize={FontSize._14}
							/>
						</Pressable>
					))}
				</View>
			</View>
		</Modal>
	);
};

const createStyles = (colors: {
	basicWhite: string;
	basicBlack: string;
	primary100: string;
	warning: string;
	error: string;
}) => StyleSheet.create({
	modalContainer: {
		overflow: 'hidden',
		backgroundColor: colors.basicWhite,
		marginHorizontal: AppHorizontalMargin._20,
		...borderRadius10,
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	button: {
		flex: 1,
		paddingVertical: AppVerticalPadding._15,
		backgroundColor: colors.primary100,
		alignItems: 'center',
	},
});

export default React.memo(AppAlertBox);