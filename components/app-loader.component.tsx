import React from "react";

import loaderGif from "../assets/gifs/eyes.gif";

import { View, Text, Image, Modal } from "react-native";
import { FullWindowOverlay } from "react-native-screens";

export default function AppLoader() {
  return (
    <Modal transparent visible={true} animationType="fade">
      <View className="items-center w-full h-full bg-white bg-transparent">
        <Image className="w-1/2" source={loaderGif} resizeMode="contain" />
      </View>
    </Modal>
  );
}
