import React from "react";
import { View, Text, TextInput } from "react-native";

import Button from "../../../Button";

interface IHeaderEdit {
  setNameValue(text: string): void;
  nameValue: string;
  setDescValue(text: string): void;
  descValue: string;
  saveHandle(): void;
  logOut(): void;
}

export default function HeaderEdit(props: IHeaderEdit) {
  const {
    setNameValue,
    nameValue,
    setDescValue,
    descValue,
    saveHandle,
    logOut,
  } = props;
  return (
    <>
      <Text className="text-md font-semibold text-gray-darker   text-center mt-2">
        Name
      </Text>
      <View className="min-w-[75%] rounded-2xl bg-light-gray flex-row  mb-1">
        <TextInput
          value={nameValue}
          onChangeText={(text) => setNameValue(text)}
          className="outline-none  flex-1 px-4 py-2"
        />
      </View>
      <Text className="text-md font-semibold text-gray-darker text-center mt-2 mb-1">
        Description
      </Text>
      <View className="min-w-[75%] rounded-2xl bg-light-gray flex-row  mb-10">
        <TextInput
          value={descValue}
          onChangeText={(text) => setDescValue(text)}
          className="outline-none flex-1 px-4 py-2"
        />
      </View>
      <Button style="min-w-[75%] mb-4" onPress={saveHandle} title="Save" />
      <Button
        style="min-w-[75%] "
        buttonStyle="bg-red-400"
        onPress={logOut}
        title="Log out"
      />
    </>
  );
}
