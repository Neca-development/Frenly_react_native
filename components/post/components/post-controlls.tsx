import React from "react";

import commentIcon from "../../../assets/icons/comment.png";
import cycleIcon from "../../../assets/icons/cycle.png";
import heartIcon from "../../../assets/icons/heart.png";
import heartBorderIcon from "../../../assets/icons/hearth-border.png";

import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import TwitterIcon from "../../../assets/icons/twitter";

interface IPostControls {
  onCommentsPress(): void;
  onLikePress(): void;
  onMirrorPress(): void;
  commentsCount: number;
  likesCount: number;
  mirrorsCount: number;
  isLikeRequest: boolean;
  isLiked: boolean;
  repostTwitterLink: string;
}

export default function PostControls(props: IPostControls) {
  const {
    commentsCount,
    onCommentsPress,
    onMirrorPress,
    likesCount,
    mirrorsCount,
    isLiked,
    isLikeRequest,
    onLikePress,
    repostTwitterLink,
  } = props;
  return (
    <View className="flex-row items-center">
      <Pressable
        disabled={isLikeRequest}
        onPress={onLikePress}
        className={`flex-row items-center justify-center rounded-2xl py-1 px-2 ${
          isLikeRequest ? "bg-gray" : ""
        } ${isLiked ? "bg-red-300" : ""}`}
      >
        {isLiked ? (
          <Image source={heartIcon} className="h-4 w-4" resizeMode="contain" />
        ) : (
          <Image
            source={heartBorderIcon}
            className="h-4 w-4"
            resizeMode="contain"
          />
        )}

        <Text
          className={`text-md font-semibold ml-1 ${
            isLiked ? "text-gray-900" : "text-neutral-500"
          }`}
        >
          {likesCount}
        </Text>
      </Pressable>

      <Pressable
        onPress={onCommentsPress}
        className="flex-row items-center justify-center py-1 px-2"
      >
        <Image source={commentIcon} className="h-4 w-4" resizeMode="contain" />
        <Text className="text-md font-semibold text-neutral-400 ml-1">
          {commentsCount ?? 0}
        </Text>
      </Pressable>
      <Pressable
        onPress={onMirrorPress}
        className="flex-row items-center justify-center py-1 px-2"
      >
        <Image source={cycleIcon} className="h-4 w-4" resizeMode="contain" />
        <Text className="text-md font-semibold text-neutral-400 ml-1">
          {mirrorsCount ?? 0}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => Linking.openURL(repostTwitterLink)}
        className="flex-row items-center justify-center py-1 px-2"
      >
        <TwitterIcon />
      </Pressable>
    </View>
  );
}
