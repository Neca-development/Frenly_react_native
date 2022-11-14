import React, { useState } from "react";
import { View, Text, Modal, Pressable, TextInput } from "react-native";

interface IModalComponentProps {
  title: string;
  onSubmit(mirrorText: string): void;
  onClose(): void;
}

export default function ModalComponent(props: IModalComponentProps) {
  const { onSubmit, title, onClose } = props;

  const [mirrorText, setMirrorText] = useState("");

  function submitHandler() {
    onClose();
    onSubmit(mirrorText);
  }
  return (
    <Modal transparent visible={true}>
      <View className="  w-full md:inset-0 h-modal md:h-full  justify-center">
        <View className="relative p-4    h-full md:h-auto  w-full justify-center">
          <View className="relative bg-white rounded-lg shadow dark:bg-gray-700 ">
            <View className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
              <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </Text>
            </View>
            <View className="p-6 space-y-6">
              <TextInput
                value={mirrorText}
                onChangeText={(e) => {
                  console.log(e);
                  setMirrorText(e);
                }}
                type="text"
                className="outline-none w-full"
                placeholder="Comment"
              />
            </View>
            <View className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600 flex-row justify-end">
              <Pressable
                onPress={onClose}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                <Text> Decline</Text>
              </Pressable>

              <Pressable
                onPress={submitHandler}
                className=" bg-main hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Text className="text-white"> I accept</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
