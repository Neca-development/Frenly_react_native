import React from "react";
import { View, Text } from "react-native";
import { PostTypeEnum } from "../../../common/helpers";

interface IPostZeroexText {
  postType: PostTypeEnum;
}

export default function PostZeroexText(props: IPostZeroexText) {
  const { postType } = props;

  function textSwitcher() {
    switch (postType) {
      case PostTypeEnum.SELL_ORDER:
        return "🖼 My NFT is on sale";
      case PostTypeEnum.SELL_EVENT:
        return "🎊 Just sold my NFT to fakeelonmusk.eth";
      case PostTypeEnum.BUY_EVENT:
        return "🎊 Just bought new NFT from realelonmusk.eth";
    }
  }
  return (
    <View>
      <Text className="text-base font-semibold ">
        {`${textSwitcher()} `}
        via Frenly
      </Text>
    </View>
  );
}
