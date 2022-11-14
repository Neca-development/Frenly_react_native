import React from "react";

import postPlaceholder from "../../../assets/images/post-placeholder.png";
import { SERVER_URL } from "../../../constants/Api";

import { View, Text, Image, Pressable, Linking } from "react-native";
import { IPostData } from "../post";
import { useUpdate } from "../../../hooks/use-update-user.hook";

interface IPostContent {
  userName: string;
  data: IPostData;
}

export default function PostContent(props: IPostContent) {
  const { userName, data } = props;
  const { name: mirrorFrom } = useUpdate(data.handleMirror || "");

  const renderMessage = () => {
    let message;
    const messageTypeClone =
      data.from == "0x0000000000000000000000000000000000000000"
        ? "MINTED"
        : data.messageType;

    switch (messageTypeClone) {
      case "MINTED":
        message = "🎉 Minted a new ";
        break;
      case "RECEIVE":
        message = "📤 Received ";
        break;
      case "SEND":
        message = "📤 Sent ";
        break;
      default:
        break;
    }

    switch (data.itemType) {
      case "nft":
        message += `${data.messageType !== "MINTED" ? "an" : ""} NFT`;
        break;
      case "token":
        message += "tokens";
        break;
      default:
        break;
    }

    return `${message} `;
  };
  return (
    <>
      <View>
        <Text className="text-base font-semibold">{userName}</Text>

        {data.mirrorDescription ? (
          <Text className="text-lg">{data.mirrorDescription}</Text>
        ) : null}
        {data.isMirror ? (
          <View className="flex-row">
            <Text>🌀 mirrored from </Text>
            <Text className="font-bold">
              {mirrorFrom ? mirrorFrom : data.handleMirror}
            </Text>
          </View>
        ) : null}
        <Text className="text-base font-normal text-gray">{data.date}</Text>
      </View>

      <View>
        <Text className="text-base font-semibold">
          {renderMessage()}{" "}
          {data.from !== "0x0000000000000000000000000000000000000000" ? (
            data.messageType == "RECEIVE" ? (
              <>from&nbsp;</>
            ) : (
              <>to&nbsp;</>
            )
          ) : (
            <>from Smart contract&nbsp;</>
          )}
        </Text>
        <Pressable
          onPress={() =>
            Linking.openURL(
              data.blockchainType === "ETHEREUM"
                ? `https://rinkeby.etherscan.io/address/${
                    data.from == "0x0000000000000000000000000000000000000000"
                      ? data.contractAddress
                      : data.from
                  }`
                : `https://polygonscan.com/address/${
                    data.from == "0x0000000000000000000000000000000000000000"
                      ? data.contractAddress
                      : data.from
                  }`
            )
          }
        >
          <Text className="text-main text-base font-semibold" rel="noreferrer">
            {data.from == "0x0000000000000000000000000000000000000000"
              ? data.contractAddress
              : data.messageType == "RECEIVE"
              ? data.from
              : data.to}
          </Text>
        </Pressable>
      </View>

      <Text className="text-sm font-normal text-gray-darker mt-1">
        {data.info}
      </Text>

      {data.image ? (
        <View className="relative mt-1">
          <Image
            source={{
              uri: `${SERVER_URL}token-images/${data.image}`,
            }}
            resizeMode="cover"
            className="h-[300px] rounded-lg overflow-hidden object-center"
          />
        </View>
      ) : (
        <View className="relative mt-1 items-center">
          <Image
            source={postPlaceholder}
            className="h-[100px] rounded-lg overflow-hidden object-center"
            resizeMode="contain"
          />
        </View>
      )}
    </>
  );
}
