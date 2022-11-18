import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, Pressable } from "react-native";
import NFTItem from "../components/nft-item.component";
import safeViewAndroid from "../helpers/safe-view-android";
import { useGetNftsForUserQuery } from "../store/alchemy/alchemy.api";

const data = [
  {
    id: 0,
    title: "Nft🧡",
    source: {
      uri: "https://www.artnews.com/wp-content/uploads/2022/01/unnamed-2.png?w=631",
    },
  },
  {
    id: 1,
    title: "Nft🧡",
    source: {
      uri: "https://assets-global.website-files.com/6171adb6a942ed69f5e6b5ee/629dd5129f20eeb121d90735_Anon_Chibi_15._-_Phunky_NFT_400x400.png",
    },
  },
  {
    id: 2,
    title: "Nft🧡",
    source: {
      uri: "https://root-nation.com/wp-content/uploads/2021/09/NFT-6.jpg",
    },
  },
  {
    id: 3,
    title: "Nftasdadasdsa🧡",
    source: {
      uri: "https://assets-global.website-files.com/6171adb6a942ed69f5e6b5ee/629dd5129f20eeb121d90735_Anon_Chibi_15._-_Phunky_NFT_400x400.png",
    },
  },
  {
    id: 4,
    title: "Monkey",
    source: {
      uri: "https://www.artnews.com/wp-content/uploads/2022/01/unnamed-2.png?w=631",
    },
  },
  {
    id: 5,
    title: "MonkeyASD",
  },
];

export default function NFTsScreen() {
  const connector = useWalletConnect();

  const { data } = useGetNftsForUserQuery({
    address: "0x276417be271dbEB696CB97cdA7c6982FD89E6BD4",
  });
  // https://eth-mainnet.g.alchemy.com/nft/v2/JANw7_5C171cj-buFVibsh1jIZAwe4Yq/getNFTs?owner=0x276417be271dbEB696CB97cdA7c6982FD89E6BD4
  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <View className="w-full px-4 pb-3">
        {data?.ownedNfts && (
          <FlatList
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            data={data.ownedNfts}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <NFTItem {...item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
