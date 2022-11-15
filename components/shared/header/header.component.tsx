/* eslint-disable sonarjs/cognitive-complexity */
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
// import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
// import { toast } from 'react-toastify'
import { useGetWalletProfileId } from "src/contract/lens-hub.api";
import ArrowBack from "../../../assets/icons/arrowBack";
import Share from "../../../assets/icons/share";
import { SERVER_URL } from "../../../constants/Api";
import Button from "../../Button";

import tempAvatar from "../../../assets/images/temp-avatar.png";

import Loader from "../loader/loader.component";
import { useUpdate } from "../../../hooks/use-update-user.hook";
import BackIcon from "../../../assets/icons/back-icon";
import { useAppDispatch } from "../../../store/store.hook";
import { logout } from "../../../store/auth/auth.slice";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import AvatarComponent from "../avatar.component";
import { SizesEnum } from "../../../common/helpers";

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
  //   const router = useRouter();
  //   const { account } = useEthers();
  const [isEdit, setIsEdit] = useState(false);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();
  // const [isDescEdit, setIsDescEdit] = useState(false)
  const {
    userInfo,
    updateUserInfo,
    refetchUserInfo,
    name,
    description,
    avatar,
    uploadImage,
  } = useUpdate(address || "");
  //   const lensId = useGetWalletProfileId(account || "");
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
    setPreviewValue(
      avatar && avatar !== null
        ? `${process.env.NEXT_PUBLIC_API_URL}avatars/${avatar}`
        : "/assets/images/temp-avatar.png"
    );
  }, [nickname, address, name, description, avatar, isOwner]);

  return (
    <>
      <View className="w-full pt-4 px-4  pb-3">
        <View className="flex-row justify-between items-center">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowBack />
          </Pressable>
          <Text className="text-xl font-bold ">{nameValue}</Text>
          <Pressable onPress={logOut}>
            <BackIcon />
          </Pressable>
        </View>
      </View>
      <View className="w-full items-center pt-2 pb-8 px-4 ">
        <AvatarComponent
          avatar={avatar}
          isLoading={false}
          size={SizesEnum.lg}
        />
        <Text className="text-md font-semibold text-gray-darker ml-1 text-center mt-2">
          {descValue}
        </Text>

        <Text className="text-base font-normal text-gray mb-5 text-center m-auto mt-4">
          Followers: {followers}
        </Text>

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
