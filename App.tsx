import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { onError } from "@apollo/client/link/error";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { setContext } from "apollo-link-context";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { store } from "./store/store";

const httpLink = new HttpLink({ uri: "https://api-mumbai.lens.dev" });
// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = setContext(async (req, { headers }) => {
  const token = await AsyncStorageLib.getItem("lens_access_token");

  return {
    ...headers,
    headers: {
      "x-access-token": token ? `Bearer ${token}` : "",
    },
  };
});
const errorLink = onError(({ forward, operation, graphQLErrors }) => {
  console.log("graphQLErrors");
  graphQLErrors?.forEach((error) => {
    console.log(error);
    if (error.extensions.code == "UNAUTHENTICATED") {
      window.location.pathname = "/auth";
    }
  });
  return forward(operation);
});

export const client = new ApolloClient({
  uri: "https://api-mumbai.lens.dev",
  link: authLink.concat(httpLink),
  //   link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </Provider>
      </ApolloProvider>
    );
  }
}
