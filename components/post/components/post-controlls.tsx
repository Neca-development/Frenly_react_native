import React from "react";

import commentIcon from "../../../assets/icons/comment.png";
import cycleIcon from "../../../assets/icons/cycle.png";
import heartIcon from "../../../assets/icons/heart.png";

import { View, Text, Pressable, Image } from "react-native";

interface IPostControls {
  onCommentsPress(): void;
  commentsCount: number;
  likesCount: number;
  isLikeRequest: boolean;
}

export default function PostControls(props: IPostControls) {
  const { commentsCount, onCommentsPress, likesCount, isLikeRequest } = props;
  return (
    <View className="flex-row items-center">
      <Pressable
        // disabled={isLikeRequest}
        // onClick={likeHandler}
        className={`flex-row items-center justify-center py-1 px-2 ${
          isLikeRequest ? "bg-gray" : ""
        }`}
      >
        <Image source={heartIcon} className="h-5 w-5" resizeMode="contain" />
        <Text className="text-md font-semibold text-gray-darker ml-1">
          {likesCount}
        </Text>
      </Pressable>
      <Pressable
        onPress={onCommentsPress}
        className="flex-row items-center justify-center py-1 px-2"
      >
        <Image source={commentIcon} className="h-5 w-5" resizeMode="contain" />
        <Text className="text-md font-semibold text-gray-darker ml-1">
          {commentsCount ?? 0}
        </Text>
      </Pressable>
      <Pressable
        // onClick={mirrorHandler}
        className="flex-row items-center justify-center py-1 px-2"
      >
        <Image source={cycleIcon} className="h-5 w-5" resizeMode="contain" />
        <Text className="text-md font-semibold text-gray-darker ml-1">
          {/* {totalMirror} */}0
        </Text>
      </Pressable>
    </View>
  );
}
