import React from "react";

import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable } from "react-native";
import { PostTypeEnum } from "../../../common/helpers";
import { useGetWalletProfileId } from "../../../contract/lens-hub.api";
import { useUpdate } from "../../../hooks/use-update-user.hook";

interface IPostZeroexText {
  postType: PostTypeEnum;
  from?: string;
  to?: string;
}

export default function PostZeroexText(props: IPostZeroexText) {
  const navigation = useNavigation();

  const { name } = useUpdate(
    props.postType === PostTypeEnum.BUY_EVENT
      ? props?.from || ""
      : props?.to || ""
  );
  const { postType } = props;

  const { value: profileId } = useGetWalletProfileId(
    props.postType === PostTypeEnum.BUY_EVENT
      ? props?.from || ""
      : props?.to || ""
  );

  const openProfile = () =>
    navigation.navigate("Profile", {
      id: profileId as string,
    });

  function textSwitcher() {
    switch (postType) {
      case PostTypeEnum.SELL_ORDER:
        return (
          <Text className="text-base font-semibold ">
            "🖼 My NFT is on sale"
          </Text>
        );
      case PostTypeEnum.SELL_EVENT:
        return (
          <>
            <Text className="text-base font-semibold ">
              🎊 Just sold my NFT to{" "}
            </Text>
            <Pressable onPress={openProfile}>
              <Text className="text-base font-semibold text-main">{name}</Text>
            </Pressable>
          </>
        );
      case PostTypeEnum.BUY_EVENT:
        return (
          <>
            <Text className="text-base font-semibold ">
              🎊 Just bought new NFT from{" "}
            </Text>
            <Pressable onPress={openProfile}>
              <Text className="text-base font-semibold text-main">{name}</Text>
            </Pressable>
          </>
        );
    }
  }
  return (
    <View className="flex-row flex-wrap">
      {textSwitcher()}
      <Text className="text-base font-semibold "> via Frenly</Text>
    </View>
  );
}
