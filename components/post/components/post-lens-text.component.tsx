import React from "react";
import { View, Text, Pressable, Linking } from "react-native";
import renderMessage from "../../../helpers/render-message";
import { IPostData } from "../post";

export default function PostLensText({ data }: { data: IPostData }) {
  return (
    <View>
      <Text className="text-base font-semibold">
        {renderMessage(data)}{" "}
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
  );
}
