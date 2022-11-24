import React from "react";
import { View, Text } from "react-native";
import { PostTypeEnum } from "../../../common/helpers";
import { useUpdate } from "../../../hooks/use-update-user.hook";

interface IPostZeroexText {
  postType: PostTypeEnum;
  from?: string;
  to?: string;
}

export default function PostZeroexText(props: IPostZeroexText) {
  const { name } = useUpdate(
    props.postType === PostTypeEnum.BUY_EVENT
      ? props?.from || ""
      : props?.to || ""
  );
  const { postType } = props;

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
              🎊 Just sold my NFT to
            </Text>
            <Text className="text-base font-semibold text-main"> {name} </Text>
          </>
        );
      case PostTypeEnum.BUY_EVENT:
        return (
          <>
            <Text className="text-base font-semibold ">
              🎊 Just bought new NFT from{" "}
            </Text>

            <Text className="text-base font-semibold text-main"> {name} </Text>
          </>
        );
    }
  }
  return (
    <View className="flex-row flex-wrap">
      {textSwitcher()}
      <Text className="text-base font-semibold ">via Frenly</Text>
    </View>
  );
}
