import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable } from "react-native";
import AvatarComponent, { IAvatarProps } from "./avatar.component";

interface IAvatarWithLink extends IAvatarProps {
  profileId: string;
}

export default function AvatarWithLink(props: IAvatarWithLink) {
  const { profileId, ...avatarProps } = props;

  const navigation = useNavigation();

  const openProfile = () =>
    navigation.navigate("Profile", {
      id: profileId as string,
    });
  return (
    <Pressable onPress={openProfile} className="mr-4 items-center flex-row">
      <AvatarComponent {...avatarProps} />
    </Pressable>
  );
}
