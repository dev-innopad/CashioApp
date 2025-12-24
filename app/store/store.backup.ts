import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import appDataSlice from './reducers/appData.slice';
import userDataSlice from './reducers/userData.slice';

const storage = AsyncStorage;

const persistAppConfig = {
	key: 'persistAppConfig',
	storage: storage,
	blacklist: [],
	whitelist: ['localize', 'themeId', 'isLogin', 'iconId']
};

const persistUserConfig = {
	key: 'persistStorage',
	storage: storage,
	blacklist: [],
	whitelist: ['userName']
};

const appData_Slice = persistReducer(persistAppConfig, appDataSlice)
const userData_slice = persistReducer(persistUserConfig, userDataSlice)

// Define your additional middleware here

const additionalMiddleware = (store: any) => (next: any) => (action: any) => {
	return next(action); 	// Middleware logic
};

const store = configureStore({
	reducer: {
		//multiple reducers
		appData: appData_Slice,
		userData: userData_slice,
	},

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(additionalMiddleware), // Add multiple middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;