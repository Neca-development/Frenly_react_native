import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  ScrollView,
  Linking,
  Pressable,
} from "react-native";
import Button from "../components/shared/button.component";
import NFTImage from "../components/shared/nft-image.component";
import safeViewAndroid from "../helpers/safe-view-android";
import Toast from "react-native-toast-message";

import { SizesEnum } from "../common/helpers";
import { RootStackParamList } from "../types";
import type { RouteProp } from "@react-navigation/native";
import { IAlchemyResponse } from "../common/types/alchemy";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { createOrder } from "../contract/nft.api";
import { useCreateZeroexPostMutation } from "../store/auth/auth.api";
import useSwitchNetwork from "../hooks/use-switch-network.hook";
import { ETHEREUM_CHAIN_ID, MUMBAI_HEX_CHAIN_ID } from "../constants/Api";

export default function NFTScreen({
  route,
  navigation,
}: RouteProp<RootStackParamList, "NFT">) {
  const [sellPrice, setSellPrice] = useState<null | string>(null);
  const data = route.params.data as IAlchemyResponse;

  const [createZeroexPost] = useCreateZeroexPostMutation();

  const connector = useWalletConnect();
  const { switchNetwork } = useSwitchNetwork();

  async function onSellPress() {
    try {
      if (sellPrice == null) {
        throw Error("Enter the selling price");
      }
      switchNetwork(ETHEREUM_CHAIN_ID);
      const signedObject = await createOrder(connector, data, sellPrice);
      if (!signedObject) {
        throw Error("Error creating order");
      }
      const collectionName =
        data?.metadata?.collection?.name ||
        data?.contractMetadata?.openSea?.collectionName ||
        "";
      const res = await createZeroexPost({
        image: data?.metadata?.image,
        collectionName,
        price: sellPrice,
        signedObject: JSON.stringify(signedObject),
        walletAddress: connector.accounts[0],
      });
      if (res?.error) {
        throw Error(res.error.data.error);
      }
      console.log("✅", res);
      navigation.navigate("NFTs");
      Toast.show({
        type: "success",
        text1: "✅ Success",
        text2: "Sell order created",
        visibilityTime: 8000,
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: `❌ ${error?.message ? error.message : error}`,
        visibilityTime: 8000,
      });
    } finally {
      switchNetwork(MUMBAI_HEX_CHAIN_ID);
    }
  }

  function onPriceChange(price: string) {
    if (Number.isNaN(Number(price))) {
      return;
    }
    setSellPrice(price);
  }
  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <ScrollView>
        <View className="px-10 py-6 items-center">
          <NFTImage
            size={SizesEnum.lg}
            source={{ uri: data.metadata.image }}
            address={data.contract.address}
          />
          <Text className="text-2xl font-extrabold mt-3">Contract address</Text>
          <Pressable
            onPress={() =>
              Linking.openURL(
                `https://polygonscan.com/address/${data.contract.address}`
              )
            }
          >
            <Text className="text-xl text-main font-extrabold text-center">
              {data.contract.address}
            </Text>
          </Pressable>
          <Text className="text-2xl font-extrabold mt-3">NFT name</Text>
          <Text className="text-xl  first-letter">
            {data.contractMetadata.name}
          </Text>

          <Text className="text-2xl font-extrabold mt-3 mb-1">Sell amount</Text>
          <View className="w-full rounded-2xl bg-light-gray relative">
            <TextInput
              value={sellPrice}
              onChangeText={onPriceChange}
              keyboardType="numeric"
              className="outline-none w-full pl-4 pr-12 py-2"
              placeholder="0"
            />
            <View className="h-full absolute right-2 top-0 justify-center ">
              <Text className="font-semibold text-main">ETH</Text>
            </View>
          </View>

          <Button title="SELL" style="mt-5 min-w-[50%]" onPress={onSellPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
