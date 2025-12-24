// reactotron-config.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import { name as AppName } from './app.json';

//@ts-ignore;
let reactotron: any;

if (__DEV__) {
	reactotron = Reactotron
		.configure({
			name: AppName,
		})
		.useReactNative({
			asyncStorage: true,
			networking: { ignoreUrls: /(symbolicated|localhost:8081|generate_204)/ },
			editor: false,
			errors: { veto: () => false },
			overlay: false,
		})
		.use(reactotronRedux()) // Add Redux plugin
		.setAsyncStorageHandler(AsyncStorage)
		.connect();

	// Clear Reactotron on every app reload
	Reactotron.clear();

	// Get All AsyncStorage command
	Reactotron.onCustomCommand({
		command: 'Get All AsyncStorage',
		handler: () => {
			AsyncStorage.getAllKeys()
				.then((keys) => AsyncStorage.multiGet(keys))
				.then((data) => {
					Reactotron.display({
						name: 'ASYNC_STORAGE_DUMP',
						value: data,
						preview: `Found ${data.length} items`,
					});
					alert('AsyncStorage Key Values sent successfully in logger.');
				});
		},
		title: 'Inspect Storage',
		description: 'Show all key/value pairs in AsyncStorage',
	});

	// Clear AsyncStorage command
	Reactotron.onCustomCommand({
		command: 'Clear AsyncStorage',
		handler: () => {
			AsyncStorage.getAllKeys()
				.then((keys) => AsyncStorage.multiRemove(keys))
				.then(() => {
					Reactotron.log('AsyncStorage cleared successfully');
					alert('AsyncStorage cleared successfully');
				});
		},
		title: 'Clear AsyncStorage',
		description: 'Clears all data from AsyncStorage.',
	});

	// Override console.log
	console.log = Reactotron.log;
}

export default reactotron;