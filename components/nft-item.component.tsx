import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { SizesEnum } from "../common/helpers";
import { IContentImage } from "./shared/content-image.component";
import NFTImage from "./shared/nft-image.component";
import { useNavigation } from "@react-navigation/native";
import { IAlchemyResponse } from "../common/types/alchemy";

interface INFTItemProps extends IContentImage {
  title: string;
}
const NFTItem = React.memo(function NFTItem(props: IAlchemyResponse) {
  const navigation = useNavigation();

  function openNFT() {
    navigation.navigate("NFT");
  }
  return (
    <View className="w-[50%] p-2">
      <View className="pb-3">
        <Pressable onPress={openNFT}>
          <NFTImage
            source={{ uri: props.metadata.image }}
            size={SizesEnum.md}
          />
        </Pressable>
      </View>

      <Text className="font-bold  text-lg">
        {props.contractMetadata.openSea.collectionName}
      </Text>
    </View>
  );
});

export default NFTItem;
