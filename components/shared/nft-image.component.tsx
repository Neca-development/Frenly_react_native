import classNames from "classnames";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, Image } from "react-native";
import { SizesEnum } from "../../common/helpers";

interface INFTImage {
  source?: { uri: string };
  size: SizesEnum;
}

export default function NFTImage(props: INFTImage) {
  const { source, size } = props;

  function sizeSwitcher() {
    switch (size) {
      case SizesEnum.sm:
        return "w-[100%] h-[120px]";
      case SizesEnum.md:
        return "rounded-xl w-[100%] h-[180px]";
      case SizesEnum.lg:
        return "rounded-3xl w-[100%] h-[300px]";
    }
  }

  return (
    <>
      {source ? (
        <Image
          source={source}
          className={`object-center ${sizeSwitcher()}`}
          resizeMode="cover"
        />
      ) : (
        <View className={`object-center   overflow-hidden ${sizeSwitcher()}`}>
          <LinearGradient
            colors={["#2222cc", "#9332a8"]}
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
      )}
    </>
  );
}
