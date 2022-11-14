import moment from "moment";
import React from "react";
import imagePlaceholder from "../assets/images/temp-avatar.png";
import { Image, ScrollView, Text, View } from "react-native";
import { SERVER_URL } from "../constants/Api";
import { useUpdate } from "../hooks/use-update-user.hook";

export interface IComment {
  metadata: any;
  profile: any;
  createdAt: string;
  id: string;
}

const Comment = ({ metadata, profile, createdAt }: IComment) => {
  const { avatar, name } = useUpdate(profile.ownedBy);
  const commentDate = moment(createdAt).fromNow(true);
  return (
    <ScrollView horizontal contentContainerStyle={{ width: "100%" }}>
      <View className="flex-1 flex-row items-center mb-2">
        <View className="flex items-center border rounded-full border-border-color overflow-hidden self-start mr-2">
          {avatar ? (
            <Image
              source={{
                uri: `${SERVER_URL}avatars/${avatar}`,
              }}
              className="w-[40px] h-[40px] rounded-full"
            />
          ) : (
            <Image
              source={profile?.avatar || imagePlaceholder}
              className="w-[40px] h-[40px] rounded-full"
            />
          )}
        </View>

        <View className="flex-1 border-b-[1px] border-border-color  pb-4">
          <View className="w-full flex-row justify-between">
            <Text className="text-base font-semibold">
              {name || profile?.handle}
            </Text>
            <Text className="text-sm text-gray">
              {commentDate && commentDate}
            </Text>
          </View>
          <Text className="w-full text-base font-normal text-gray">
            {metadata.content}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Comment;
