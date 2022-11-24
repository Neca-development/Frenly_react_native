import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React from "react";

import { View, SafeAreaView, FlatList, Text } from "react-native";
import AppLoader from "../components/app-loader.component";
import NFTItem from "../components/nft-item.component";
import safeViewAndroid from "../helpers/safe-view-android";
import { useGetNftsForUserQuery } from "../store/alchemy/alchemy.api";

export default function NFTsScreen() {
  const connector = useWalletConnect();

  const { data, isLoading, error } = useGetNftsForUserQuery({
    address: connector.accounts[0],
  });
  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <View className="w-full px-4 pb-3">
        {data?.ownedNfts?.length > 0 ? (
          <FlatList
            numColumns={2}
            keyExtractor={(item) => String(item.id.tokenId)}
            data={data.ownedNfts}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <NFTItem {...item} />}
          />
        ) : (
          !isLoading && <Text className="text-3xl">No nfts</Text>
        )}
      </View>
      {isLoading && <AppLoader />}
    </SafeAreaView>
  );
}
