import React, { useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import EyesIcon from "../assets/icons/eyes.tsx";
import Button from "../components/Button";
import Post from "../components/post/post";
import tempAvatar from "../assets/images/temp-avatar.png";

import { useQuery } from "@apollo/client";
import safeViewAndroid from "../helpers/safe-view-android";
import {
  useGetFeedQuery,
  useGetFilteredFeedQuery,
} from "../store/auth/auth.api";
import { GET_PUBLICATIONS } from "../store/lens/get-publication.query";

import { useAppDispatch } from "../store/store.hook";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetWalletProfileId } from "../contract/lens-hub.api";
import { GET_DEFAULT_PROFILES } from "../store/lens/get-profile.query";
import { useUpdate } from "../hooks/use-update-user.hook";
import { SERVER_URL } from "../constants/Api";
import AppLoader from "../components/app-loader.component";
import AvatarComponent from "../components/shared/avatar.component";
import { SizesEnum } from "../common/helpers";

function Feed({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Feed">) {
  const { data: dataFeeds, refetch: refetchFeeds } = useGetFilteredFeedQuery({
    take: 40,
    skip: 0,
  });
  const connector = useWalletConnect();
  const { value: myProfileId } = useGetWalletProfileId(
    connector.accounts[0] || ""
  );
  const drafts = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        publicationIds: dataFeeds?.data
          .filter((el: any) => el.lensId != null)
          .map((el: any) => el.lensId),
      },
    },
  });
  const { data: dataProfile, refetch: refetchProfile } = useQuery(
    GET_DEFAULT_PROFILES,
    {
      variables: {
        request: {
          profileId: myProfileId,
        },
      },
    }
  );

  const {
    userInfo,
    updateUserInfo,
    refetchUserInfo,
    name,
    description,
    avatar,
    isLoading: profileLoading,
    uploadImage,
  } = useUpdate(connector.accounts[0] || "");

  const [isFeedRefreshing, setFeedRefreshing] = useState(false);

  const dispatch = useAppDispatch();

  const refetchInfo = async () => {
    setFeedRefreshing(true);
    await refetchFeeds();
    await drafts.refetch();
    setFeedRefreshing(false);
  };

  const openProfile = (id: string) => {
    if (id == null) {
      return;
    }
    navigation.navigate(`Profile`, { id });
  };

  return (
    <SafeAreaView style={safeViewAndroid.AndroidSafeArea}>
      <View className="w-full pt-4 px-4 border-b border-border-color pb-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="mr-4 w-[40px] h-[38px] items-center justify-center">
              <EyesIcon />
            </View>
            <Text className="text-xl font-bold">frenly feed</Text>
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate("Profile", {
                id: myProfileId as string,
                currentUser: true,
              })
            }
          >
            <AvatarComponent
              isLoading={profileLoading}
              avatar={avatar}
              size={SizesEnum.sm}
            />
          </Pressable>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={refetchInfo}
            refreshing={isFeedRefreshing}
          />
        }
      >
        {dataFeeds ? (
          dataFeeds?.data?.map((el: any) => {
            const { isMirror, lensId, mirrorDescription } = el;

            let index;
            drafts?.data?.publications?.items?.forEach(
              (element: any, _index: number) => {
                if (element.id === lensId) {
                  index = _index;
                }
              }
            );
            if (drafts?.data?.publications?.items[Number(index)]) {
              const { createdAt, profile, metadata, id, stats, mirrorOf } =
                drafts?.data?.publications?.items[Number(index)];

              return (
                <Post
                  isUnpublishedPost={false}
                  key={id}
                  openProfile={openProfile}
                  data={{
                    from: metadata?.attributes[4].value,
                    to: metadata?.attributes[3].value,
                    contractAddress: metadata?.attributes[1].value,
                    info: metadata?.description,
                    image: metadata?.attributes[9]?.value,
                    name: profile?.handle,
                    date: createdAt,
                    showDate: false,
                    messageType: metadata?.attributes[5].value,
                    itemType: "nft",
                    totalUpvotes: stats?.totalUpvotes,
                    totalMirror: stats?.totalAmountOfMirrors,
                    id: id,
                    profileId: profile?.id,
                    refetchInfo: refetchInfo,
                    txHash: metadata?.attributes[8].value,
                    blockchainType: metadata?.attributes[7].value,
                    isMirror: isMirror,
                    handleMirror: mirrorOf?.profile.ownedBy,
                    creator: profile.ownedBy,
                    mirrorDescription,
                  }}
                ></Post>
              );
            }
          })
        ) : (
          <AppLoader />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Feed;
