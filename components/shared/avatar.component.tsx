import React from "react";

import imagePlaceholder from "../../assets/images/temp-avatar.png";
import SkeletonLoader from "expo-skeleton-loader";
import { Image } from "react-native";
import { SERVER_URL } from "../../constants/Api";
import { SizesEnum } from "../../common/helpers";

type AvatarProps = {
  isLoading: boolean;
  avatar: string;
  size: SizesEnum;
};

export default function AvatarComponent(props: AvatarProps) {
  const { isLoading, avatar, size } = props;

  function sizeSwitcher() {
    switch (size) {
      case SizesEnum.sm:
        return "w-[32px] h-[32px]";
      case SizesEnum.md:
        return "w-[40px] h-[40px]";
      case SizesEnum.lg:
        return "w-[96px] h-[96px]";
    }
  }
  return (
    <>
      {isLoading ? (
        <SkeletonLoader>
          <SkeletonLoader.Item
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
          />
        </SkeletonLoader>
      ) : avatar ? (
        <Image
          source={{
            uri: `${SERVER_URL}avatars/${avatar}`,
          }}
          className={`rounded-full ${sizeSwitcher()}`}
        />
      ) : (
        <Image
          source={data.avatar || imagePlaceholder}
          className={`rounded-full ${sizeSwitcher()}`}
        />
      )}
    </>
  );
}
