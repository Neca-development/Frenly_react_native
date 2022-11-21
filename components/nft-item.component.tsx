import React from "react";

import NFTImage from "./shared/nft-image.component";

import { View, Text, Pressable } from "react-native";
import { SizesEnum } from "../common/helpers";
import { useNavigation } from "@react-navigation/native";
import { IAlchemyResponse } from "../common/types/alchemy";

const NFTItem = React.memo(function NFTItem(props: IAlchemyResponse) {
  const navigation = useNavigation();

  function openNFT() {
    navigation.navigate("NFT", { data: props });
  }

  return (
    <View className="w-[50%] p-2">
      <View className="pb-3">
        <Pressable onPress={openNFT}>
          <NFTImage
            source={props.metadata.image && { uri: props.metadata.image }}
            size={SizesEnum.md}
            address={props.contract.address}
          />
        </Pressable>
      </View>

      <Text className="font-bold  text-lg">
        {props.contractMetadata.openSea.collectionName ||
          props.metadata.name ||
          props?.collection?.name}
      </Text>
    </View>
  );
});

export default NFTItem;
