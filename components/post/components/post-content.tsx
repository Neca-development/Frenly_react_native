import React from "react";

import { SERVER_URL } from "../../../constants/Api";

import { View, Text, Image, Pressable, Linking } from "react-native";
import { IPostData } from "../post";
import { useUpdate } from "../../../hooks/use-update-user.hook";
import moment from "moment";
import SkeletonLoader from "expo-skeleton-loader";
import ContentImage from "../../shared/content-image.component";
import PostLensText from "./post-lens-text.component";
import { PostTypeEnum } from "../../../common/helpers";
import PostZeroexText from "./post-zeroex-text";

interface IPostContent {
  isLoading: boolean;
  userName: string;
  data: Partial<IPostData>;
  postType: PostTypeEnum;
}

export default function PostContent(props: IPostContent) {
  const { userName, data, isLoading, postType } = props;

  const { name: mirrorFrom, isLoading: mirrorLoading } = useUpdate(
    data?.handleMirror || ""
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

      {postType === PostTypeEnum.NFT_TRANSFER ? (
        <PostLensText data={data} />
      ) : (
        <PostZeroexText postType={postType} from={data.from} to={data.to} />
      )}

      <ContentImage
        source={
          data.image && {
            uri:
              postType === PostTypeEnum.NFT_TRANSFER
                ? `${SERVER_URL}token-images/${data.image}`
                : data.image,
          }
        }
      />

      <Text className="text-sm font-normal text-gray-darker mt-1">
        {data.info}
      </Text>
    </>
  );
}
