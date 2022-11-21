import React from "react";
import { View, Text, Image } from "react-native";

import postPlaceholder from "../../assets/images/post-placeholder.png";

export type IContentImage = {
  source?: { uri: string };
};

export default function ContentImage(props: IContentImage) {
  const { source } = props;
  return (
    <View>
      {source ? (
        <View className="relative mt-1">
          <Image
            source={source}
            resizeMode="cover"
            className="h-[300px] rounded-lg overflow-hidden object-center"
          />
        </View>
      ) : (
        <View className="relative mt-1 items-center h-[300px] w-full  rounded-lg overflow-hidden object-center bg-gray"></View>
      )}
    </View>
  );
}
