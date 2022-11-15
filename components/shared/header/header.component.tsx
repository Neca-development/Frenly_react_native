/* eslint-disable sonarjs/cognitive-complexity */
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, Text, View, TextInput } from "react-native";
import ArrowBack from "../../../assets/icons/arrowBack";
import { SERVER_URL } from "../../../constants/Api";
import { useUpdate } from "../../../hooks/use-update-user.hook";
import { useAppDispatch } from "../../../store/store.hook";
import { logout } from "../../../store/auth/auth.slice";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import AvatarComponent from "../avatar.component";
import { SizesEnum } from "../../../common/helpers";
import EditIcon from "../../../assets/icons/edit-icon";
import CloseIcon from "../../../assets/icons/close-icon";
import Button from "../../Button";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import PencilIcon from "../../../assets/icons/pencil-icon";
import AppLoader from "../../app-loader.component";

export interface IHeaderProperties {
  title: string;
  showAddPost?: boolean;
  showPostAuthor?: boolean;
  isOwner?: boolean;
  accountId?: string;
  nickname?: string;
  address?: string;
  followHandle?: () => void;
  unfollowHandle?: () => void;
  followers?: number;
  isFollow?: boolean;
  isFreeFollow?: boolean;
  setFreeFollow?: (state: boolean) => void;
  changeFollowModule?: () => void;
  isFollowModule?: boolean;
}

export default function Header(props: IHeaderProperties) {
  const {
    title,
    showPostAuthor = false,
    isOwner,
    accountId,
    nickname,
    address,
    followHandle,
    unfollowHandle,
    followers,
    isFollow,
    isFreeFollow,
    setFreeFollow,
    changeFollowModule,
    isFollowModule,
  } = props;

  const [isEdit, setIsEdit] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();

  const {
    userInfo,
    updateUserInfo,
    refetchUserInfo,
    name,
    description,
    avatar,
    uploadImage,
    isLoading: profileLoading,
  } = useUpdate(address || "");

  const [nameValue, setNameValue] = useState(name === null ? nickname : name);
  const [descValue, setDescValue] = useState(
    description === null ? address : description
  );
  const [previewValue, setPreviewValue] = useState(
    avatar && avatar !== null
      ? `${SERVER_URL}avatars/${avatar}`
      : "/assets/images/temp-avatar.png"
  );
  const [fileImage, setFileImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const logOut = async () => {
    await dispatch(logout());
    await connector.killSession();

    await AsyncStorageLib.removeItem("lens_access_token");
    await AsyncStorageLib.removeItem("lens_refresh_token");

    navigation.navigate("Auth");
  };

  useEffect(() => {
    setNameValue(name == null ? nickname : name);
    setDescValue(description === null ? address : description);
    setPreviewValue(avatar);
  }, [nickname, address, name, description, avatar, isOwner]);

  function toggleEditMode() {
    setIsEdit(!isEdit);
  }

  async function launchImage() {
    if (!isEdit) {
      return;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result?.cancelled) {
        setIsPreviewVisible(true);
        setPreviewValue({ uri: `data:image/jpeg;base64,${result?.base64}` });
        setFileImage(result);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: String(error),
      });
    }
  }

  const uploadAvatar = async () => {
    try {
      const imageResp = await uploadImage({ avatar: fileImage });
      if (imageResp?.error) {
        Toast.show({
          type: "error",
          text1: "❌ Error",
          text2: `${
            imageResp?.error?.originalStatus
              ? "Image Too Large"
              : "Try again later"
          }`,
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "❌ Avatar upload error",
        text2: "Try again later",
      });
    }
  };

  const saveHandle = async () => {
    try {
      setIsLoading(true);
      if (nameValue || descValue) {
        await updateUserInfo({ username: nameValue, description: descValue });
      }
      if (fileImage) {
        await uploadAvatar();
      }
      refetchUserInfo();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Try again later",
      });
    } finally {
      setIsEdit(false);
      setIsLoading(false);
      setIsPreviewVisible(false);
    }
  };

  return (
    <>
      {isLoading && <AppLoader />}
      <View className="w-full pt-4 px-4  pb-3">
        <View className="flex-row justify-between items-center">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowBack />
          </Pressable>
          <Text className="text-xl font-bold ">{nameValue}</Text>

          {isOwner ? (
            <Pressable onPress={toggleEditMode}>
              {isEdit ? <CloseIcon /> : <EditIcon />}
            </Pressable>
          ) : (
            <View className="w-[24px] h-[25px]" />
          )}
        </View>
      </View>
      <View className="w-full items-center pt-2 pb-8 px-4 ">
        <Pressable onPress={launchImage} className="relative">
          <AvatarComponent
            avatar={previewValue}
            isLoading={profileLoading}
            size={SizesEnum.lg}
            withCustomUri={isPreviewVisible}
          />
          {isEdit && (
            <View className=" absolute right-[-5px] top-[-5px]">
              <PencilIcon />
            </View>
          )}
        </Pressable>
        {isEdit ? (
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
            <Button
              style="min-w-[75%] mb-4"
              onPress={saveHandle}
              title="Save"
            />
            <Button
              style="min-w-[75%] "
              buttonStyle="bg-red-400"
              onPress={logOut}
              title="Log out"
            />
          </>
        ) : (
          <>
            <Text className="text-md font-semibold text-gray-darker ml-1 text-center mt-2">
              {descValue}
            </Text>
            <Text className="text-base font-normal text-gray mb-5 text-center m-auto mt-4">
              Followers: {followers}
            </Text>
          </>
        )}

        {/* {!isOwner ? (
          isFollow ? (
            <Button title="Follow" style="mt-2" onPress={followHandle} />
          ) : (
            <Button title="Unfollow" style="mt-2" onPress={unfollowHandle} />
          )
        ) : null} */}
      </View>
    </>
  );
}
