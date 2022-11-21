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

export default function NFTScreen({
  route,
}: RouteProp<RootStackParamList, "NFT">) {
  const [sellPrice, setSellPrice] = useState<null | string>(null);
  console.log(route.params.data);
  const data = route.params.data as IAlchemyResponse;
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
          <View className="w-full rounded-2xl bg-light-gray">
            <TextInput
              value={sellPrice}
              onChangeText={(text) => setSellPrice(text)}
              keyboardType="numeric"
              className="outline-none w-full px-4 py-2"
              placeholder="0"
            />
          </View>

          <Button title="SELL" style="mt-5 min-w-[50%]" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
