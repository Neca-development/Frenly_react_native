import React, { useState } from "react";
import { View, Text, Image } from "react-native";

export type IContentImage = {
  source?: { uri: string };
};

export default function ContentImage(props: IContentImage) {
  const { source } = props;

  const [loadError, setLoadError] = useState(false);
  return (
    <View>
      {source && !loadError ? (
        <View className="relative mt-1">
          <Image
            onError={() => setLoadError(true)}
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
