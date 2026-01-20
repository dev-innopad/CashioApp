// store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import appDataSlice from './reducers/appData.slice';
import userDataSlice from './reducers/userData.slice';
import reactotron from '../../ReactotronConfig';
import {name as AppName} from '../../app.json';
import goalsReducer from './reducers/goalsSlice';

const storage = AsyncStorage;

const persistAppConfig = {
  key: `persistAppConfig-${AppName}`,
  storage: storage,
  blacklist: [],
  whitelist: ['localize', 'themeId', 'iconId', 'themeColorId', 'themeColor'],
};

const persistUserConfig = {
  key: `persistUserData-${AppName}`,
  storage: storage,
  // Persist everything in userData
  whitelist: [
    'currentUser',
    'users',
    'expenses',
    'isAuthenticated',
    'categories',
  ],
};

const persistGoalsConfig = {
  key: `persistGoals-${AppName}`,
  storage: storage,
  // Persist the entire goals state
  whitelist: [
    'goals',
    'selectedGoalId',
    'loading',
    'error',
    'financialSettings',
    'monthlyIncome',
    'autoSavePercentage',
    'investmentTipsFrequency',
    'budgetAlertsEnabled',
  ],
};

const appData_Slice = persistReducer(persistAppConfig as any, appDataSlice);
const userData_slice = persistReducer(persistUserConfig as any, userDataSlice);
const goals_slice = persistReducer(persistGoalsConfig as any, goalsReducer);

const additionalMiddleware = (store: any) => (next: any) => (action: any) => {
  return next(action);
};

const enhancers: any = [];
if (__DEV__ && reactotron.createEnhancer) {
  enhancers.push(reactotron.createEnhancer());
}

const store = configureStore({
  reducer: {
    appData: appData_Slice,
    userData: userData_slice,
    goals: goals_slice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these paths that contain non-serializable values
        ignoredPaths: [
          'userData.expenses.*.receipt',
          'userData.currentUser.profileImage',
        ],
      },
    }).concat(additionalMiddleware),
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(enhancers),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;
