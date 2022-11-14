import React from "react";

import commentIcon from "../../../assets/icons/comment.png";
import cycleIcon from "../../../assets/icons/cycle.png";
import heartIcon from "../../../assets/icons/heart.png";

import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";

interface IPostControls {
  onCommentsPress(): void;
  onLikePress(): void;
  onMirrorPress(): void;
  commentsCount: number;
  likesCount: number;
  mirrorsCount: number;
  isLikeRequest: boolean;
  isLiked: boolean;
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
  } = props;
  return (
    <View className="flex-row items-center">
      <Pressable
        disabled={isLikeRequest}
        onPress={onLikePress}
        className={`flex-row items-center justify-center rounded-2xl py-1 pl-2 pr-3 ${
          isLikeRequest ? "bg-gray" : ""
        } ${isLiked ? "bg-red-300" : ""}`}
      >
        <Image source={heartIcon} className="h-5 w-5" resizeMode="contain" />

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
        <Image source={commentIcon} className="h-5 w-5" resizeMode="contain" />
        <Text className="text-md font-semibold text-neutral-400 ml-1">
          {commentsCount ?? 0}
        </Text>
      </Pressable>
      <Pressable
        onPress={onMirrorPress}
        className="flex-row items-center justify-center py-1 px-2"
      >
        <Image source={cycleIcon} className="h-5 w-5" resizeMode="contain" />
        <Text className="text-md font-semibold text-neutral-400 ml-1">
          {mirrorsCount ?? 0}
        </Text>
      </Pressable>
    </View>
  );
}
