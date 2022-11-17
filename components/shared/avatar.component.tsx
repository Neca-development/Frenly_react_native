import React from "react";

import imagePlaceholder from "../../assets/images/temp-avatar.png";
import SkeletonLoader from "expo-skeleton-loader";
import { Image, View } from "react-native";
import { SERVER_URL } from "../../constants/Api";
import { SizesEnum } from "../../common/helpers";

export interface IAvatarProps {
  isLoading: boolean;
  avatar: string;
  size: SizesEnum;
  withCustomUri?: boolean;
}

export default function AvatarComponent(props: IAvatarProps) {
  const { isLoading = true, avatar, size, withCustomUri = false } = props;

  function sizeSwitcher() {
    switch (size) {
      case SizesEnum.sm:
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "grey",
        };
      case SizesEnum.md:
        return {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "grey",
        };
      case SizesEnum.lg:
        return {
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: "grey",
        };
    }
  }
  if (isLoading) {
    return (
      <SkeletonLoader>
        <SkeletonLoader.Item style={sizeSwitcher()} />
      </SkeletonLoader>
    );
  }

  return (
    <View className="border rounded-full border-border-color overflow-hidden">
      {!withCustomUri && avatar ? (
        <Image
          source={{
            uri: `${SERVER_URL}avatars/${avatar}`,
          }}
          style={[sizeSwitcher()]}
        />
      ) : (
        <Image source={avatar || imagePlaceholder} style={sizeSwitcher()} />
      )}
    </View>
  );
}
