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
import { SizesEnum } from "../common/helpers";
import Button from "../components/shared/button.component";
import NFTImage from "../components/shared/nft-image.component";
import safeViewAndroid from "../helpers/safe-view-android";
import { RootStackParamList } from "../types";
import type { RouteProp } from "@react-navigation/native";
import { IAlchemyResponse } from "../common/types/alchemy";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { createOrder } from "../contract/nft.api";
import { useCreateZeroexPostMutation } from "../store/auth/auth.api";
import Toast from "react-native-toast-message";

export default function NFTScreen({
  route,
}: RouteProp<RootStackParamList, "NFT">) {
  const [sellPrice, setSellPrice] = useState<null | string>(null);
  const data = route.params.data as IAlchemyResponse;

  const [createZeroexPost] = useCreateZeroexPostMutation();

  const connector = useWalletConnect();

  async function onSellPress() {
    try {
      if (sellPrice == null) {
        throw Error("Enter the selling price");
      }
      const signedObject = await createOrder(connector, data, sellPrice);
      if (!signedObject) {
        throw Error("Error creating order");
      }
      const collectionName =
        data?.metadata?.collection?.name ||
        data?.contractMetadata?.openSea?.collectionName ||
        "";
      await createZeroexPost({
        image: data?.metadata?.image,
        collectionName,
        price: sellPrice,
        signedObject,
        walletAddress: connector.accounts[0],
      });
      Toast.show({
        type: "success",
        text1: "✅ Success",
        text2: "Sell order created",
        visibilityTime: 8000,
      });
      setSellPrice(null);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: `❌ ${error?.message ? error.message : error}`,
        visibilityTime: 8000,
      });
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
