import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, Pressable } from "react-native";
import NFTItem from "../components/nft-item.component";
import safeViewAndroid from "../helpers/safe-view-android";
import { useGetNftsForUserQuery } from "../store/alchemy/alchemy.api";

export default function NFTsScreen() {
  const connector = useWalletConnect();

  const { data } = useGetNftsForUserQuery({
    address: "0x276417be271dbEB696CB97cdA7c6982FD89E6BD4",
  });
  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <View className="w-full px-4 pb-3">
        {data?.ownedNfts && (
          <FlatList
            numColumns={2}
            keyExtractor={(item) => String(item.id.tokenId)}
            data={data.ownedNfts}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <NFTItem {...item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
