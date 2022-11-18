import React from "react";

import { SERVER_URL } from "../../../constants/Api";

import { View, Text, Image, Pressable, Linking } from "react-native";
import { IPostData } from "../post";
import { useUpdate } from "../../../hooks/use-update-user.hook";
import moment from "moment";
import SkeletonLoader from "expo-skeleton-loader";
import renderMessage from "../../../helpers/render-message";
import ContentImage from "../../shared/content-image.component";

interface IPostContent {
  isLoading: boolean;
  userName: string;
  data: IPostData;
}

export default function PostContent(props: IPostContent) {
  const { userName, data, isLoading } = props;
  const { name: mirrorFrom, isLoading: mirrorLoading } = useUpdate(
    data.handleMirror || ""
  );

  return (
    <>
      <View>
        {isLoading ? (
          <SkeletonLoader>
            <SkeletonLoader.Item
              style={{
                width: 100,
                height: 16,
                marginBottom: 2,
                marginTop: 6,
                borderRadius: 10,
              }}
            />
          </SkeletonLoader>
        ) : (
          <Text className="text-base font-semibold">{userName}</Text>
        )}
        {data.mirrorDescription ? (
          <Text className="text-lg">{data.mirrorDescription}</Text>
        ) : null}
        {data?.isMirror && (
          <View className="flex-row align-bottom">
            <Text>🌀 mirrored from </Text>
            {mirrorLoading ? (
              <SkeletonLoader>
                <SkeletonLoader.Item
                  style={{
                    width: 100,
                    height: 10,
                    marginBottom: 2,
                    marginTop: 6,
                    borderRadius: 10,
                  }}
                />
              </SkeletonLoader>
            ) : (
              <Text className="font-bold">
                {mirrorFrom ? mirrorFrom : data.handleMirror}
              </Text>
            )}
          </View>
        )}
        <Text className="text-base font-normal text-gray">
          {`${moment(data.date).format("MMM, DD")} at ${moment(
            data.date
          ).format("LT")}`}
        </Text>
      </View>

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

      <Text className="text-sm font-normal text-gray-darker mt-1">
        {data.info}
      </Text>

      <ContentImage
        source={
          data.image && {
            uri: `${SERVER_URL}token-images/${data.image}`,
          }
        }
      />
    </>
  );
}
