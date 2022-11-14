/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Image, View } from "react-native";
import Auth from "../screens/auth";
import Feed from "../screens/feed";

import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import Profile from "../screens/profile";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import AppLoader from "../components/app-loader.component";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const connector = useWalletConnect();

  const [isUserAuth, setUserAuth] = React.useState<Boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    (async () => {
      // connector.killSession();
      const back = {
        access: await AsyncStorageLib.getItem("back_access_token"),
        refresh: await AsyncStorageLib.getItem("back_refresh_token"),
      };

      const lens = {
        access: await AsyncStorageLib.getItem("lens_access_token"),
        refresh: await AsyncStorageLib.getItem("lens_refresh_token"),
      };

      if (back.access && lens.access) {
        setUserAuth(true);
        return;
      }
      setUserAuth(false);
    })();
  }, []);

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isUserAuth !== undefined ? (
        <RootNavigator initialRoute={isUserAuth ? "Feed" : "Auth"} />
      ) : (
        <AppLoader />
      )}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator({
  initialRoute,
}: {
  initialRoute: keyof RootStackParamList;
}) {
  return (
    <Stack.Navigator initialRouteName={initialRoute ?? "Auth"}>
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
