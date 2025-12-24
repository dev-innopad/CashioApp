import { Alert, Platform } from 'react-native';
import { name as appName } from '../../app.json';

export const APP_TITLE = appName;
export const isIOS = Platform.OS === 'ios';

export const nativeAlert = async (msg: string, title = APP_TITLE) => {
	Alert.alert(title, msg);
};

export const nativeAlertwithAction = async (title: string, msg: string, callback = (result: boolean) => { }) => {
	Alert.alert(title, msg, [{
		text: 'Cancel',
		onPress: () => callback(false),
		style: 'cancel',
	}, { text: 'OK', onPress: () => callback(true) },
	]);
};