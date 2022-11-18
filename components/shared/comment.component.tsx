import moment from "moment";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useUpdate } from "../../hooks/use-update-user.hook";
import AvatarComponent from "./avatar.component";
import { SizesEnum } from "../../common/helpers";
import AvatarWithLink from "./avatar-with-link.component";
//
export interface IComment {
  metadata: any;
  profile: any;
  createdAt: string;
  id: string;
}

const Comment = ({ metadata, profile, createdAt }: IComment) => {
  const { avatar, name, isLoading } = useUpdate(profile.ownedBy);
  const commentDate = moment(createdAt).fromNow(true);
  return (
    <ScrollView horizontal contentContainerStyle={{ width: "100%" }}>
      <View className="flex-1 flex-row items-center mb-2">
        <View className="flex items-center  self-start ">
          {avatar && (
            <AvatarWithLink
              profileId={profile.id}
              avatar={avatar}
              isLoading={isLoading}
              size={SizesEnum.md}
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
