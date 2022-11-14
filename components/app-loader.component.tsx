import React from "react";

import loaderGif from "../assets/gifs/duck_loader.gif";

import { View, Text, Image, Modal } from "react-native";
import { FullWindowOverlay } from "react-native-screens";

export default function AppLoader() {
  return (
    <Modal transparent visible={true} animationType="fade">
      <View className="items-center w-full h-full  bg-transparent justify-center">
        <Image
          className="w-1/2 bg-transparent"
          source={loaderGif}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}
