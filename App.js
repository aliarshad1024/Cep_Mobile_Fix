import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import TabNavigator from "./navigation/StackNavigation";
import UnauthenticatedStack from "./navigation/UnauthenticatedStack";
import SplashScreen from 'react-native-splash-screen';

import { useSelector } from "react-redux";
import { LogLevel, OneSignal } from 'react-native-onesignal';
import VersionCheck from 'react-native-version-check';
import { Linking, Platform, Alert } from 'react-native';

const NavigationDecider = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <>
      {auth.isAuthenticated ? <TabNavigator /> : <UnauthenticatedStack />}
    </>
  );
};

export default function App() {
  OneSignal.initialize("76b207cd-65b5-4bbc-a867-9cc98e4c0620");
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.Notifications.requestPermission(true);

  useEffect(() => {
    async function prepare() {
      // SplashScreen.hide() needs to be called after the native splash screen has been hidden
      SplashScreen.hide();
    }
    prepare();
  }, []);

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion({
          packageName: 'com.dev_cep.CEP', // Replace with your app's package name
          ignoreErrors: true,
        });

        const currentVersion = VersionCheck.getCurrentVersion();

        if (latestVersion > currentVersion) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  Linking.openURL(
                    Platform.OS === 'ios'
                      ? VersionCheck.getAppStoreUrl({ appID: 'com.dev_cep.CEP' })
                      : "http://play.google.com/store/apps/details?id=com.dev_cep.CEP"
                  );
                },
              },
              {
                text: 'Cancel',
                onPress: () => {},
              },
            ],
            { cancelable: true }
          );
        } else {
          // App is up-to-date, proceed with the app
        }
      } catch (error) {
        // Handle error while checking app version
        console.error('Error checking app version:', error);
      }
    };

    checkAppVersion();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <NavigationDecider />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
