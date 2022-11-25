/* eslint-disable sonarjs/cognitive-complexity */

import * as ImagePicker from "expo-image-picker";
import EditIcon from "../../../assets/icons/edit-icon";
import CloseIcon from "../../../assets/icons/close-icon";
import Button from "../button.component";
import Toast from "react-native-toast-message";
import PencilIcon from "../../../assets/icons/pencil-icon";
import AppLoader from "../../app-loader.component";
import HeaderEdit from "./header-edit/header-edit.component";
import AvatarComponent from "../avatar.component";
import ArrowBack from "../../../assets/icons/arrowBack";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, Text, View, TextInput } from "react-native";
import { SERVER_URL } from "../../../constants/Api";
import { useUpdate } from "../../../hooks/use-update-user.hook";
import { useAppDispatch } from "../../../store/store.hook";
import { logout } from "../../../store/auth/auth.slice";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { SizesEnum } from "../../../common/helpers";
import { useGetENSByAddress } from "../../../hooks/use-get-ens-by-address.hook";

export interface IHeaderProperties {
  title: string;
  showAddPost?: boolean;
  showPostAuthor?: boolean;
  isOwner?: boolean;
  accountId?: string;
  nickname?: string;
  address: string;
  followHandle?: () => void;
  unfollowHandle?: () => void;
  followers?: number;
  isFollow?: boolean;
  isFreeFollow?: boolean;
  setFreeFollow?: (state: boolean) => void;
  changeFollowModule?: () => void;
  isFollowModule?: boolean;
  isFollowUnFollowLoading: boolean;
}

export default function Header(props: IHeaderProperties) {
  const {
    isOwner,
    nickname,
    address,
    followHandle,
    unfollowHandle,
    followers,
    isFollow,
    isFollowUnFollowLoading,
  } = props;

  const [isEdit, setIsEdit] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();
  const ens = useGetENSByAddress({ address });

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

  const goToNFTs = () => {
    navigation.navigate("NFTs");
  };
  console.log(ens);
  return (
    <>
      {isLoading && <AppLoader />}
      <View className="w-full pt-4 px-4  pb-3">
        <View className="flex-row justify-between items-center">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowBack />
          </Pressable>
          <Text className="text-xl font-bold ">{ens || nameValue}</Text>

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
          <HeaderEdit
            setNameValue={setNameValue}
            nameValue={nameValue}
            setDescValue={setDescValue}
            descValue={descValue}
            saveHandle={saveHandle}
            logOut={logOut}
          />
        ) : (
          <>
            <Text className="text-md font-semibold text-gray-darker ml-1 text-center mt-2">
              {descValue}
            </Text>
            <Text className="text-base font-normal text-gray mb-5 text-center m-auto mt-4">
              Followers: {userInfo?.data?.totalFollowers ?? 0}
            </Text>

            {isOwner && (
              <Button title="My NFTs" style="mt-2" onPress={goToNFTs} />
            )}
            {!isOwner &&
              (isFollow ? (
                <Button
                  title="Unfollow"
                  style="mt-2"
                  onPress={unfollowHandle}
                  disabled={isFollowUnFollowLoading}
                />
              ) : (
                <Button
                  title="Follow"
                  style="mt-2"
                  onPress={followHandle}
                  disabled={isFollowUnFollowLoading}
                />
              ))}
          </>
        )}
      </View>
    </>
  );
}
