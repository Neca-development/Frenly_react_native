import React from "react";

import { View, SafeAreaView, FlatList } from "react-native";
import NFTItem from "../components/nft-item.component";
import safeViewAndroid from "../helpers/safe-view-android";
import { useGetNftsForUserQuery } from "../store/alchemy/alchemy.api";

export default function NFTsScreen() {
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
