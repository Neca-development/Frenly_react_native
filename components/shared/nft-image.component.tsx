import classNames from "classnames";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { SizesEnum } from "../../common/helpers";
import { getCompressedAddress } from "../../helpers/validators";

interface INFTImage {
  source?: { uri: string };
  size: SizesEnum;
  address: string;
}

export default function NFTImage(props: INFTImage) {
  const { source, size, address } = props;

  const [imageError, setImageError] = useState(false);

  function sizeSwitcher() {
    switch (size) {
      case SizesEnum.sm:
        return "rounded-xl w-[100%] h-[120px]";
      case SizesEnum.md:
        return "rounded-xl w-[100%] h-[180px]";
      case SizesEnum.lg:
        return "rounded-3xl w-[100%] h-[300px]";
    }
  }

  function textSizeSwitcher() {
    switch (size) {
      case SizesEnum.sm:
        return "text-md";
      case SizesEnum.md:
        return "text-md";
      case SizesEnum.lg:
        return "text-2xl";
    }
  }

  return (
    <>
      {source && imageError !== true ? (
        <View className={`object-center overflow-hidden ${sizeSwitcher()}`}>
          <Image
            source={source}
            className={`object-center w-[100%] h-[100%] `}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        </View>
      ) : (
        <View className="w-full relative ">
          <View className={`object-center overflow-hidden ${sizeSwitcher()}`}>
            <LinearGradient
              colors={["#3e3ec2", "#9647a8"]}
              style={{
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowColor: "#000000",
                width: "100%",
                height: "100%",
              }}
            />
          </View>

          <Text
            className={`absolute top-2 left-0 text-base w-full text-center font-bold ${textSizeSwitcher()}`}
          >
            NFT
          </Text>

          <Text
            className={`absolute bottom-2 left-0 text-base w-full text-center font-bold ${textSizeSwitcher()}`}
          >
            {address && getCompressedAddress(address)}
          </Text>
        </View>
      )}
    </>
  );
}
