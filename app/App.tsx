import React, {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import StackNavigator from './routes/RootNavigation';
import toastConfig, {has_Notch} from './services/UIs/ToastConfig';
import store, {persistor} from './store';
import {ThemeProvider} from './theme/ThemeProvider';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

const App: React.FC = () => {
  // to change app language without restarting the app
  const state = store.getState();

  useEffect(() => {
    // uncomment this line to enable console-log in entire app otherwise it will by default use reactotron.
    // console.log = () => { };
    console.log(state.appData.localize, ' - Current Language App.js');
  }, [state.appData.localize]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ThemeProvider isDisabled={false}>
          <StackNavigator />
          <Toast
            config={toastConfig}
            topOffset={has_Notch ? 0 : 20}
            position="top"
          />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
