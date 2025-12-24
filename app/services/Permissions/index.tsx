import { Linking, Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS, request, openSettings, checkMultiple, requestMultiple } from 'react-native-permissions';
import { isIOS, nativeAlertwithAction } from '../../constants/nativeActions';

const askPermission = async (permissionType: any) => {
	const permission = isIOS
		? PERMISSIONS.IOS[permissionType]
		: PERMISSIONS.ANDROID[permissionType]

	try {
		const result = await check(permission);
		const permissionTypeSmall: string = (() => {
			switch (permissionType) {
				case "MICROPHONE":
					return 'Microphone';
				case "PHOTO_LIBRARY":
					return 'Photos';
				case "CAMERA":
					return 'Camera';
				case "READ_MEDIA_IMAGES":
					return 'Media Images';
				case "READ_EXTERNAL_STORAGE":
					return 'External Storage'
				default:
					return ''; // or throw an error, depending on your logic
			}
		})();

		switch (result) {

			case RESULTS.BLOCKED:
				console.log(`${permissionType} permission Blocked`);
				nativeAlertwithAction(
					`${permissionTypeSmall} Permission Error`,
					`You need to grant "${permissionTypeSmall}"permission to use this feature. Please open settings to enable access.`,
					async (result) => result
						? (console.log('OK action'), Linking.openURL('app-settings://myapp'))
						: console.log('Cancel or Custom Cancel action')
				);
				break;

			case RESULTS.GRANTED:
				console.log(`${permissionType} permission GRANTED`);
				return true;

			case RESULTS.DENIED:
				console.log(`${permissionType} permission DENIED`);
				const permissionRequest = await request(permission);
				if (!isIOS && permissionRequest == RESULTS.BLOCKED) {
					nativeAlertwithAction(
						`${permissionTypeSmall} Permission Error`,
						`You need to grant "${permissionTypeSmall}"permission to use this feature. Please open settings to enable access.`,
						async (result) => result
							? (console.log('OK action'), Linking.openSettings())
							: console.log('Cancel or Custom Cancel action')
					);
				}
				return permissionRequest === RESULTS.GRANTED;

			default:
				console.log(`Unexpected ${permissionType} result:`, result);
				return false;
		}
	} catch (error) {
		console.error(`Error checking ${permissionType} permission:`, error);
		return false;
	}
}

const _askCameraPermission = async () => await askPermission('CAMERA');
const _askPhotoPermission = async () => isIOS ? await askPermission('PHOTO_LIBRARY') : await askPermission(Number(Platform.Version) <= 29 ? 'READ_EXTERNAL_STORAGE' : 'READ_MEDIA_IMAGES');
const _askAudioPermission = async () => await askPermission(isIOS ? 'MICROPHONE' : 'RECORD_AUDIO');

export const App_Permission = {
	_askCameraPermission,
	_askPhotoPermission,
	_askAudioPermission,
}